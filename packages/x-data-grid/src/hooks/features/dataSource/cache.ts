import type { GridGetRowsParams, GridGetRowsResponse } from '../../../models/gridDataSource';

export type GridDataSourceCacheDefaultConfig = {
  /**
   * Time To Live for each cache entry in milliseconds.
   * After this time the cache entry will become stale and the next query will result in cache miss.
   * @default 300_000 (5 minutes)
   */
  ttl?: number;
  /**
   * Function to generate a cache key from the params.
   * @param {GridGetRowsParams} params The params to generate the cache key from.
   * @returns {string} The cache key.
   * @default `getKeyDefault()`
   */
  getKey?: (params: GridGetRowsParams) => string;
};

export function getKeyDefault(params: GridGetRowsParams) {
  return JSON.stringify([params.filterModel, params.sortModel, params.start, params.end]);
}

export class GridDataSourceCacheDefault {
  private cache: Record<string, { value: GridGetRowsResponse; expiry: number }>;

  private cacheKeys: Set<string>;

  private ttl: number;

  private getKey: (params: GridGetRowsParams) => string;

  constructor({ ttl = 300_000, getKey = getKeyDefault }: GridDataSourceCacheDefaultConfig = {}) {
    this.cache = {};
    this.cacheKeys = new Set();
    this.ttl = ttl;
    this.getKey = getKey;
  }

  set(key: GridGetRowsParams, value: GridGetRowsResponse) {
    const keyString = this.getKey(key);
    const expiry = Date.now() + this.ttl;
    this.cache[keyString] = { value, expiry };
  }

  get(key: GridGetRowsParams): GridGetRowsResponse | undefined {
    const keyString = this.getKey(key);
    const entry = this.cache[keyString];
    if (!entry) {
      return undefined;
    }

    if (Date.now() > entry.expiry) {
      delete this.cache[keyString];
      return undefined;
    }

    return entry.value;
  }

  pushKey(key: GridGetRowsParams) {
    const keyString = this.getKey(key);
    this.cacheKeys.add(keyString);
  }

  getLast(key: GridGetRowsParams): Promise<GridGetRowsResponse | undefined> {
    const cacheKeys = Array.from(this.cacheKeys);
    const prevKey = cacheKeys[cacheKeys.indexOf(this.getKey(key)) - 1];
    if (!prevKey) {
      return Promise.resolve(undefined);
    }
    if (this.cache[prevKey]) {
      return Promise.resolve(this.cache[prevKey].value);
    }
    return new Promise((resolve) => {
      const intervalId = setInterval(() => {
        if (this.cache[prevKey]) {
          clearInterval(intervalId);
          resolve(this.cache[prevKey].value);
        }
      }, 100);
    });
  }

  clear() {
    this.cache = {};
    this.cacheKeys.clear();
  }
}
