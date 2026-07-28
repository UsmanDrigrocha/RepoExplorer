import { LRUCache } from "lru-cache";

/**
 * Process-local cache for upstream GitHub responses. GitHub's unauthenticated
 * rate limit is 60 requests/hour per IP, so shaving repeat lookups (the same
 * profile viewed twice, a search re-run) matters far more here than raw
 * speed. Not shared across serverless instances — fine for a demo app, would
 * become Redis at real scale (see README "Future improvements").
 */
const cache = new LRUCache<string, { value: unknown }>({
  max: 500,
  ttl: 1000 * 60, // 60s
});

export function getCached<T>(key: string): T | undefined {
  return cache.get(key)?.value as T | undefined;
}

export function setCached<T>(key: string, value: T, ttlMs?: number): void {
  cache.set(key, { value }, ttlMs ? { ttl: ttlMs } : undefined);
}

export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs?: number,
): Promise<{ value: T; hit: boolean }> {
  const cached = getCached<T>(key);
  if (cached !== undefined) {
    return { value: cached, hit: true };
  }
  const value = await fetcher();
  setCached(key, value, ttlMs);
  return { value, hit: false };
}
