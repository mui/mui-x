import { GridGetRowsParams, GridGetRowsResponse } from '@mui/x-data-grid/internals';

export type GridDataSourceCacheDefaultConfig = {
  /**
   * Time To Live for each cache entry in milliseconds.
   * After this time the cache entry will become stale and the next query will result in cache miss.
   * @default 300000 (5 minutes)
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
  return JSON.stringify([
    params.filterModel,
    params.sortModel,
    params.groupKeys,
    params.groupFields,
    params.start,
    params.end,
  ]);
}

export class GridDataSourceCacheDefault {
  private cache: Record<string, { value: GridGetRowsResponse; expiry: number }>;

  private ttl: number;

  private getKey: (params: GridGetRowsParams) => string;

  constructor({ ttl = 300000, getKey = getKeyDefault }: GridDataSourceCacheDefaultConfig) {
    this.cache = {};
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

  clear() {
    this.cache = {};
  }
}
