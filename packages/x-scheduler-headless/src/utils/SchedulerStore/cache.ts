type SchedulerDataSourceCacheConfig = {
  /**
   * Time To Live for each cache entry in milliseconds.
   * After this time the cache entry will become stale and the next query will result in cache miss.
   * @default 300_000 (5 minutes)
   */
  ttl?: number;
};

export interface SchedulerDataSourceCache<TEvent extends object> {
  /**
   * Set the cache entry for the given date key.
   * @param {string} key The key representing the day (e.g., ISO date string)
   * @param {TEvent[]} events The events occurring on this day
   */
  set: (key: string, events: TEvent[]) => void;
  /**
   * Get the cache entry for the given date key.
   * @param {string} key The key representing the day
   * @returns {TEvent[]} The events stored in the cache for this day
   */
  get: (key: string) => TEvent[] | undefined | -1;
  /**
   * Clear the cache.
   */
  clear: () => void;
}

export class SchedulerDataSourceCacheDefault<TEvent extends object>
  implements SchedulerDataSourceCache<TEvent>
{
  private cache: Record<string, { value: TEvent[]; expiry: number }>;

  private ttl: number;

  constructor({ ttl = 300_000 }: SchedulerDataSourceCacheConfig = {}) {
    this.cache = {};
    this.ttl = ttl;
  }

  set(key: string, value: TEvent[]) {
    const expiry = Date.now() + this.ttl;
    this.cache[key] = { value, expiry };
  }

  get(key: string): TEvent[] | undefined | -1 {
    const entry = this.cache[key];
    if (!entry) {
      return undefined;
    }
    if (Date.now() > entry.expiry) {
      delete this.cache[key];
      return undefined;
    }
    return entry.value;
  }

  clear() {
    this.cache = {};
  }
}
