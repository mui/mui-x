import type { RefObject } from '@mui/x-internals/types';
import { GRID_ROOT_GROUP_ID } from '@mui/x-data-grid';
import type { GridGroupNode, GridKeyValue, GridRowId, GridRowTreeConfig } from '@mui/x-data-grid';
import type { GridPrivateApiPro } from '../../../models';
import type { GridGetRowsParamsPro } from './models';

const MAX_CONCURRENT_REQUESTS = Infinity;

// Two requests for the same row are the same request when they ask for the same range.
const getRequestKey = (fetchParams: GridGetRowsParamsPro | undefined) =>
  fetchParams?.start === undefined ? '' : `${fetchParams.start}-${fetchParams.end}`;

/**
 * Fetches row children from the server with option to limit the number of concurrent requests
 * Queues requests by `GridRowId`; `getGeneration()` tells the responses of aborted requests apart
 */
export class NestedDataManager {
  private pendingRequests: Set<GridRowId> = new Set();

  private queuedRequests: Set<GridRowId> = new Set();

  // The requests of each row that are queued or pending, by request key.
  private activeRequestKeys: Map<GridRowId, Set<string>> = new Map();

  // Bumped by `clear()`, so the responses of the aborted requests can be told apart.
  private generation = 0;

  private fetchParams: Map<GridRowId, GridGetRowsParamsPro> = new Map();

  declare private api: GridPrivateApiPro;

  declare private maxConcurrentRequests: number;

  constructor(
    privateApiRef: RefObject<GridPrivateApiPro>,
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
      this.api.fetchRowChildren(id, this.fetchParams.get(id));
    }
  };

  public queue = async (
    ids: GridRowId[],
    fetchParams: GridGetRowsParamsPro[],
    showChildrenLoading = true,
  ) => {
    const loadingIds: Record<GridRowId, boolean> = {};
    ids.forEach((id, index) => {
      if (showChildrenLoading) {
        loadingIds[id] = true;
      }
      const requestKey = getRequestKey(fetchParams?.[index]);
      const activeKeys = this.activeRequestKeys.get(id) ?? new Set();
      // The same request is already on its way, its response serves this one too.
      if (activeKeys.has(requestKey)) {
        return;
      }
      if (this.queuedRequests.has(id)) {
        // Only the latest params of a queued row are sent.
        activeKeys.delete(getRequestKey(this.fetchParams.get(id)));
      }
      activeKeys.add(requestKey);
      this.activeRequestKeys.set(id, activeKeys);
      this.queuedRequests.add(id);
      if (fetchParams?.[index]) {
        this.fetchParams.set(id, fetchParams[index]);
      } else {
        this.fetchParams.delete(id);
      }
    });
    if (showChildrenLoading) {
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
    }
    this.processQueue();
  };

  public setRequestSettled = (id: GridRowId, fetchParams?: GridGetRowsParamsPro) => {
    const activeKeys = this.activeRequestKeys.get(id);
    activeKeys?.delete(getRequestKey(fetchParams));
    // Another range of the same row can still be pending.
    if (!activeKeys || activeKeys.size === 0) {
      this.activeRequestKeys.delete(id);
      this.pendingRequests.delete(id);
    }
    this.processQueue();
  };

  public clear = () => {
    this.generation += 1;
    this.queuedRequests.clear();
    this.activeRequestKeys.clear();
    Array.from(this.pendingRequests).forEach((id) => this.clearPendingRequest(id));
  };

  public clearPendingRequest = (id: GridRowId, fetchParams?: GridGetRowsParamsPro) => {
    this.api.dataSource.setChildrenLoading(id, false);
    this.setRequestSettled(id, fetchParams);
  };

  public getGeneration = () => this.generation;

  public getActiveRequestsCount = () => this.pendingRequests.size + this.queuedRequests.size;
}

export const getGroupKeys = (tree: GridRowTreeConfig, rowId: GridRowId) => {
  const rowNode = tree[rowId];
  let currentNodeId = rowNode.parent;
  const groupKeys: GridKeyValue[] = [];
  while (currentNodeId != null && currentNodeId !== GRID_ROOT_GROUP_ID) {
    const currentNode = tree[currentNodeId] as GridGroupNode;
    groupKeys.push(currentNode.groupingKey ?? '');
    currentNodeId = currentNode.parent;
  }
  return groupKeys.reverse();
};
