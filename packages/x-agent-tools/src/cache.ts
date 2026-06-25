import type { CacheEntry } from './types';

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
    // Periodically evict expired entries. `unref()` lets the process exit even if a cache is
    // still alive (the interval must not keep the event loop running on its own).
    this.cleanupTimer = setInterval(() => this.cleanupExpiredEntries(), clean_up_freq_ms);
    this.cleanupTimer.unref?.();
  }

  // Stop the background cleanup timer. Call when discarding a cache so it can be garbage collected.
  dispose(): void {
    clearInterval(this.cleanupTimer);
  }

  get(url: string): string | null {
    const entry = this.cache.get(url);
    if (!entry) {
      return null;
    }

    // Check if cache entry is still valid
    if (Date.now() - entry.timestamp >= this.cache_ttl_ms) {
      this.cache.delete(url);
      return null;
    }

    // Move the key to the end (most recently used) by deleting and re-adding
    this.cache.delete(url);
    this.cache.set(url, entry);

    return entry.content;
  }

  set(url: string, content: string): void {
    // If we're at capacity, remove the first (least recently used) item
    if (this.cache.size >= this.max_cache_size) {
      // Get first key in the map (least recently used)
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    // Add new entry (or update existing) at the end (most recently used)
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
