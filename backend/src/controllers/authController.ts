import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { query, withTransaction } from '../config/database';
import { cache } from '../config/redis';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

const SALT_ROUNDS = 12;
const ACCESS_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_EXPIRES = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

const generateTokens = (userId: string, role: string) => {
  const accessToken = jwt.sign(
    { sub: userId, role },
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRES as any }
  );
  const refreshToken = jwt.sign(
    { sub: userId, jti: uuidv4() },
    REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRES as any }
  );
  return { accessToken, refreshToken };
};

export class AuthController {
  // POST /register
  register = async (req: Request, res: Response, next: NextFunction) => {
    try { 
      const { email, password, full_name } = req.body;

// auto username
const username = req.body.username || email.split("@")[0];

if (!email || !password) {
  throw new AppError("Email and password required", 400);
}

      // Check existing
      const existing = await query(
        'SELECT id FROM users WHERE email = $1 OR username = $2',
        [email, username]
      );
      if (existing.rowCount && existing.rowCount > 0) {
        throw new AppError('Email or username already in use', 409);
      }

      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

      const result = await withTransaction(async (client) => {
        const userRes = await client.query(
          `INSERT INTO users (username, email, password_hash, full_name)
           VALUES ($1, $2, $3, $4)
           RETURNING id, username, email, full_name, role, created_at`,
          [username, email, passwordHash, full_name || null]
        );
        const user = userRes.rows[0];

        // Initialize user_stats
        await client.query(
          'INSERT INTO user_stats (user_id) VALUES ($1)',
          [user.id]
        );

        return user;
      });

      const { accessToken, refreshToken } = generateTokens(result.id, result.role);

      // Store refresh token
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await query(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
        [result.id, refreshToken, expiresAt]
      );

      logger.info(`New user registered: ${result.email}`);

      res.status(201).json({
        success: true,
        data: {
          user: result,
          accessToken,
          refreshToken,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  // POST /login
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const result = await query(
        `SELECT id, username, email, password_hash, full_name, avatar_url, role, is_active
         FROM users WHERE email = $1`,
        [email]
      );

      if (!result.rowCount || result.rowCount === 0) {
        throw new AppError('Invalid credentials', 401);
      }

      const user = result.rows[0];

      if (!user.is_active) {
        throw new AppError('Account suspended. Contact support.', 403);
      }

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        throw new AppError('Invalid credentials', 401);
      }

      const { accessToken, refreshToken } = generateTokens(user.id, user.role);

      // Store refresh token (cleanup old ones)
      await query('DELETE FROM refresh_tokens WHERE user_id = $1 AND expires_at < NOW()', [user.id]);
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await query(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
        [user.id, refreshToken, expiresAt]
      );

      // Update last_active
      await query('UPDATE users SET last_active = NOW() WHERE id = $1', [user.id]);

      // Cache user data
      await cache.set(`user:${user.id}`, user, 900); // 15min

      logger.info(`User logged in: ${user.email}`);

      const { password_hash, ...safeUser } = user;

      res.json({
        success: true,
        data: {
          user: safeUser,
          accessToken,
          refreshToken,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  // POST /refresh
  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw new AppError('Refresh token required', 401);

      // Verify token
      let payload: any;
      try {
        payload = jwt.verify(refreshToken, REFRESH_SECRET);
      } catch {
        throw new AppError('Invalid or expired refresh token', 401);
      }

      // Check in DB
      const tokenResult = await query(
        'SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
        [refreshToken]
      );
      if (!tokenResult.rowCount || tokenResult.rowCount === 0) {
        throw new AppError('Refresh token revoked', 401);
      }

      const userResult = await query(
        'SELECT id, username, email, role FROM users WHERE id = $1',
        [payload.sub]
      );
      if (!userResult.rowCount || userResult.rowCount === 0) {
        throw new AppError('User not found', 401);
      }

      const user = userResult.rows[0];
      const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id, user.role);

      // Rotate refresh token
      await query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await query(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
        [user.id, newRefreshToken, expiresAt]
      );

      res.json({
        success: true,
        data: { accessToken, refreshToken: newRefreshToken },
      });
    } catch (err) {
      next(err);
    }
  };

  // POST /logout
  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const { refreshToken } = req.body;

      if (refreshToken) {
        await query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
      }
      await cache.del(`user:${userId}`);

      res.json({ success: true, message: 'Logged out successfully' });
    } catch (err) {
      next(err);
    }
  };

  // POST /forgot-password
  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const result = await query('SELECT id FROM users WHERE email = $1', [email]);

      // Always return success (don't leak email existence)
      if (result.rowCount && result.rowCount > 0) {
        const userId = result.rows[0].id;
        const token = uuidv4().replace(/-/g, '');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await query(
          'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
          [userId, token, expiresAt]
        );
        // TODO: Send email with reset link
        logger.info(`Password reset requested for: ${email}, token: ${token}`);
      }

      res.json({
        success: true,
        message: 'If that email exists, a reset link has been sent.',
      });
    } catch (err) {
      next(err);
    }
  };

  // POST /reset-password
  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, password } = req.body;

      const result = await query(
        'SELECT user_id FROM password_reset_tokens WHERE token = $1 AND expires_at > NOW() AND used = false',
        [token]
      );

      if (!result.rowCount || result.rowCount === 0) {
        throw new AppError('Invalid or expired reset token', 400);
      }

      const userId = result.rows[0].user_id;
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

      await withTransaction(async (client) => {
        await client.query(
          'UPDATE users SET password_hash = $1 WHERE id = $2',
          [passwordHash, userId]
        );
        await client.query(
          'UPDATE password_reset_tokens SET used = true WHERE token = $1',
          [token]
        );
        await client.query(
          'DELETE FROM refresh_tokens WHERE user_id = $1',
          [userId]
        );
      });

      res.json({ success: true, message: 'Password reset successfully' });
    } catch (err) {
      next(err);
    }
  };

  // GET /me
  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;

      // Try cache first
      const cached = await cache.get<any>(`user:${userId}`);
      if (cached) {
        return res.json({ success: true, data: { user: cached } });
      }

      const result = await query(
        `SELECT u.id, u.username, u.email, u.full_name, u.avatar_url, u.bio,
                u.github_url, u.linkedin_url, u.website_url, u.role,
                u.streak_count, u.last_active, u.created_at,
                s.problems_solved, s.easy_solved, s.medium_solved, s.hard_solved,
                s.score, s.ranking, s.streak_current, s.streak_max
         FROM users u
         LEFT JOIN user_stats s ON s.user_id = u.id
         WHERE u.id = $1`,
        [userId]
      );

      if (!result.rowCount || result.rowCount === 0) {
        throw new AppError('User not found', 404);
      }

      const user = result.rows[0];
      await cache.set(`user:${userId}`, user, 900);

      res.json({ success: true, data: { user } });
    } catch (err) {
      next(err);
    }
  };
}
