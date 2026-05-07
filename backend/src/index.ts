import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { createServer } from 'http';
import dotenv from 'dotenv';

import { connectDB } from './config/database';
import { connectRedis } from './config/redis';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { notFound } from './middleware/notFound';

// Routes
import authRoutes      from './routes/auth';
import userRoutes      from './routes/users';
import problemRoutes   from './routes/problems';
import submissionRoutes from './routes/submissions';
import compilerRoutes  from './routes/compiler';
import languageRoutes  from './routes/languages';
import dsaRoutes       from './routes/dsa';
import articleRoutes   from './routes/articles';
import dashboardRoutes from './routes/dashboard';
import adminRoutes     from './routes/admin';
import discussionRoutes from './routes/discussions';
import leaderboardRoutes from './routes/leaderboard';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// ============================================================
// MIDDLEWARE
// ============================================================
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Refresh-Token'],
}));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined', {
  stream: { write: (msg) => logger.http(msg.trim()) }
}));

// Rate limiting
app.use('/api', rateLimiter.general);
app.use('/api/auth', rateLimiter.auth);
app.use('/api/compiler', rateLimiter.compiler);

// ============================================================
// HEALTH CHECK
// ============================================================
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// ============================================================
// API ROUTES  (all prefixed with /api/v1)
// ============================================================
const API = '/api/v1';

app.use(`${API}/auth`,        authRoutes);
app.use(`${API}/users`,       userRoutes);
app.use(`${API}/problems`,    problemRoutes);
app.use(`${API}/submissions`, submissionRoutes);
app.use(`${API}/compiler`,    compilerRoutes);
app.use(`${API}/languages`,   languageRoutes);
app.use(`${API}/dsa`,         dsaRoutes);
app.use(`${API}/articles`,    articleRoutes);
app.use(`${API}/dashboard`,   dashboardRoutes);
app.use(`${API}/admin`,       adminRoutes);
app.use(`${API}/discussions`, discussionRoutes);
app.use(`${API}/leaderboard`, leaderboardRoutes);

// ============================================================
// ERROR HANDLING
// ============================================================
app.use(notFound);
app.use(errorHandler);

// ============================================================
// START
// ============================================================
const PORT = parseInt(process.env.PORT || '4000', 10);

async function bootstrap() {
  try {
    await connectDB();
    logger.info('✅ PostgreSQL connected');

    await connectRedis();
    logger.info('✅ Redis connected');

    httpServer.listen(PORT, () => {
      logger.info(`🚀 DevSphere API running on http://localhost:${PORT}`);
      logger.info(`📝 Environment: ${process.env.NODE_ENV}`);
    });
 } catch (err) {
  console.error('STARTUP ERROR:', err);
  logger.error('❌ Failed to start server:', err);
  process.exit(1);
}
}

bootstrap();

export default app;
