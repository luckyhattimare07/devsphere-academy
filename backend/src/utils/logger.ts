import winston from 'winston';
import path from 'path';

const { combine, timestamp, errors, json, colorize, simple } = winston.format;

const levels = { error: 0, warn: 1, info: 2, http: 3, debug: 4 };
const level = () => (process.env.NODE_ENV === 'production' ? 'warn' : 'debug');

export const logger = winston.createLogger({
  level: level(),
  levels,
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), json()),
  transports: [
    new winston.transports.File({ filename: path.join('logs', 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join('logs', 'combined.log') }),
    ...(process.env.NODE_ENV !== 'production'
      ? [new winston.transports.Console({ format: combine(colorize(), simple()) })]
      : []),
  ],
});
