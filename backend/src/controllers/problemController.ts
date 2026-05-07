import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';
import { cache } from '../config/redis';
import { AppError } from '../utils/AppError';

export class ProblemController {
  // GET /problems
  listProblems = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        page = 1, limit = 20, difficulty, tag, category, search, status
      } = req.query;
      const offset = (Number(page) - 1) * Number(limit);
      const userId = (req as any).user?.id;

      const cacheKey = `problems:list:${JSON.stringify(req.query)}`;
      if (!userId) {
        const cached = await cache.get(cacheKey);
        if (cached) return res.json(cached);
      }

      let whereConditions = ['p.is_published = true'];
      const params: any[] = [];
      let paramIdx = 1;

      if (difficulty) {
        whereConditions.push(`p.difficulty = $${paramIdx++}`);
        params.push(difficulty);
      }

      if (category) {
        whereConditions.push(`p.category = $${paramIdx++}`);
        params.push(category);
      }

      if (tag) {
        whereConditions.push(`
          EXISTS (
            SELECT 1 FROM problem_tag_map ptm
            JOIN problem_tags pt ON pt.id = ptm.tag_id
            WHERE ptm.problem_id = p.id AND pt.slug = $${paramIdx++}
          )
        `);
        params.push(tag);
      }

      if (search) {
        whereConditions.push(`p.title ILIKE $${paramIdx++}`);
        params.push(`%${search}%`);
      }

      const whereClause = whereConditions.length > 0
        ? `WHERE ${whereConditions.join(' AND ')}`
        : '';

      // Total count
      const countResult = await query(
        `SELECT COUNT(*) FROM problems p ${whereClause}`,
        params
      );
      const total = parseInt(countResult.rows[0].count);

      // Main query
      params.push(Number(limit), offset);
      const problemsResult = await query(
        `SELECT
          p.id, p.number, p.title, p.slug, p.difficulty, p.category,
          p.acceptance_rate, p.total_submissions, p.is_premium,
          COALESCE(
            JSON_AGG(DISTINCT jsonb_build_object('name', pt.name, 'slug', pt.slug, 'color', pt.color))
            FILTER (WHERE pt.id IS NOT NULL), '[]'
          ) as tags,
          ${userId ? `
            (SELECT status FROM submissions
             WHERE user_id = '${userId}' AND problem_id = p.id
             ORDER BY submitted_at DESC LIMIT 1) as submission_status,
            EXISTS(SELECT 1 FROM bookmarks WHERE user_id = '${userId}' AND problem_id = p.id) as bookmarked
          ` : 'null as submission_status, false as bookmarked'}
        FROM problems p
        LEFT JOIN problem_tag_map ptm ON ptm.problem_id = p.id
        LEFT JOIN problem_tags pt ON pt.id = ptm.tag_id
        ${whereClause}
        GROUP BY p.id
        ORDER BY p.number ASC
        LIMIT $${paramIdx++} OFFSET $${paramIdx++}`,
        params
      );

      const response = {
        success: true,
        data: {
          problems: problemsResult.rows,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
          },
        },
      };

      if (!userId) await cache.set(cacheKey, response, 300);
      res.json(response);
    } catch (err) {
      next(err);
    }
  };

  // GET /problems/:slug
  getProblem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;
      const userId = (req as any).user?.id;

      const cacheKey = `problem:${slug}`;
      const cached = await cache.get(cacheKey);
      if (cached && !userId) return res.json(cached);

      const result = await query(
        `SELECT
          p.*,
          COALESCE(
            JSON_AGG(DISTINCT jsonb_build_object('name', pt.name, 'slug', pt.slug, 'color', pt.color))
            FILTER (WHERE pt.id IS NOT NULL), '[]'
          ) as tags,
          u.username as created_by_username,
          ${userId ? `
            (SELECT status FROM submissions WHERE user_id = $2 AND problem_id = p.id
             ORDER BY submitted_at DESC LIMIT 1) as user_status,
            EXISTS(SELECT 1 FROM bookmarks WHERE user_id = $2 AND problem_id = p.id) as bookmarked
          ` : 'null as user_status, false as bookmarked'}
        FROM problems p
        LEFT JOIN problem_tag_map ptm ON ptm.problem_id = p.id
        LEFT JOIN problem_tags pt ON pt.id = ptm.tag_id
        LEFT JOIN users u ON u.id = p.created_by
        WHERE p.slug = $1 AND p.is_published = true
        GROUP BY p.id, u.username`,
        userId ? [slug, userId] : [slug]
      );

      if (!result.rowCount || result.rowCount === 0) {
        throw new AppError('Problem not found', 404);
      }

      const problem = result.rows[0];
      // Don't expose hidden test cases or solution codes to non-admins
      if ((req as any).user?.role !== 'admin') {
        if (problem.test_cases) {
          problem.test_cases = problem.test_cases.filter((tc: any) => !tc.is_hidden);
        }
        delete problem.solution_codes;
      }

      const response = { success: true, data: { problem } };
      if (!userId) await cache.set(cacheKey, response, 600);

      res.json(response);
    } catch (err) {
      next(err);
    }
  };

  // POST /problems
  createProblem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const {
        title, description, difficulty, category, constraints, examples,
        starter_codes, solution_codes, test_cases, hints, time_limit, memory_limit,
        is_published, tags
      } = req.body;

      const slugify = (await import('slugify')).default;
      const slug = slugify(title, { lower: true, strict: true });

      // Check slug uniqueness
      const existing = await query('SELECT id FROM problems WHERE slug = $1', [slug]);
      if (existing.rowCount && existing.rowCount > 0) {
        throw new AppError('A problem with this title already exists', 409);
      }

      const result = await query(
        `INSERT INTO problems (
          title, slug, description, difficulty, category, constraints,
          examples, starter_codes, solution_codes, test_cases, hints,
          time_limit, memory_limit, is_published, created_by
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
        RETURNING *`,
        [
          title, slug, description, difficulty, category, constraints,
          JSON.stringify(examples || []),
          JSON.stringify(starter_codes || {}),
          JSON.stringify(solution_codes || {}),
          JSON.stringify(test_cases || []),
          JSON.stringify(hints || []),
          time_limit || 2000,
          memory_limit || 262144,
          is_published ?? false,
          userId
        ]
      );

      const problem = result.rows[0];

      // Add tags
      if (tags && tags.length > 0) {
        const tagRows = await query(
          'SELECT id FROM problem_tags WHERE slug = ANY($1)',
          [tags]
        );
        for (const tag of tagRows.rows) {
          await query(
            'INSERT INTO problem_tag_map (problem_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [problem.id, tag.id]
          );
        }
      }

      await cache.delPattern('problems:list:*');

      res.status(201).json({ success: true, data: { problem } });
    } catch (err) {
      next(err);
    }
  };

  // PUT /problems/:id
  updateProblem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const allowedFields = [
        'title', 'description', 'difficulty', 'category', 'constraints',
        'examples', 'starter_codes', 'solution_codes', 'test_cases', 'hints',
        'time_limit', 'memory_limit', 'is_published', 'editorial'
      ];

      const setClauses: string[] = [];
      const params: any[] = [];
      let paramIdx = 1;

      for (const field of allowedFields) {
        if (updates[field] !== undefined) {
          setClauses.push(`${field} = $${paramIdx++}`);
          const value = typeof updates[field] === 'object'
            ? JSON.stringify(updates[field])
            : updates[field];
          params.push(value);
        }
      }

      if (setClauses.length === 0) {
        throw new AppError('No valid fields to update', 400);
      }

      params.push(id);
      const result = await query(
        `UPDATE problems SET ${setClauses.join(', ')} WHERE id = $${paramIdx} RETURNING *`,
        params
      );

      if (!result.rowCount || result.rowCount === 0) {
        throw new AppError('Problem not found', 404);
      }

      await cache.delPattern(`problem:*`);
      await cache.delPattern('problems:list:*');

      res.json({ success: true, data: { problem: result.rows[0] } });
    } catch (err) {
      next(err);
    }
  };

  // DELETE /problems/:id
  deleteProblem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await query('DELETE FROM problems WHERE id = $1 RETURNING id', [id]);
      if (!result.rowCount || result.rowCount === 0) {
        throw new AppError('Problem not found', 404);
      }
      await cache.delPattern('problems:*');
      res.json({ success: true, message: 'Problem deleted' });
    } catch (err) {
      next(err);
    }
  };

  // POST /problems/:id/bookmark
  toggleBookmark = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      const existing = await query(
        'SELECT id FROM bookmarks WHERE user_id = $1 AND problem_id = $2',
        [userId, id]
      );

      if (existing.rowCount && existing.rowCount > 0) {
        await query('DELETE FROM bookmarks WHERE user_id = $1 AND problem_id = $2', [userId, id]);
        res.json({ success: true, bookmarked: false });
      } else {
        await query(
          'INSERT INTO bookmarks (user_id, problem_id) VALUES ($1, $2)',
          [userId, id]
        );
        res.json({ success: true, bookmarked: true });
      }
    } catch (err) {
      next(err);
    }
  };

  // GET /problems/random
  randomProblem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { difficulty } = req.query;
      const params: any[] = [];
      let whereClause = 'WHERE is_published = true';
      if (difficulty) {
        whereClause += ` AND difficulty = $1`;
        params.push(difficulty);
      }
      const result = await query(
        `SELECT slug FROM problems ${whereClause} ORDER BY RANDOM() LIMIT 1`,
        params
      );
      if (!result.rowCount || result.rowCount === 0) {
        throw new AppError('No problems found', 404);
      }
      res.json({ success: true, data: { slug: result.rows[0].slug } });
    } catch (err) {
      next(err);
    }
  };

  // GET /problems/tags
  getTags = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cached = await cache.get('problem:tags');
      if (cached) return res.json(cached);

      const result = await query(
        `SELECT pt.*, COUNT(ptm.problem_id) as problem_count
         FROM problem_tags pt
         LEFT JOIN problem_tag_map ptm ON ptm.tag_id = pt.id
         GROUP BY pt.id
         ORDER BY problem_count DESC`
      );
      const response = { success: true, data: { tags: result.rows } };
      await cache.set('problem:tags', response, 3600);
      res.json(response);
    } catch (err) {
      next(err);
    }
  };

  // GET /problems/:id/similar
  getSimilarProblems = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await query(
        `SELECT DISTINCT p.number, p.title, p.slug, p.difficulty, p.acceptance_rate
         FROM problems p
         JOIN problem_tag_map ptm ON ptm.problem_id = p.id
         WHERE ptm.tag_id IN (
           SELECT tag_id FROM problem_tag_map WHERE problem_id = $1
         )
         AND p.id != $1
         AND p.is_published = true
         ORDER BY RANDOM()
         LIMIT 5`,
        [id]
      );
      res.json({ success: true, data: { problems: result.rows } });
    } catch (err) {
      next(err);
    }
  };
}
