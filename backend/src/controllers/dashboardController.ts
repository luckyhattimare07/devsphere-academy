import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';
import { cache } from '../config/redis';

export class DashboardController {
  getDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;

      // Parallel queries
      const [statsResult, recentResult, bookmarksResult, activityResult] =
        await Promise.all([
          query(
            `SELECT us.*, u.username, u.avatar_url, u.full_name, u.streak_count
             FROM user_stats us
             JOIN users u ON u.id = us.user_id
             WHERE us.user_id = $1`,
            [userId]
          ),
          query(
            `SELECT DISTINCT ON (p.id) p.title, p.slug, p.difficulty, s.status, s.submitted_at
             FROM submissions s
             JOIN problems p ON p.id = s.problem_id
             WHERE s.user_id = $1
             ORDER BY p.id, s.submitted_at DESC
             LIMIT 10`,
            [userId]
          ),
          query(
            `SELECT p.title, p.slug, p.difficulty, p.acceptance_rate,
                    b.created_at as bookmarked_at
             FROM bookmarks b
             JOIN problems p ON p.id = b.problem_id
             WHERE b.user_id = $1
             ORDER BY b.created_at DESC
             LIMIT 5`,
            [userId]
          ),
          query(
            `SELECT date, count
             FROM daily_activity
             WHERE user_id = $1 AND date >= NOW() - INTERVAL '365 days'
             ORDER BY date ASC`,
            [userId]
          ),
        ]);

      // Recommended problems (not yet solved, matching user's typical difficulty)
      const stats = statsResult.rows[0];
      let recommendedDiff = 'Easy';
      if (stats) {
        if (stats.easy_solved > 20 && stats.medium_solved < 30) recommendedDiff = 'Medium';
        else if (stats.medium_solved > 30) recommendedDiff = 'Hard';
      }

      const recommendedResult = await query(
        `SELECT p.number, p.title, p.slug, p.difficulty, p.acceptance_rate,
                COALESCE(JSON_AGG(DISTINCT pt.name) FILTER (WHERE pt.id IS NOT NULL), '[]') as tags
         FROM problems p
         LEFT JOIN problem_tag_map ptm ON ptm.problem_id = p.id
         LEFT JOIN problem_tags pt ON pt.id = ptm.tag_id
         WHERE p.is_published = true
           AND p.difficulty = $1
           AND p.id NOT IN (
             SELECT DISTINCT problem_id FROM submissions
             WHERE user_id = $2 AND status = 'Accepted'
           )
         GROUP BY p.id
         ORDER BY RANDOM()
         LIMIT 5`,
        [recommendedDiff, userId]
      );

      res.json({
        success: true,
        data: {
          stats: stats || {},
          recent_submissions: recentResult.rows,
          bookmarks: bookmarksResult.rows,
          activity: activityResult.rows,
          recommended: recommendedResult.rows,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  getHeatmap = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await query(
        `SELECT date::text, count
         FROM daily_activity
         WHERE user_id = $1 AND date >= NOW() - INTERVAL '365 days'
         ORDER BY date ASC`,
        [userId]
      );
      res.json({ success: true, data: { activity: result.rows } });
    } catch (err) {
      next(err);
    }
  };

  getBookmarks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await query(
        `SELECT p.number, p.title, p.slug, p.difficulty, p.acceptance_rate,
                b.note, b.created_at,
                COALESCE(JSON_AGG(DISTINCT pt.name) FILTER (WHERE pt.id IS NOT NULL), '[]') as tags
         FROM bookmarks b
         JOIN problems p ON p.id = b.problem_id
         LEFT JOIN problem_tag_map ptm ON ptm.problem_id = p.id
         LEFT JOIN problem_tags pt ON pt.id = ptm.tag_id
         WHERE b.user_id = $1
         GROUP BY p.id, b.note, b.created_at
         ORDER BY b.created_at DESC`,
        [userId]
      );
      res.json({ success: true, data: { bookmarks: result.rows } });
    } catch (err) {
      next(err);
    }
  };

  getRecent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await query(
        `SELECT p.title, p.slug, p.difficulty, s.status, s.language,
                s.runtime_ms, s.submitted_at
         FROM submissions s
         JOIN problems p ON p.id = s.problem_id
         WHERE s.user_id = $1
         ORDER BY s.submitted_at DESC
         LIMIT 20`,
        [userId]
      );
      res.json({ success: true, data: { submissions: result.rows } });
    } catch (err) {
      next(err);
    }
  };
}
