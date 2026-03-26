import type { RefObject } from '@mui/x-internals/types';
import {
  GRID_ROOT_GROUP_ID,
  type GridGroupNode,
  type GridKeyValue,
  type GridRowId,
  type GridRowTreeConfig,
} from '@mui/x-data-grid';
import { RequestQueue, type RequestStatus } from '@base-ui/utils/RequestQueue';
import type { GridPrivateApiPro } from '../../../models';

/**
 * Thin wrapper around `RequestQueue` that ties request lifecycle to
 * the Data Grid's loading-state bookkeeping.
 */
export class GridRequestQueue {
  private requestQueue: RequestQueue<GridRowId>;

  private api: GridPrivateApiPro;

  constructor(apiRef: RefObject<GridPrivateApiPro>) {
    this.api = apiRef.current;
    this.requestQueue = new RequestQueue<GridRowId>({
      fetchFn: (id) => {
        this.api.fetchRowChildren(id);
        return Promise.resolve();
      },
    });
  }

  public queue = (ids: GridRowId[]) => {
    const loadingIds = Object.fromEntries(ids.map((id) => [id, true]));
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
    return this.requestQueue.queue(ids);
  };

  public setRequestSettled = (id: GridRowId) => this.requestQueue.setRequestSettled(id);

  public clear = () => this.requestQueue.clear();

  public clearPendingRequest = (id: GridRowId) => {
    this.api.dataSource.setChildrenLoading(id, false);
    return this.requestQueue.clearPendingRequest(id);
  };

  public getRequestStatus = (id: GridRowId): RequestStatus => this.requestQueue.getRequestStatus(id);
}

export const getGroupKeys = (tree: GridRowTreeConfig, rowId: GridRowId) => {
  const rowNode = tree[rowId];
  let currentNodeId = rowNode.parent;
  const groupKeys: GridKeyValue[] = [];
  while (currentNodeId && currentNodeId !== GRID_ROOT_GROUP_ID) {
    const currentNode = tree[currentNodeId] as GridGroupNode;
    groupKeys.push(currentNode.groupingKey ?? '');
    currentNodeId = currentNode.parent;
  }
  return groupKeys.reverse();
};
