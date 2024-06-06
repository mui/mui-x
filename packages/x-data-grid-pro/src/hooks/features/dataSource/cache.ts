import { GridGetRowsParams, GridGetRowsResponse } from '../../../models';

type SimpleServerSideCacheConfig = {
  /**
   * Time To Live for each cache entry in milliseconds.
   * After this time the cache entry will become stale and the next query will result in cache miss.
   * @default 300000 (5 minutes)
   */
  ttl?: number;
};

export class SimpleServerSideCache {
  private cache: Record<string, { value: GridGetRowsResponse; expiry: number }>;

  private ttl: number;

  constructor({ ttl = 300000 }: SimpleServerSideCacheConfig) {
    this.cache = {};
    this.ttl = ttl;
  }

  // eslint-disable-next-line class-methods-use-this
  getKey(params: GridGetRowsParams) {
    return JSON.stringify([
      params.paginationModel,
      params.filterModel,
      params.sortModel,
      params.groupKeys,
    ]);
  }

  set(key: string, value: GridGetRowsResponse) {
    const expiry = Date.now() + this.ttl;
    this.cache[key] = { value, expiry };
  }

  get(key: string): GridGetRowsResponse | undefined {
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
