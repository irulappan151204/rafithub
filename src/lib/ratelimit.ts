import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

interface RateLimitResult {
  success: boolean;
  remaining: number;
}

const memoryBuckets = new Map<string, { count: number; resetAt: number }>();

let redisClient: Redis | null = null;
const limiters = new Map<string, Ratelimit>();

function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  if (!redisClient) {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return redisClient;
}

/**
 * Sliding-window rate limiter backed by Upstash Redis when configured,
 * falling back to an in-memory window for local development.
 */
export async function checkRateLimit(params: {
  namespace: string;
  identifier: string;
  limit: number;
  windowSeconds: number;
}): Promise<RateLimitResult> {
  const redis = getRedis();
  const key = `${params.namespace}:${params.identifier}`;

  if (redis) {
    const cacheKey = `${params.namespace}:${params.limit}:${params.windowSeconds}`;
    let limiter = limiters.get(cacheKey);
    if (!limiter) {
      limiter = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(params.limit, `${params.windowSeconds} s`),
        prefix: `rafithub:rl:${params.namespace}`,
      });
      limiters.set(cacheKey, limiter);
    }
    const res = await limiter.limit(params.identifier);
    return { success: res.success, remaining: res.remaining };
  }

  const now = Date.now();
  const windowMs = params.windowSeconds * 1000;
  const entry = memoryBuckets.get(key);

  if (!entry || entry.resetAt <= now) {
    memoryBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: params.limit - 1 };
  }

  if (entry.count >= params.limit) {
    return { success: false, remaining: 0 };
  }

  entry.count += 1;
  return { success: true, remaining: params.limit - entry.count };
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "127.0.0.1";
}
