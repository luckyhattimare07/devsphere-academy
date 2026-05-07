// middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';

export const rateLimiter = {
  general: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 500,
    message: { success: false, error: { message: 'Too many requests' } },
    standardHeaders: true,
    legacyHeaders: false,
  }),
  auth: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { success: false, error: { message: 'Too many auth attempts' } },
  }),
  compiler: rateLimit({
    windowMs: 60 * 1000, // 1 min
    max: 10,
    message: { success: false, error: { message: 'Code execution rate limit exceeded' } },
  }),
};
