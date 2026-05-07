import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { query, withTransaction } from '../config/database';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

const JUDGE0_LANGUAGE_IDS: Record<string, number> = {
  c: 50, cpp: 54, java: 62, python: 71, javascript: 63,
  typescript: 74, go: 60, rust: 73,
};

export class SubmissionController {
  submit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { problem_id, language, code } = req.body;
      const userId = (req as any).user.id;

      // Fetch problem + test cases
      const probResult = await query(
        `SELECT id, title, test_cases, time_limit, memory_limit
         FROM problems WHERE id = $1 AND is_published = true`,
        [problem_id]
      );
      if (!probResult.rowCount || probResult.rowCount === 0) {
        throw new AppError('Problem not found', 404);
      }

      const problem = probResult.rows[0];
      const testCases: any[] = problem.test_cases || [];

      if (testCases.length === 0) {
        throw new AppError('No test cases available for this problem', 400);
      }

      // Create pending submission
      const subResult = await query(
        `INSERT INTO submissions (user_id, problem_id, language, code, status)
         VALUES ($1, $2, $3, $4, 'Pending') RETURNING id`,
        [userId, problem_id, language, code]
      );
      const submissionId = subResult.rows[0].id;

     const judge0Url = process.env.JUDGE0_API_URL || 'http://host.docker.internal:2358';
const languageId = JUDGE0_LANGUAGE_IDS[language];

const headers = {
  'content-type': 'application/json',
};

      // Run all test cases
      const testResults: any[] = [];
      let overallStatus = 'Accepted';
      let totalRuntime = 0;
      let maxMemory = 0;

      for (const tc of testCases) {
        try {
          // Submit
          const submitRes = await axios.post(
            `${judge0Url}/submissions?base64_encoded=false&wait=true`,
            {
              language_id: languageId,
              source_code: code,
              stdin: tc.input || '',
              cpu_time_limit: (problem.time_limit || 2000) / 1000,
              memory_limit: problem.memory_limit || 262144,
              expected_output: tc.expected_output || tc.expected || '',
            },
            { headers, timeout: 15000 }
          );

          const result = submitRes.data;
          const passed = result.status?.id === 3;
          const tcRuntime = Math.round(parseFloat(result.time || '0') * 1000);
          totalRuntime += tcRuntime;
          maxMemory = Math.max(maxMemory, result.memory || 0);

          testResults.push({
            test_case_id: tc.id || testResults.length,
            passed,
            status: result.status?.description,
            status_id: result.status?.id,
            actual_output: result.stdout?.trim() || '',
            expected_output: tc.expected_output || tc.expected || '',
            runtime_ms: tcRuntime,
            memory_kb: result.memory || 0,
            is_hidden: tc.is_hidden || false,
          });

          if (!passed && overallStatus === 'Accepted') {
            overallStatus = mapStatus(result.status?.id);
          }
        } catch (tcErr: any) {
          testResults.push({
            test_case_id: tc.id || testResults.length,
            passed: false,
            status: 'Runtime Error',
            actual_output: '',
            expected_output: tc.expected_output || tc.expected || '',
            runtime_ms: 0,
            is_hidden: tc.is_hidden || false,
          });
          if (overallStatus === 'Accepted') overallStatus = 'Runtime Error';
        }
      }

      const avgRuntime = testCases.length > 0 ? Math.round(totalRuntime / testCases.length) : 0;

      // Update submission
      await query(
        `UPDATE submissions SET
          status = $1, runtime_ms = $2, memory_kb = $3, test_results = $4
         WHERE id = $5`,
        [overallStatus, avgRuntime, maxMemory, JSON.stringify(testResults), submissionId]
      );

      const passedCount = testResults.filter((t) => t.passed).length;

      res.json({
        success: true,
        data: {
          submission_id: submissionId,
          status: overallStatus,
          passed: overallStatus === 'Accepted',
          runtime_ms: avgRuntime,
          memory_kb: maxMemory,
          test_results: testResults.map((t) => ({
            ...t,
            actual_output: t.is_hidden ? undefined : t.actual_output,
            expected_output: t.is_hidden ? undefined : t.expected_output,
          })),
          summary: { passed: passedCount, total: testCases.length },
        },
      });
    } catch (err) {
      next(err);
    }
  };

  mySubmissions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const { page = 1, limit = 20, problem_id } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let whereClause = 'WHERE s.user_id = $1';
      const params: any[] = [userId];
      if (problem_id) {
        whereClause += ' AND s.problem_id = $2';
        params.push(problem_id);
      }

      const result = await query(
        `SELECT s.id, s.language, s.status, s.runtime_ms, s.memory_kb, s.submitted_at,
                p.title as problem_title, p.slug as problem_slug, p.difficulty
         FROM submissions s
         JOIN problems p ON p.id = s.problem_id
         ${whereClause}
         ORDER BY s.submitted_at DESC
         LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        [...params, Number(limit), offset]
      );

      res.json({ success: true, data: { submissions: result.rows } });
    } catch (err) {
      next(err);
    }
  };

  getSubmission = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      const isAdmin = (req as any).user.role === 'admin';

      const result = await query(
        `SELECT s.*, p.title as problem_title, p.slug as problem_slug
         FROM submissions s
         JOIN problems p ON p.id = s.problem_id
         WHERE s.id = $1 ${isAdmin ? '' : 'AND s.user_id = $2'}`,
        isAdmin ? [id] : [id, userId]
      );

      if (!result.rowCount || result.rowCount === 0) {
        throw new AppError('Submission not found', 404);
      }

      res.json({ success: true, data: { submission: result.rows[0] } });
    } catch (err) {
      next(err);
    }
  };

  problemSubmissions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { problemId } = req.params;
      const userId = (req as any).user.id;

      const result = await query(
        `SELECT s.id, s.language, s.status, s.runtime_ms, s.memory_kb, s.submitted_at,
                u.username, u.avatar_url
         FROM submissions s
         JOIN users u ON u.id = s.user_id
         WHERE s.problem_id = $1 AND s.status = 'Accepted'
         ORDER BY s.runtime_ms ASC NULLS LAST
         LIMIT 50`,
        [problemId]
      );

      res.json({ success: true, data: { submissions: result.rows } });
    } catch (err) {
      next(err);
    }
  };
}

function mapStatus(statusId?: number): string {
  const map: Record<number, string> = {
    4: 'Wrong Answer',
    5: 'Time Limit Exceeded',
    6: 'Compile Error',
    7: 'Runtime Error', 8: 'Runtime Error', 9: 'Runtime Error',
    10: 'Runtime Error', 11: 'Runtime Error', 12: 'Runtime Error',
  };
  return (statusId && map[statusId]) || 'Runtime Error';
}
