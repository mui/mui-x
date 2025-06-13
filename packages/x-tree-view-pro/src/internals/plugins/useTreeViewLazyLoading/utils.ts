import { TreeViewInstance, UseTreeViewLazyLoadingSignature } from '@mui/x-tree-view/internals';
import { TreeViewItemId } from '@mui/x-tree-view/models';

const MAX_CONCURRENT_REQUESTS = Infinity;

export enum RequestStatus {
  QUEUED,
  PENDING,
  SETTLED,
  UNKNOWN,
}

/**
 * Plugins that need to be present in the Tree View in order for the `NestedDataManager` class to work correctly.
 */
type NestedDataManagerMinimalPlugins = readonly [UseTreeViewLazyLoadingSignature];

/**
 * Plugins that the `NestedDataManager` class can use if they are present, but are not required.
 */

export type NestedDataManagerOptionalPlugins = readonly [];

/**
 * Fetches row children from the server with option to limit the number of concurrent requests
 * Determines the status of a request based on the enum `RequestStatus`
 * Uses `ParentId` to uniquely identify a request
 */
export class NestedDataManager {
  private pendingRequests: Set<TreeViewItemId> = new Set();

  private queuedRequests: Set<TreeViewItemId> = new Set();

  private settledRequests: Set<TreeViewItemId> = new Set();

  private instance: TreeViewInstance<
    NestedDataManagerMinimalPlugins,
    NestedDataManagerOptionalPlugins
  >;

  private maxConcurrentRequests: number;

  constructor(
    instance: TreeViewInstance<[UseTreeViewLazyLoadingSignature]>,
    maxConcurrentRequests = MAX_CONCURRENT_REQUESTS,
  ) {
    this.instance = instance;
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
    const fetchPromises: Promise<void>[] = [];
    for (let i = 0; i < loopLength; i += 1) {
      const id = fetchQueue[i];
      this.queuedRequests.delete(id);
      this.pendingRequests.add(id);

      fetchPromises.push(this.instance.fetchItemChildren(id));
    }
    await Promise.all(fetchPromises);
  };

  public queue = async (ids: TreeViewItemId[]) => {
    const loadingIds: Record<TreeViewItemId, boolean> = {};
    ids.forEach((id) => {
      this.queuedRequests.add(id);
      loadingIds[id] = true;
    });

    await this.processQueue();
  };

  public setRequestSettled = async (id: TreeViewItemId) => {
    this.pendingRequests.delete(id);
    this.settledRequests.add(id);
    await this.processQueue();
  };

  public clear = () => {
    this.queuedRequests.clear();
    Array.from(this.pendingRequests).forEach((id) => this.clearPendingRequest(id));
  };

  public clearPendingRequest = async (id: TreeViewItemId) => {
    this.pendingRequests.delete(id);
    await this.processQueue();
  };

  public getRequestStatus = (id: TreeViewItemId) => {
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
