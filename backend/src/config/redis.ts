import { createClient, RedisClientType } from 'redis';
import { logger } from '../utils/logger';

let redisClient: RedisClientType;

export const connectRedis = async (): Promise<void> => {
  redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 10) return new Error('Redis max retries exceeded');
        return Math.min(retries * 50, 500);
      },
    },
  }) as RedisClientType;

  redisClient.on('error', (err) => logger.error('Redis error:', err));
  redisClient.on('reconnecting', () => logger.warn('Redis reconnecting...'));

  await redisClient.connect();
};

export const getRedis = (): RedisClientType => {
  if (!redisClient) throw new Error('Redis not initialized.');
  return redisClient;
};

// Helpers
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const val = await getRedis().get(key);
    return val ? JSON.parse(val) : null;
  },

  async set(key: string, value: any, ttlSeconds = 300): Promise<void> {
    await getRedis().set(key, JSON.stringify(value), { EX: ttlSeconds });
  },

  async del(key: string): Promise<void> {
    await getRedis().del(key);
  },

  async delPattern(pattern: string): Promise<void> {
    const keys = await getRedis().keys(pattern);
    if (keys.length > 0) await getRedis().del(keys);
  },
};
