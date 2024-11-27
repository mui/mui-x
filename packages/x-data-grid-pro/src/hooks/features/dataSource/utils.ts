import { GridRowId } from '@mui/x-data-grid';
import { GridPrivateApiPro, GridGetRowsParams, GridGetRowsResponse } from '../../../models';

const MAX_CONCURRENT_REQUESTS = Infinity;

export const runIf = (condition: boolean, fn: Function) => (params: unknown) => {
  if (condition) {
    fn(params);
  }
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
 * Provides better cache hit rate by:
 * 1. Splitting the data into smaller chunks to be stored in the cache (cache `set`)
 * 2. Merging multiple cache entries into a single response to get the required chunk (cache `get`)
 */
export class CacheChunkManager {
  private chunkSize: number;

  /**
   * @param chunkSize The number of rows to store in each cache entry.
   * If not set, the whole array will be stored in a single cache entry.
   * Setting this value to smallest page size will result in better cache hit rate.
   * Has no effect if cursor pagination is used.
   */
  constructor(chunkSize: number) {
    this.chunkSize = chunkSize;
  }

  public getCacheKeys = (key: GridGetRowsParams) => {
    if (this.chunkSize < 1 || typeof key.start !== 'number') {
      return [key];
    }

    // split the range into chunks
    const chunkedKeys: GridGetRowsParams[] = [];
    for (let i = key.start; i < key.end; i += this.chunkSize) {
      const end = Math.min(i + this.chunkSize - 1, key.end);
      chunkedKeys.push({ ...key, start: i, end });
    }

    return chunkedKeys;
  };

  public splitResponse = (key: GridGetRowsParams, response: GridGetRowsResponse) => {
    const cacheKeys = this.getCacheKeys(key);
    const responses = new Map<GridGetRowsParams, GridGetRowsResponse>();
    cacheKeys.forEach((chunkKey) => {
      const isLastChunk = chunkKey.end === key.end;
      const responseSlice: GridGetRowsResponse = {
        ...response,
        pageInfo: {
          ...response.pageInfo,
          // If the original response had page info, update that information for all but last chunk and keep the original value for the last chunk
          hasNextPage:
            response.pageInfo?.hasNextPage !== undefined && !isLastChunk
              ? true
              : response.pageInfo?.hasNextPage,
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

      responses.set(chunkKey, responseSlice);
    });

    return responses;
  };

  static mergeResponses = (responses: GridGetRowsResponse[]): GridGetRowsResponse => {
    if (responses.length === 1) {
      return responses[0];
    }

    return responses.reduce(
      (acc, response) => ({
        rows: [...acc.rows, ...response.rows],
        rowCount: response.rowCount,
        pageInfo: response.pageInfo,
      }),
      { rows: [], rowCount: 0, pageInfo: {} },
    );
  };
}
