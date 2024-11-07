import { GridRowId } from '@mui/x-data-grid';
import {
  GridPrivateApiPro,
  GridDataSourceCache,
  GridGetRowsParams,
  GridGetRowsResponse,
} from '../../../models';

const MAX_CONCURRENT_REQUESTS = Infinity;

export const runIf = (condition: boolean, fn: Function) => (params: unknown) => {
  if (condition) {
    fn(params);
  }
};

export type GridDataSourceCacheChunkManagerConfig = {
  /**
   * The number of rows to store in each cache entry. If not set, the whole array will be stored in a single cache entry.
   * Setting this value to smallest page size will result in better cache hit rate.
   * Has no effect if cursor pagination is used.
   */
  chunkSize: number;
};

export enum RequestStatus {
  QUEUED,
  PENDING,
  SETTLED,
  UNKNOWN,
}

export enum DataSourceRowsUpdateStrategy {
  Default = 'set-new-rows',
  LazyLoading = 'replace-row-range',
}

/**
 * Fetches row children from the server with option to limit the number of concurrent requests
 * Determines the status of a request based on the enum `RequestStatus`
 * Uses `GridRowId` to uniquely identify a request
 */
export class NestedDataManager {
  private pendingRequests: Set<GridRowId> = new Set();

  private queuedRequests: Set<GridRowId> = new Set();

  private settledRequests: Set<GridRowId> = new Set();

  private api: GridPrivateApiPro;

  private maxConcurrentRequests: number;

  constructor(
    privateApiRef: React.MutableRefObject<GridPrivateApiPro>,
    maxConcurrentRequests = MAX_CONCURRENT_REQUESTS,
  ) {
    this.api = privateApiRef.current;
    this.maxConcurrentRequests = maxConcurrentRequests;
  }

  private processQueue = async () => {
    if (this.queuedRequests.size === 0 || this.pendingRequests.size >= this.maxConcurrentRequests) {
      return;
    }
    const loopLength = Math.min(
      this.maxConcurrentRequests - this.pendingRequests.size,
      this.queuedRequests.size,
    );
    if (loopLength === 0) {
      return;
    }
    const fetchQueue = Array.from(this.queuedRequests);

    for (let i = 0; i < loopLength; i += 1) {
      const id = fetchQueue[i];
      this.queuedRequests.delete(id);
      this.pendingRequests.add(id);
      this.api.fetchRowChildren(id);
    }
  };

  public queue = async (ids: GridRowId[]) => {
    const loadingIds: Record<GridRowId, boolean> = {};
    ids.forEach((id) => {
      this.queuedRequests.add(id);
      loadingIds[id] = true;
    });
    this.api.setState((state) => ({
      ...state,
      dataSource: {
        ...state.dataSource,
        loading: {
          ...state.dataSource.loading,
          ...loadingIds,
        },
      },
    }));
    this.processQueue();
  };

  public setRequestSettled = (id: GridRowId) => {
    this.pendingRequests.delete(id);
    this.settledRequests.add(id);
    this.processQueue();
  };

  public clear = () => {
    this.queuedRequests.clear();
    Array.from(this.pendingRequests).forEach((id) => this.clearPendingRequest(id));
  };

  public clearPendingRequest = (id: GridRowId) => {
    this.api.unstable_dataSource.setChildrenLoading(id, false);
    this.pendingRequests.delete(id);
    this.processQueue();
  };

  public getRequestStatus = (id: GridRowId) => {
    if (this.pendingRequests.has(id)) {
      return RequestStatus.PENDING;
    }
    if (this.queuedRequests.has(id)) {
      return RequestStatus.QUEUED;
    }
    if (this.settledRequests.has(id)) {
      return RequestStatus.SETTLED;
    }
    return RequestStatus.UNKNOWN;
  };

  public getActiveRequestsCount = () => this.pendingRequests.size + this.queuedRequests.size;
}

/**
 * Provides better cache hit rate by splitting the data into smaller chunks
 * Splits the data into smaller chunks to be stored in the cache
 * Merges multiple cache entries into a single response
 */
export class CacheChunkManager {
  private dataSourceCache: GridDataSourceCache | undefined;

  private chunkSize: number;

  constructor(config: GridDataSourceCacheChunkManagerConfig) {
    this.chunkSize = config.chunkSize;
  }

  private generateChunkedKeys = (params: GridGetRowsParams): GridGetRowsParams[] => {
    if (this.chunkSize < 1 || typeof params.start !== 'number') {
      return [params];
    }

    // split the range into chunks
    const chunkedKeys: GridGetRowsParams[] = [];
    for (let i = params.start; i < params.end; i += this.chunkSize) {
      const end = Math.min(i + this.chunkSize - 1, params.end);
      chunkedKeys.push({ ...params, start: i, end });
    }

    return chunkedKeys;
  };

  private getCacheKeys = (key: GridGetRowsParams) => {
    const chunkedKeys = this.generateChunkedKeys(key);

    const startChunk = chunkedKeys.findIndex((chunkedKey) => chunkedKey.start === key.start);
    const endChunk = chunkedKeys.findIndex((chunkedKey) => chunkedKey.end === key.end);

    // If desired range cannot fit completely in chunks, then it is a cache miss
    if (startChunk === -1 || endChunk === -1) {
      return [key];
    }

    const keys = [];
    for (let i = startChunk; i <= endChunk; i += 1) {
      keys.push(chunkedKeys[i]);
    }

    return keys;
  };

  public setDataSourceCache = (newDataSourceCache: GridDataSourceCache) => {
    this.dataSourceCache = newDataSourceCache;
  };

  public getCacheData = (key: GridGetRowsParams): GridGetRowsResponse | undefined => {
    if (!this.dataSourceCache) {
      return undefined;
    }

    const cacheKeys = this.getCacheKeys(key);
    const responses = cacheKeys.map((cacheKey) =>
      (this.dataSourceCache as GridDataSourceCache).get(cacheKey),
    );

    // If any of the chunks is missing, then it is a cache miss
    if (responses.some((response) => response === undefined)) {
      return undefined;
    }

    return (responses as GridGetRowsResponse[]).reduce(
      (acc, response) => {
        return {
          rows: [...acc.rows, ...response.rows],
          rowCount: response.rowCount,
          pageInfo: response.pageInfo,
        };
      },
      { rows: [], rowCount: 0, pageInfo: {} },
    );
  };

  public setCacheData = (key: GridGetRowsParams, response: GridGetRowsResponse) => {
    if (!this.dataSourceCache) {
      return;
    }

    const cacheKeys = this.getCacheKeys(key);
    const lastIndex = cacheKeys.length - 1;

    cacheKeys.forEach((chunkKey, index) => {
      const isLastChunk = index === lastIndex;
      const responseSlice: GridGetRowsResponse = {
        ...response,
        pageInfo: {
          ...response.pageInfo,
          // If the original response had page info, update that information for all but last chunk and keep the original value for the last chunk
          hasNextPage:
            (response.pageInfo?.hasNextPage !== undefined && !isLastChunk) ||
            response.pageInfo?.hasNextPage,
          nextCursor:
            response.pageInfo?.nextCursor !== undefined && !isLastChunk
              ? response.rows[chunkKey.end + 1].id
              : response.pageInfo?.nextCursor,
        },
        rows:
          typeof chunkKey.start !== 'number' || typeof key.start !== 'number'
            ? response.rows
            : response.rows.slice(chunkKey.start - key.start, chunkKey.end - key.start + 1),
      };

      (this.dataSourceCache as GridDataSourceCache).set(chunkKey, responseSlice);
    });
  };
}
