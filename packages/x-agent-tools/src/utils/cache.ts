export type CacheEntry = {
  content: string;
  timestamp: number;
};

const DEFAULT_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 1 day in milliseconds
const DEFAULT_MAX_CACHE_SIZE = 1000;
const DEFAULT_CLEAN_UP_FREQ_MS = 60 * 60 * 1000; // 1 hour in milliseconds

export class LRUCache {
  private cache: Map<string, CacheEntry>;

  private cache_ttl_ms: number;

  private max_cache_size: number;

  private cleanupTimer: ReturnType<typeof setInterval>;

  constructor(
    cache_ttl_ms: number = DEFAULT_CACHE_TTL_MS,
    max_cache_size: number = DEFAULT_MAX_CACHE_SIZE,
    clean_up_freq_ms: number = DEFAULT_CLEAN_UP_FREQ_MS,
  ) {
    this.cache = new Map();
    this.cache_ttl_ms = cache_ttl_ms;
    this.max_cache_size = max_cache_size;
    // Periodically evict expired entries. `unref()` so the timer never keeps the process alive.
    this.cleanupTimer = setInterval(() => this.cleanupExpiredEntries(), clean_up_freq_ms);
    this.cleanupTimer.unref?.();
  }

  // Stop the cleanup timer when discarding a cache so it can be garbage collected.
  dispose(): void {
    clearInterval(this.cleanupTimer);
  }

  get(url: string): string | null {
    const entry = this.cache.get(url);
    if (!entry) {
      return null;
    }

    if (Date.now() - entry.timestamp >= this.cache_ttl_ms) {
      this.cache.delete(url);
      return null;
    }

    // Re-insert to mark most-recently-used (Map preserves insertion order).
    this.cache.delete(url);
    this.cache.set(url, entry);

    return entry.content;
  }

  set(url: string, content: string): void {
    if (this.cache.has(url)) {
      // Re-insert so a refresh counts as most-recently-used (Map.set alone keeps its spot).
      this.cache.delete(url);
    } else if (this.cache.size >= this.max_cache_size) {
      const firstKey = this.cache.keys().next().value;
      // `!== undefined`, not truthiness: `''` is a valid key and must still be evicted at capacity.
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(url, {
      content,
      timestamp: Date.now(),
    });
  }

  private cleanupExpiredEntries(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp >= this.cache_ttl_ms) {
        this.cache.delete(key);
      }
    }
  }
}

/** Resolve a `cache` option: reuse an instance, make a fresh one for `true`, disable when falsy. */
export function resolveCache(cache?: boolean | LRUCache): LRUCache | undefined {
  if (cache instanceof LRUCache) {
    return cache;
  }
  return cache ? new LRUCache() : undefined;
}
