import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { query } from '../config/database';
import { cache } from '../config/redis';
import { AppError } from '../utils/AppError';
import { Request, Response, NextFunction } from 'express';

const router = Router();
router.use(authenticate, authorize('admin'));

// ── Users ──────────────────────────────────────────────
router.get('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const params: any[] = [];
    let where = 'WHERE 1=1';
    let i = 1;
    if (search) { where += ` AND (u.username ILIKE $${i} OR u.email ILIKE $${i})`; params.push(`%${search}%`); i++; }
    if (role)   { where += ` AND u.role = $${i}`; params.push(role); i++; }

    const [users, count] = await Promise.all([
      query(
        `SELECT u.id, u.username, u.email, u.full_name, u.role, u.is_active,
                u.created_at, s.problems_solved, s.score
         FROM users u LEFT JOIN user_stats s ON s.user_id = u.id
         ${where} ORDER BY u.created_at DESC
         LIMIT $${i} OFFSET $${i+1}`,
        [...params, Number(limit), offset]
      ),
      query(`SELECT COUNT(*) FROM users u ${where}`, params),
    ]);

    res.json({ success: true, data: { users: users.rows, total: parseInt(count.rows[0].count) } });
  } catch (err) { next(err); }
});

router.patch('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { is_active, role } = req.body;
    await query(
      `UPDATE users SET is_active = COALESCE($1, is_active), role = COALESCE($2, role) WHERE id = $3`,
      [is_active ?? null, role ?? null, id]
    );
    await cache.del(`user:${id}`);
    res.json({ success: true });
  } catch (err) { next(err); }
});

router.delete('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM users WHERE id = $1', [id]);
    await cache.del(`user:${id}`);
    res.json({ success: true });
  } catch (err) { next(err); }
});

// ── Stats ──────────────────────────────────────────────
router.get('/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [users, problems, submissions, articles] = await Promise.all([
      query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE is_active) as active FROM users'),
      query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE is_published) as published, COUNT(*) FILTER (WHERE difficulty=\'Easy\') as easy, COUNT(*) FILTER (WHERE difficulty=\'Medium\') as medium, COUNT(*) FILTER (WHERE difficulty=\'Hard\') as hard FROM problems'),
      query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status=\'Accepted\') as accepted FROM submissions WHERE submitted_at >= NOW() - INTERVAL \'30 days\''),
      query('SELECT COUNT(*) as total FROM articles WHERE is_published'),
    ]);
    res.json({ success: true, data: { users: users.rows[0], problems: problems.rows[0], submissions_30d: submissions.rows[0], articles: articles.rows[0] } });
  } catch (err) { next(err); }
});

// ── Problems (admin view) ─────────────────────────────
router.get('/problems', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const result = await query(
      `SELECT p.id, p.number, p.title, p.slug, p.difficulty, p.is_published,
              p.total_submissions, p.accepted_submissions, p.acceptance_rate, p.created_at,
              u.username as created_by_name
       FROM problems p LEFT JOIN users u ON u.id = p.created_by
       ORDER BY p.number ASC LIMIT $1 OFFSET $2`,
      [Number(limit), offset]
    );
    res.json({ success: true, data: { problems: result.rows } });
  } catch (err) { next(err); }
});

// ── Articles (admin) ──────────────────────────────────
router.get('/articles', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await query(
      `SELECT a.id, a.title, a.slug, a.is_published, a.views, a.likes, a.created_at,
              u.username as author_name
       FROM articles a JOIN users u ON u.id = a.author_id
       ORDER BY a.created_at DESC LIMIT 100`
    );
    res.json({ success: true, data: { articles: result.rows } });
  } catch (err) { next(err); }
});

export default router;
