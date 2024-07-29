import { GridRowId } from '@mui/x-data-grid';
import { GridPrivateApiPro } from '../../../models/gridApiPro';

const MAX_CONCURRENT_REQUESTS = Infinity;

export const runIfServerMode = (modeProp: 'server' | 'client', fn: Function) => () => {
  if (modeProp === 'server') {
    fn();
  }
};

export enum RequestStatus {
  QUEUED,
  PENDING,
  SETTLED,
  UNKNOWN,
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
