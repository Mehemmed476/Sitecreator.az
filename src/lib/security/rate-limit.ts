import { AppError } from "@/lib/errors/app-error";

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

declare global {
  var sitecreatorRateLimitStore: Map<string, RateLimitRecord> | undefined;
}

const store = global.sitecreatorRateLimitStore ?? new Map<string, RateLimitRecord>();

if (!global.sitecreatorRateLimitStore) {
  global.sitecreatorRateLimitStore = store;
}

function cleanupExpired(now: number) {
  for (const [key, record] of store.entries()) {
    if (record.resetAt <= now) {
      store.delete(key);
    }
  }
}

export function consumeRateLimit({ key, limit, windowMs }: RateLimitOptions) {
  const now = Date.now();
  cleanupExpired(now);

  const current = store.get(key);
  if (!current || current.resetAt <= now) {
    const nextRecord = {
      count: 1,
      resetAt: now + windowMs,
    };
    store.set(key, nextRecord);
    return {
      allowed: true,
      remaining: Math.max(limit - 1, 0),
      resetAt: nextRecord.resetAt,
    };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: current.resetAt,
    };
  }

  current.count += 1;
  store.set(key, current);

  return {
    allowed: true,
    remaining: Math.max(limit - current.count, 0),
    resetAt: current.resetAt,
  };
}

export function enforceRateLimit(options: RateLimitOptions) {
  const result = consumeRateLimit(options);

  if (!result.allowed) {
    const retryAfterSeconds = Math.max(Math.ceil((result.resetAt - Date.now()) / 1000), 1);
    throw new AppError(`Too many requests. Try again in ${retryAfterSeconds}s.`, 429);
  }

  return result;
}
