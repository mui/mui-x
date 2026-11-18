import type { RefObject } from '@mui/x-internals/types';
import { GRID_ROOT_GROUP_ID } from '@mui/x-data-grid';
import type { GridGroupNode, GridKeyValue, GridRowId, GridRowTreeConfig } from '@mui/x-data-grid';
import type { GridPrivateApiPro } from '../../../models';
import type { GridGetRowsParamsPro } from './models';

const MAX_CONCURRENT_REQUESTS = Infinity;

/**
 * Fetches row children from the server with option to limit the number of concurrent requests
 * Queues requests by `GridRowId`; `getGeneration()` tells the responses of aborted requests apart
 */
export class NestedDataManager {
  private pendingRequests: Set<GridRowId> = new Set();

  private queuedRequests: Set<GridRowId> = new Set();

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
      this.queuedRequests.add(id);
      if (fetchParams?.[index]) {
        this.fetchParams.set(id, fetchParams[index]);
      } else {
        this.fetchParams.delete(id);
      }
      if (showChildrenLoading) {
        loadingIds[id] = true;
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

  public setRequestSettled = (id: GridRowId) => {
    this.pendingRequests.delete(id);
    this.processQueue();
  };

  public clear = () => {
    this.generation += 1;
    this.queuedRequests.clear();
    Array.from(this.pendingRequests).forEach((id) => this.clearPendingRequest(id));
  };

  public clearPendingRequest = (id: GridRowId) => {
    this.api.dataSource.setChildrenLoading(id, false);
    this.pendingRequests.delete(id);
    this.processQueue();
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
