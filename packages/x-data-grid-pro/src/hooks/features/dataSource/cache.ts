import { GridGetRowsParams, GridGetRowsResponse } from '../../../models';

type GridDataSourceCacheDefaultConfig = {
  /**
   * Time To Live for each cache entry in milliseconds.
   * After this time the cache entry will become stale and the next query will result in cache miss.
   * @default 300000 (5 minutes)
   */
  ttl?: number;
};

function getKey(params: GridGetRowsParams) {
  return JSON.stringify([
    params.paginationModel,
    params.filterModel,
    params.sortModel,
    params.groupKeys,
  ]);
}

export class GridDataSourceCacheDefault {
  private cache: Record<string, { value: GridGetRowsResponse; expiry: number }>;

  private ttl: number;

  constructor({ ttl = 300000 }: GridDataSourceCacheDefaultConfig) {
    this.cache = {};
    this.ttl = ttl;
  }

  set(key: GridGetRowsParams, value: GridGetRowsResponse) {
    const keyString = getKey(key);
    const expiry = Date.now() + this.ttl;
    this.cache[keyString] = { value, expiry };
  }

  get(key: GridGetRowsParams): GridGetRowsResponse | undefined {
    const keyString = getKey(key);
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
