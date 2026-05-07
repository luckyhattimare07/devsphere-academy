import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { query } from '../config/database';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

// Judge0 language IDs
const JUDGE0_LANGUAGE_IDS: Record<string, number> = {
  c:          50,   // C (GCC 9.2.0)
  cpp:        54,   // C++ (GCC 9.2.0)
  java:       62,   // Java (OpenJDK 13.0.1)
  python:     71,   // Python (3.8.1)
  javascript: 63,   // JavaScript (Node.js 12.14.0)
  typescript: 74,   // TypeScript (3.7.4)
  go:         60,   // Go (1.13.5)
  rust:       73,   // Rust (1.40.0)
};

const JUDGE0_STATUS: Record<number, string> = {
  1:  'In Queue',
  2:  'Processing',
  3:  'Accepted',
  4:  'Wrong Answer',
  5:  'Time Limit Exceeded',
  6:  'Compilation Error',
  7:  'Runtime Error (SIGSEGV)',
  8:  'Runtime Error (SIGXFSZ)',
  9:  'Runtime Error (SIGFPE)',
  10: 'Runtime Error (SIGABRT)',
  11: 'Runtime Error (NZEC)',
  12: 'Runtime Error (Other)',
  13: 'Internal Error',
  14: 'Exec Format Error',
};

const SUPPORTED_LANGUAGES = [
  { id: 'c',          name: 'C',          version: 'GCC 9.2.0',          icon: '🔵', color: '#555555' },
  { id: 'cpp',        name: 'C++',        version: 'GCC 9.2.0',          icon: '🟣', color: '#f34b7d' },
  { id: 'java',       name: 'Java',       version: 'OpenJDK 13.0.1',     icon: '🟠', color: '#b07219' },
  { id: 'python',     name: 'Python',     version: '3.8.1',              icon: '🟡', color: '#3572A5' },
  { id: 'javascript', name: 'JavaScript', version: 'Node.js 12.14.0',    icon: '🟤', color: '#f1e05a' },
  { id: 'typescript', name: 'TypeScript', version: '3.7.4',              icon: '🔷', color: '#2b7489' },
  { id: 'go',         name: 'Go',         version: '1.13.5',             icon: '🩵', color: '#00ADD8' },
  { id: 'rust',       name: 'Rust',       version: '1.40.0',             icon: '🦀', color: '#dea584' },
];

export class CompilerController {
  execute = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { language, source_code, stdin } = req.body;
      const userId = (req as any).user?.id;

      const languageId = JUDGE0_LANGUAGE_IDS[language];
      if (!languageId) throw new AppError(`Unsupported language: ${language}`, 400);

      const judge0Url = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
      

      // Execute directly with Judge0 (synchronous)
const response = await axios.post(
  `${judge0Url}/submissions?base64_encoded=false&wait=true`,
  {
    language_id: languageId,
    source_code,
    stdin: stdin || '',
  },
  {
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 20000,
  }
);

const result = response.data;

       const executionData = {
  token: result?.token || '',
  status: result?.status?.description || 'Completed',
  status_id: result?.status?.id || 3,

  stdout:
    result?.stdout ||
    result?.compile_output ||
    result?.stderr ||
    'Execution completed successfully',

  stderr: result?.stderr || '',

  time: result?.time || '0',
  memory: result?.memory || 0,
  exit_code: result?.exit_code || 0,
};

      // Log execution to DB
      if (userId) {
        await query(
          `INSERT INTO code_executions
            (user_id, language, source_code, stdin, stdout, stderr, exit_code, runtime_ms, memory_kb, judge0_token)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            userId, language, source_code, stdin || '',
            executionData.stdout, executionData.stderr,
            executionData.exit_code,
            Math.round((parseFloat(executionData.time || '0')) * 1000),
            executionData.memory || 0,
            executionData.token
          ]
        ).catch((err) => logger.warn('Failed to log code execution:', err));
      }

      res.json({ success: true, data: executionData });
    } catch (err: any) {
      if (err.response?.status === 429) {
        return next(new AppError('Rate limit exceeded for code execution', 429));
      }
      next(err);
    }
  };

  getStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.params;
      const judge0Url = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';

      const response = await axios.get(
        `${judge0Url}/submissions/${token}?base64_encoded=false`,
        {
          headers: {},
        }
      );

      res.json({ success: true, data: response.data });
    } catch (err) {
      next(err);
    }
  };

  getSupportedLanguages = async (req: Request, res: Response, next: NextFunction) => {
    res.json({ success: true, data: { languages: SUPPORTED_LANGUAGES } });
  };
}
