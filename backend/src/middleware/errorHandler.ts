import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // PostgreSQL errors
  if (err.code === '23505') { statusCode = 409; message = 'Duplicate entry'; }
  if (err.code === '23503') { statusCode = 400; message = 'Invalid reference'; }
  if (err.code === '22P02') { statusCode = 400; message = 'Invalid UUID format'; }

  // JWT errors
  if (err.name === 'JsonWebTokenError') { statusCode = 401; message = 'Invalid token'; }
  if (err.name === 'TokenExpiredError') { statusCode = 401; message = 'Token expired'; }

  // Validation errors
  if (err.type === 'entity.parse.failed') { statusCode = 400; message = 'Invalid JSON body'; }

  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    logger.error('Unhandled error:', { error: err, url: req.url, method: req.method });
    message = 'Internal Server Error';
  } else if (statusCode === 500) {
    logger.error('Server error:', err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV !== 'production' && statusCode === 500
        ? { stack: err.stack }
        : {}),
    },
  });
};
