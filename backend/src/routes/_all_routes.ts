// leaderboard.ts
import { Router } from 'express';
import { query } from '../config/database';
import { cache } from '../config/redis';
import { Request, Response, NextFunction } from 'express';

const leaderboardRouter = Router();

leaderboardRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cached = await cache.get('leaderboard:global');
    if (cached) return res.json(cached);

    const result = await query(
      `SELECT u.id, u.username, u.avatar_url, u.full_name,
              s.problems_solved, s.easy_solved, s.medium_solved, s.hard_solved,
              s.score, s.streak_current,
              RANK() OVER (ORDER BY s.score DESC) as rank
       FROM user_stats s
       JOIN users u ON u.id = s.user_id
       WHERE u.is_active = true AND s.problems_solved > 0
       ORDER BY s.score DESC
       LIMIT 100`
    );

    // Update rankings in DB
    for (const user of result.rows) {
      await query('UPDATE user_stats SET ranking = $1 WHERE user_id = $2', [user.rank, user.id]);
    }

    const response = { success: true, data: { leaderboard: result.rows } };
    await cache.set('leaderboard:global', response, 300);
    res.json(response);
  } catch (err) { next(err); }
});

export { leaderboardRouter };

// ============================================================
// articles.ts
import { Router as ArticleRouter } from 'express';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { query as dbQuery } from '../config/database';
import { cache as articleCache } from '../config/redis';

const articlesRouter = ArticleRouter();

articlesRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 12, category, search, featured } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const params: any[] = [];
    let where = 'WHERE a.is_published = true';
    let i = 1;
    if (category) { where += ` AND ac.slug = $${i++}`; params.push(category); }
    if (featured)  { where += ' AND a.is_featured = true'; }
    if (search)    { where += ` AND a.title ILIKE $${i++}`; params.push(`%${search}%`); }

    const result = await dbQuery(
      `SELECT a.id, a.title, a.slug, a.excerpt, a.cover_image, a.read_time,
              a.views, a.likes, a.tags, a.published_at, a.is_featured,
              u.username as author_name, u.avatar_url as author_avatar,
              ac.name as category_name, ac.slug as category_slug, ac.color as category_color
       FROM articles a
       JOIN users u ON u.id = a.author_id
       LEFT JOIN article_categories ac ON ac.id = a.category_id
       ${where}
       ORDER BY a.is_featured DESC, a.published_at DESC
       LIMIT $${i} OFFSET $${i+1}`,
      [...params, Number(limit), offset]
    );
    res.json({ success: true, data: { articles: result.rows } });
  } catch (err) { next(err); }
});

articlesRouter.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const result = await dbQuery(
      `SELECT a.*, u.username as author_name, u.avatar_url as author_avatar,
              u.bio as author_bio, ac.name as category_name, ac.slug as category_slug
       FROM articles a
       JOIN users u ON u.id = a.author_id
       LEFT JOIN article_categories ac ON ac.id = a.category_id
       WHERE a.slug = $1 AND a.is_published = true`,
      [slug]
    );
    if (!result.rowCount || result.rowCount === 0) {
      return (next as any)(new Error('Article not found'));
    }
    // Increment views
    await dbQuery('UPDATE articles SET views = views + 1 WHERE slug = $1', [slug]);
    res.json({ success: true, data: { article: result.rows[0] } });
  } catch (err) { next(err); }
});

articlesRouter.post('/', authenticate, authorize('admin', 'moderator'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, excerpt, content, cover_image, category_id, tags, read_time, is_published, is_featured } = req.body;
      const authorId = (req as any).user.id;
      const slugify = (await import('slugify')).default;
      const slug = slugify(title, { lower: true, strict: true }) + '-' + Date.now();
      const result = await dbQuery(
        `INSERT INTO articles (title, slug, excerpt, content, cover_image, category_id, author_id, tags, read_time, is_published, is_featured, published_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
        [title, slug, excerpt, content, cover_image, category_id, authorId,
         JSON.stringify(tags || []), read_time || 5, is_published ?? false, is_featured ?? false,
         is_published ? new Date() : null]
      );
      await articleCache.delPattern('articles:*');
      res.status(201).json({ success: true, data: { article: result.rows[0] } });
    } catch (err) { next(err); }
  }
);

export { articlesRouter };

// ============================================================
// dsa.ts
import { Router as DsaRouter } from 'express';

const dsaRouter = DsaRouter();

dsaRouter.get('/categories', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await dbQuery(
      `SELECT dc.*, COUNT(dt.id) as topic_count
       FROM dsa_categories dc
       LEFT JOIN dsa_topics dt ON dt.category_id = dc.id AND dt.is_published = true
       WHERE dc.is_active = true
       GROUP BY dc.id ORDER BY dc.sort_order`
    );
    res.json({ success: true, data: { categories: result.rows } });
  } catch (err) { next(err); }
});

dsaRouter.get('/categories/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await dbQuery(
      `SELECT dc.*, JSON_AGG(dt.* ORDER BY dt.sort_order) as topics
       FROM dsa_categories dc
       LEFT JOIN dsa_topics dt ON dt.category_id = dc.id AND dt.is_published = true
       WHERE dc.slug = $1
       GROUP BY dc.id`,
      [req.params.slug]
    );
    if (!result.rowCount || result.rowCount === 0) return (next as any)(new Error('Category not found'));
    res.json({ success: true, data: { category: result.rows[0] } });
  } catch (err) { next(err); }
});

dsaRouter.get('/topics/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await dbQuery(
      `SELECT dt.*, dc.name as category_name, dc.slug as category_slug
       FROM dsa_topics dt
       JOIN dsa_categories dc ON dc.id = dt.category_id
       WHERE dt.slug = $1 AND dt.is_published = true`,
      [req.params.slug]
    );
    if (!result.rowCount || result.rowCount === 0) return (next as any)(new Error('Topic not found'));
    res.json({ success: true, data: { topic: result.rows[0] } });
  } catch (err) { next(err); }
});

export { dsaRouter };

// ============================================================
// discussions.ts
import { Router as DiscRouter } from 'express';

const discussionsRouter = DiscRouter();

discussionsRouter.get('/problem/:problemId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await dbQuery(
      `SELECT d.*, u.username, u.avatar_url,
              COUNT(r.id) as reply_count
       FROM discussions d
       JOIN users u ON u.id = d.user_id
       LEFT JOIN discussions r ON r.parent_id = d.id
       WHERE d.problem_id = $1 AND d.parent_id IS NULL
       GROUP BY d.id, u.username, u.avatar_url
       ORDER BY d.is_pinned DESC, d.upvotes DESC, d.created_at DESC
       LIMIT 50`,
      [req.params.problemId]
    );
    res.json({ success: true, data: { discussions: result.rows } });
  } catch (err) { next(err); }
});

discussionsRouter.post('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { problem_id, parent_id, content, title } = req.body;
    const userId = (req as any).user.id;
    const result = await dbQuery(
      `INSERT INTO discussions (problem_id, user_id, parent_id, content, title)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [problem_id, userId, parent_id || null, content, title || null]
    );
    res.status(201).json({ success: true, data: { discussion: result.rows[0] } });
  } catch (err) { next(err); }
});

export { discussionsRouter };

// ============================================================
// languages.ts
import { Router as LangRouter } from 'express';

const languagesRouter = LangRouter();

languagesRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cached = await articleCache.get('languages:all');
    if (cached) return res.json(cached);
    const result = await dbQuery('SELECT * FROM programming_languages WHERE is_active = true ORDER BY sort_order');
    const response = { success: true, data: { languages: result.rows } };
    await articleCache.set('languages:all', response, 3600);
    res.json(response);
  } catch (err) { next(err); }
});

languagesRouter.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lang = await dbQuery('SELECT * FROM programming_languages WHERE slug = $1', [req.params.slug]);
    if (!lang.rowCount || lang.rowCount === 0) return (next as any)(new Error('Language not found'));
    const chapters = await dbQuery(
      `SELECT tc.*, JSON_AGG(tt.* ORDER BY tt.sort_order) as topics
       FROM tutorial_chapters tc
       LEFT JOIN tutorial_topics tt ON tt.chapter_id = tc.id AND tt.is_published = true
       WHERE tc.language_id = $1 AND tc.is_published = true
       GROUP BY tc.id ORDER BY tc.sort_order`,
      [lang.rows[0].id]
    );
    res.json({ success: true, data: { language: lang.rows[0], chapters: chapters.rows } });
  } catch (err) { next(err); }
});

languagesRouter.get('/:slug/topics/:topicSlug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await dbQuery(
      `SELECT tt.*, tc.title as chapter_title, pl.name as language_name, pl.slug as language_slug
       FROM tutorial_topics tt
       JOIN tutorial_chapters tc ON tc.id = tt.chapter_id
       JOIN programming_languages pl ON pl.id = tc.language_id
       WHERE pl.slug = $1 AND tt.slug = $2 AND tt.is_published = true`,
      [req.params.slug, req.params.topicSlug]
    );
    if (!result.rowCount || result.rowCount === 0) return (next as any)(new Error('Topic not found'));
    res.json({ success: true, data: { topic: result.rows[0] } });
  } catch (err) { next(err); }
});

export { languagesRouter };

// ============================================================
// users.ts
import { Router as UsersRouter } from 'express';

const usersRouter = UsersRouter();

usersRouter.get('/:username', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await dbQuery(
      `SELECT u.id, u.username, u.full_name, u.avatar_url, u.bio,
              u.github_url, u.linkedin_url, u.website_url, u.created_at,
              s.problems_solved, s.easy_solved, s.medium_solved, s.hard_solved,
              s.score, s.ranking, s.streak_current, s.streak_max
       FROM users u LEFT JOIN user_stats s ON s.user_id = u.id
       WHERE u.username = $1 AND u.is_active = true`,
      [req.params.username]
    );
    if (!result.rowCount || result.rowCount === 0) return (next as any)(new Error('User not found'));
    res.json({ success: true, data: { user: result.rows[0] } });
  } catch (err) { next(err); }
});

usersRouter.patch('/me', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { full_name, bio, github_url, linkedin_url, website_url } = req.body;
    const result = await dbQuery(
      `UPDATE users SET
        full_name = COALESCE($1, full_name),
        bio = COALESCE($2, bio),
        github_url = COALESCE($3, github_url),
        linkedin_url = COALESCE($4, linkedin_url),
        website_url = COALESCE($5, website_url)
       WHERE id = $6 RETURNING id, username, email, full_name, bio, github_url, linkedin_url, website_url`,
      [full_name, bio, github_url, linkedin_url, website_url, userId]
    );
    await articleCache.del(`user:${userId}`);
    res.json({ success: true, data: { user: result.rows[0] } });
  } catch (err) { next(err); }
});

export { usersRouter };
