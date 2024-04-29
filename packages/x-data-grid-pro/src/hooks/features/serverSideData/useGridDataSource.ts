import * as React from 'react';
import {
  gridPaginationModelSelector,
  gridFilterModelSelector,
  gridSortModelSelector,
  useGridApiEventHandler,
  GridPaginationModel,
  gridRowsLoadingSelector,
  useGridApiMethod,
  GridServerSideGroupNode,
  GridRowId,
} from '@mui/x-data-grid';
import { gridRowGroupsToFetchSelector } from '@mui/x-data-grid/internals';
import { GridGetRowsParams, GridGetRowsResponse, GridDataSource } from '../../../models';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GridDataSourceApi } from './serverSideInterfaces';

const computeStartEnd = (paginationModel: GridPaginationModel) => {
  const start = paginationModel.page * paginationModel.pageSize;
  const end = start + paginationModel.pageSize - 1;
  return { start, end };
};

const getErrorMessage = (inputParams: GridGetRowsParams) =>
  `MUI: Error in fetching rows for the input params: ${JSON.stringify(inputParams)}`;

const fetchRowsWithError = async (
  getRows: GridDataSource['getRows'],
  inputParams: GridGetRowsParams,
) => {
  try {
    const getRowsResponse = await getRows(inputParams);
    return getRowsResponse;
  } catch (error) {
    throw new Error(
      `MUI X: Error in fetching rows for the input params: ${JSON.stringify(inputParams)}`,
    );
  }
};

const runIfServerMode = (modeProp: 'server' | 'client', fn: Function) => () => {
  if (modeProp === 'server') {
    fn();
  }
};

const MAX_CONCURRENT_REQUESTS = Infinity;

enum RequestStatus {
  INQUEUE,
  PENDING,
  SETTLED,
  CANCELLED,
  UNKNOWN,
}

/**
 * Fetches row children from the server limiting the number of concurrent requests
 * Determines the status of a request based on the enum `RequestStatus`
 */
class NestedDataManager {
  private pendingRequests: Set<GridRowId> = new Set();

  private fetchQueue: Set<GridRowId> = new Set();

  private fetchQueueStatus: Map<GridRowId, RequestStatus> = new Map();

  private fetchQueueIndex = 0;

  private api: GridPrivateApiPro;

  private maxConcurrentRequests: number;

  constructor(
    private privateApiRef: React.MutableRefObject<GridPrivateApiPro>,
    private maxRequests = MAX_CONCURRENT_REQUESTS,
  ) {
    this.api = privateApiRef.current;
    this.maxConcurrentRequests = maxRequests;
  }

  public fetch = async (ids: GridRowId[]) => {
    ids.forEach((id) => {
      if (this.pendingRequests.size < this.maxConcurrentRequests) {
        this.pendingRequests.add(id);
        this.api.fetchRowChildren(id, false);
      } else {
        this.fetchQueue.add(id);
        this.fetchQueueStatus.set(id, RequestStatus.INQUEUE);
      }
    });
  };

  public setRequestSettled = (id: GridRowId) => {
    this.fetchQueueStatus.set(id, RequestStatus.SETTLED);
    this.pendingRequests.delete(id);
    this.processQueue();
  };

  public processQueue = async () => {
    if (this.fetchQueue.size === 0) {
      return;
    }
    const fetchQueue = Array.from(this.fetchQueue);
    for (
      let i = this.fetchQueueIndex;
      this.fetchQueueIndex < fetchQueue.length;
      this.fetchQueueIndex += 1
    ) {
      const nextId = fetchQueue[i];
      if (this.fetchQueueStatus.get(nextId) === RequestStatus.INQUEUE) {
        this.api.fetchRowChildren(nextId);
        this.fetchQueueStatus.set(nextId, RequestStatus.PENDING);
      }
    }
  };

  public clearPendingRequests = () => {
    this.fetchQueue.clear();
    this.fetchQueueIndex = 0;
    Array.from(this.pendingRequests).forEach((id) => {
      this.fetchQueueStatus.set(id, RequestStatus.CANCELLED);
      this.api.setRowLoading(id, false);
      this.pendingRequests.delete(id);
    });
  };

  public clearPendingRequest = (id: GridRowId) => {
    this.fetchQueueStatus.set(id, RequestStatus.CANCELLED);
    this.pendingRequests.delete(id);
  };

  public getRequestStatus = (id: GridRowId) =>
    this.fetchQueueStatus.get(id) ?? RequestStatus.UNKNOWN;

  public getActiveRequestsCount = () => this.pendingRequests.size;
}

export const useGridDataSource = (
  privateApiRef: React.MutableRefObject<GridPrivateApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    'unstable_dataSource' | 'sortingMode' | 'filterMode' | 'paginationMode' | 'treeData'
  >,
): void => {
  const nestedDataManager = React.useRef<NestedDataManager>(
    new NestedDataManager(privateApiRef),
  ).current;
  const groupsToAutoFetch = gridRowGroupsToFetchSelector(privateApiRef);
  const getInputParams = React.useCallback(
    (additionalParams?: Partial<GridGetRowsParams>): GridGetRowsParams => {
      const paginationModel = gridPaginationModelSelector(privateApiRef);

      return {
        groupKeys: [],
        paginationModel,
        sortModel: gridSortModelSelector(privateApiRef),
        filterModel: gridFilterModelSelector(privateApiRef),
        ...computeStartEnd(paginationModel),
        ...additionalParams,
      };
    },
    [privateApiRef],
  );

  const fetchTopLevelRows = React.useCallback(async () => {
    const getRows = props.unstable_dataSource?.getRows;
    if (!getRows) {
      return;
    }

    const inputParams = getInputParams();
    const cachedData = privateApiRef.current.getCacheData(inputParams) as
      | GridGetRowsResponse
      | undefined;

    if (nestedDataManager.getActiveRequestsCount() > 0) {
      nestedDataManager.clearPendingRequests();
    }
    if (cachedData != null) {
      const rows = cachedData.rows;
      privateApiRef.current.caches.groupKeys = [];
      privateApiRef.current.setRows(rows);
      if (cachedData.rowCount) {
        privateApiRef.current.setRowCount(cachedData.rowCount);
      }
    } else {
      const isLoading = gridRowsLoadingSelector(privateApiRef);
      if (!isLoading) {
        privateApiRef.current.setLoading(true);
      }

      const getRowsResponse = await fetchRowsWithError(getRows, inputParams);
      // TODO: Add respective events
      // @ts-expect-error
      privateApiRef.current.publishEvent('loadData', {
        params: inputParams,
        response: getRowsResponse,
      });
      privateApiRef.current.setCacheData(inputParams, getRowsResponse);
      if (getRowsResponse.rowCount) {
        privateApiRef.current.setRowCount(getRowsResponse.rowCount);
      }
      privateApiRef.current.caches.groupKeys = [];
      privateApiRef.current.setRows(getRowsResponse.rows);
      privateApiRef.current.setLoading(false);
      // TODO: handle cursor based pagination
    }
  }, [getInputParams, nestedDataManager, privateApiRef, props.unstable_dataSource?.getRows]);

  const fetchRowChildren = React.useCallback<GridDataSourceApi['fetchRowChildren']>(
    async (id, throttle = true) => {
      if (!props.treeData) {
        return;
      }
      const getRows = props.unstable_dataSource?.getRows;
      if (!getRows) {
        return;
      }

      const rowNode = privateApiRef.current.getRowNode(id) as GridServerSideGroupNode;
      if (!rowNode) {
        return;
      }
      const inputParams = getInputParams({ groupKeys: rowNode.path });

      const cachedData = privateApiRef.current.getCacheData(inputParams) as
        | GridGetRowsResponse
        | undefined;

      if (cachedData != null) {
        const rows = cachedData.rows;
        privateApiRef.current.caches.groupKeys = rowNode.path;
        privateApiRef.current.updateRows(rows, throttle);
        if (cachedData.rowCount) {
          privateApiRef.current.setRowCount(cachedData.rowCount);
        }
        privateApiRef.current.setRowChildrenExpansion(id, true);
        privateApiRef.current.setChildrenFetched(id, true);
      } else {
        const isLoading = rowNode.isLoading;
        if (!isLoading) {
          privateApiRef.current.setRowLoading(id, true);
        }

        try {
          const getRowsResponse = await getRows(inputParams);
          nestedDataManager.setRequestSettled(id);
          if (!privateApiRef.current.getRowNode(id)) {
            nestedDataManager.clearPendingRequest(id);
            return;
          }
          if (nestedDataManager.getRequestStatus(id) === RequestStatus.CANCELLED) {
            return;
          }
          privateApiRef.current.setCacheData(inputParams, getRowsResponse);
          if (getRowsResponse.rowCount) {
            privateApiRef.current.setRowCount(getRowsResponse.rowCount);
          }
          privateApiRef.current.caches.groupKeys = rowNode.path;
          privateApiRef.current.updateRows(getRowsResponse.rows, throttle);
          privateApiRef.current.setRowChildrenExpansion(id, true);
          privateApiRef.current.setChildrenFetched(id, true);
          privateApiRef.current.setRowLoading(id, false);
        } catch (error) {
          nestedDataManager.setRequestSettled(id);
          privateApiRef.current.setRowLoading(id, false);
          throw new Error(getErrorMessage(inputParams));
        }
      }
    },
    [
      getInputParams,
      nestedDataManager,
      privateApiRef,
      props.treeData,
      props.unstable_dataSource?.getRows,
    ],
  );

  const setRowLoading = React.useCallback<GridDataSourceApi['setRowLoading']>(
    (id, isLoading) => {
      const currentNode = privateApiRef.current.getRowNode(id) as GridServerSideGroupNode;
      if (!currentNode) {
        throw new Error(`MUI: No row with id #${id} found`);
      }

      const newNode: GridServerSideGroupNode = { ...currentNode, isLoading };
      privateApiRef.current.setState((state) => {
        return {
          ...state,
          rows: {
            ...state.rows,
            tree: { ...state.rows.tree, [id]: newNode },
          },
        };
      });
    },
    [privateApiRef],
  );

  const setChildrenFetched = React.useCallback<GridDataSourceApi['setChildrenFetched']>(
    (id, childrenFetched) => {
      const currentNode = privateApiRef.current.getRowNode(id) as GridServerSideGroupNode;
      if (!currentNode) {
        throw new Error(`MUI: No row with id #${id} found`);
      }

      const newNode: GridServerSideGroupNode = { ...currentNode, childrenFetched };
      privateApiRef.current.setState((state) => {
        return {
          ...state,
          rows: {
            ...state.rows,
            tree: { ...state.rows.tree, [id]: newNode },
          },
        };
      });
    },
    [privateApiRef],
  );

  const dataSourceApi: GridDataSourceApi = {
    fetchRowChildren,
    setRowLoading,
    setChildrenFetched,
    fetchTopLevelRows,
  };

  useGridApiMethod(privateApiRef, dataSourceApi, 'public');

  /*
   * EVENTS
   */
  useGridApiEventHandler(
    privateApiRef,
    'sortModelChange',
    runIfServerMode(props.sortingMode, fetchTopLevelRows),
  );
  useGridApiEventHandler(
    privateApiRef,
    'filterModelChange',
    runIfServerMode(props.filterMode, fetchTopLevelRows),
  );
  useGridApiEventHandler(
    privateApiRef,
    'paginationModelChange',
    runIfServerMode(props.paginationMode, fetchTopLevelRows),
  );

  /*
   * EFFECTS
   */
  React.useEffect(() => {
    if (props.unstable_dataSource) {
      privateApiRef.current.clearCache();
      privateApiRef.current.fetchTopLevelRows();
    }
  }, [privateApiRef, props.unstable_dataSource]);

  React.useEffect(() => {
    if (groupsToAutoFetch && groupsToAutoFetch.length > 0) {
      nestedDataManager.fetch(groupsToAutoFetch);
      privateApiRef.current.setState((state) => ({
        ...state,
        rows: {
          ...state.rows,
          groupsToFetch: [],
        },
      }));
    }
  }, [privateApiRef, nestedDataManager, groupsToAutoFetch]);
};
