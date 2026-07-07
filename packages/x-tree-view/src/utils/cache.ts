type DataSourceCacheDefaultConfig = {
  /**
   * Time To Live for each cache entry in milliseconds.
   * After this time the cache entry will become stale and the next query will result in cache miss.
   * @default 300_000 (5 minutes)
   */
  ttl?: number;
};

export interface DataSourceCache<T = any> {
  /**
   * Set the cache entry for the given key.
   * @param {string} key The key of type `string`
   * @param {T[]} value The value to be stored in the cache
   */
  set: (key: string, value: T[]) => void;
  /**
   * Get the cache entry for the given key.
   * @param {string} key The key of type `string`
   * @returns {T[] | undefined | -1} The value stored in the cache, `undefined` if not found, or `-1` if the cache entry is stale.
   */
  get: (key: string) => T[] | undefined | -1;
  /**
   * Clear the cache.
   */
  clear: () => void;
}

export class DataSourceCacheDefault<T = any> implements DataSourceCache<T> {
  private cache: Record<string, { value: T[]; expiry: number }>;

  private ttl: number;

  constructor({ ttl = 300_000 }: DataSourceCacheDefaultConfig) {
    this.cache = {};
    this.ttl = ttl;
  }

  set(key: string, value: T[]) {
    const expiry = Date.now() + this.ttl;
    this.cache[key] = { value, expiry };
  }

  get(key: string): T[] | undefined | -1 {
    const entry = this.cache[key];
    if (!entry) {
      return undefined;
    }
    if (Date.now() > entry.expiry) {
      delete this.cache[key];
      return -1;
    }
    return entry.value;
  }

  clear() {
    this.cache = {};
  }
}
