import type {
  GridDataSourceCache,
  GridGetRowsParams,
  GridGetRowsResponse,
} from '@mui/x-data-grid';

export interface DataStudioSessionCacheOptions {
  /**
   * Time To Live for each cache entry in milliseconds.
   * After this time the cache entry will become stale and the next query will result in cache miss.
   * @default 300_000 (5 minutes)
   */
  ttl?: number;
  /**
   * Maximum number of entries kept in the cache across all dataSources.
   * When the cache grows beyond this number the least recently used entry is evicted.
   * @default 500
   */
  maxEntries?: number;
  /**
   * Function to generate the cache key portion derived from the request params.
   * The dataSource id is automatically prepended to the returned key to provide per-dataSource
   * namespacing, so this function does not need to be aware of it.
   * @param {GridGetRowsParams} params The params to generate the cache key from.
   * @returns {string} The cache key.
   * @default JSON.stringify([filterModel, sortModel, start, end, groupKeys, groupFields])
   */
  getKey?: (params: GridGetRowsParams) => string;
}

function defaultGetKey(params: GridGetRowsParams) {
  // `groupKeys` (root vs each expanded group) and `groupFields` (which column is
  // grouped) MUST be part of the key: a group-children fetch shares the same
  // filter/sort/start/end as the root grouped page, so omitting them collides the
  // two cache entries and the grid serves the parent page instead of fetching the
  // children — expanding a group then renders nothing.
  const { groupKeys, groupFields } = params as GridGetRowsParams & {
    groupKeys?: unknown;
    groupFields?: unknown;
  };
  return JSON.stringify([
    params.filterModel,
    params.sortModel,
    params.start,
    params.end,
    groupKeys ?? [],
    groupFields ?? [],
  ]);
}

interface CacheEntry {
  value: GridGetRowsResponse;
  expiry: number;
}

const NAMESPACE_SEPARATOR = '\x00';

/**
 * Session-scoped Data Source cache shared by every dataSource in a single `<DataStudio>`.
 *
 * - Backed by a single insertion-ordered `Map`, which gives O(1) LRU touch by
 *   delete-then-set on access.
 * - TTL behavior matches `GridDataSourceCacheDefault` from `@mui/x-data-grid`.
 * - `forDataset(id)` returns a per-dataSource `GridDataSourceCache` view whose
 *   `clear()` only drops that dataSource's entries. The Data Grid auto-clears on
 *   row mutations, and this ensures one dataSource's mutation does not invalidate
 *   another dataSource's cached pages.
 */
export class DataStudioSessionCache {
  private readonly cache: Map<string, CacheEntry>;

  private readonly ttl: number;

  private readonly maxEntries: number;

  private readonly getKey: (params: GridGetRowsParams) => string;

  constructor({
    ttl = 300_000,
    maxEntries = 500,
    getKey = defaultGetKey,
  }: DataStudioSessionCacheOptions = {}) {
    this.cache = new Map();
    this.ttl = ttl;
    this.maxEntries = maxEntries;
    this.getKey = getKey;
  }

  get size(): number {
    return this.cache.size;
  }

  private buildKey(dataSourceId: string, params: GridGetRowsParams): string {
    return `${dataSourceId}${NAMESPACE_SEPARATOR}${this.getKey(params)}`;
  }

  private setEntry(key: string, value: GridGetRowsResponse): void {
    // Move to most-recently-used position.
    this.cache.delete(key);
    this.cache.set(key, { value, expiry: Date.now() + this.ttl });
    if (this.cache.size > this.maxEntries) {
      const oldest = this.cache.keys().next();
      if (!oldest.done) {
        this.cache.delete(oldest.value);
      }
    }
  }

  private getEntry(key: string): GridGetRowsResponse | undefined {
    const entry = this.cache.get(key);
    if (!entry) {
      return undefined;
    }
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return undefined;
    }
    // Touch (move to most-recently-used).
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.value;
  }

  forDataset(dataSourceId: string): GridDataSourceCache {
    return {
      set: (params, value) => this.setEntry(this.buildKey(dataSourceId, params), value),
      get: (params) => this.getEntry(this.buildKey(dataSourceId, params)),
      clear: () => this.invalidateDataSource(dataSourceId),
    };
  }

  invalidateDataSource(dataSourceId: string): void {
    const prefix = `${dataSourceId}${NAMESPACE_SEPARATOR}`;
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  invalidateAll(): void {
    this.cache.clear();
  }
}

export function createDataStudioSessionCache(
  options?: DataStudioSessionCacheOptions,
): DataStudioSessionCache {
  return new DataStudioSessionCache(options);
}
