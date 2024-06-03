import { GridRowId } from '@mui/x-data-grid';
import { GridPrivateApiPro } from '../../../models/gridApiPro';

// Make these configurable using dedicated props?
const MAX_CONCURRENT_REQUESTS = Infinity;
const QUEUE_PROCESS_INTERVAL_MS = 300;

export const runIfServerMode = (modeProp: 'server' | 'client', fn: Function) => () => {
  if (modeProp === 'server') {
    fn();
  }
};

export enum RequestStatus {
  INQUEUE,
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

  private queueProcessInterval: number;

  private timer?: string | number | NodeJS.Timeout;

  constructor(
    privateApiRef: React.MutableRefObject<GridPrivateApiPro>,
    maxConcurrentRequests = MAX_CONCURRENT_REQUESTS,
    queueProcessInterval = QUEUE_PROCESS_INTERVAL_MS,
  ) {
    this.api = privateApiRef.current;
    this.maxConcurrentRequests = maxConcurrentRequests;
    this.queueProcessInterval = queueProcessInterval;
  }

  private processQueue = async () => {
    if (this.queuedRequests.size === 0) {
      clearInterval(this.timer);
      return;
    }
    if (this.pendingRequests.size >= this.maxConcurrentRequests) {
      return;
    }
    const fetchQueue = Array.from(this.queuedRequests);

    const availableSlots = this.maxConcurrentRequests - this.pendingRequests.size;
    for (let i = 0; i < availableSlots; i += 1) {
      const nextId = fetchQueue[i];
      if (typeof nextId === 'undefined') {
        clearInterval(this.timer);
        return;
      }
      this.queuedRequests.delete(nextId);
      this.api.fetchRowChildren(nextId);
      this.pendingRequests.add(nextId);
    }
  };

  public enqueue = async (ids: GridRowId[]) => {
    ids.forEach((id) => {
      if (this.pendingRequests.size < this.maxConcurrentRequests) {
        this.pendingRequests.add(id);
        this.api.fetchRowChildren(id);
      } else {
        this.queuedRequests.add(id);
      }

      if (this.queuedRequests.size > 0) {
        if (this.timer) {
          clearInterval(this.timer);
        }
        this.timer = setInterval(this.processQueue, this.queueProcessInterval);
      }
    });
  };

  public setRequestSettled = (id: GridRowId) => {
    this.pendingRequests.delete(id);
    this.settledRequests.add(id);
  };

  public clearPendingRequests = () => {
    clearInterval(this.timer);
    this.queuedRequests.clear();
    Array.from(this.pendingRequests).forEach((id) => this.clearPendingRequest(id));
  };

  public clearPendingRequest = (id: GridRowId) => {
    this.api.setChildrenLoading(id, false);
    this.pendingRequests.delete(id);
  };

  public getRequestStatus = (id: GridRowId) => {
    if (this.pendingRequests.has(id)) {
      return RequestStatus.PENDING;
    }
    if (this.queuedRequests.has(id)) {
      return RequestStatus.INQUEUE;
    }
    if (this.settledRequests.has(id)) {
      return RequestStatus.SETTLED;
    }
    return RequestStatus.UNKNOWN;
  };

  public getActiveRequestsCount = () => this.pendingRequests.size + this.queuedRequests.size;
}
