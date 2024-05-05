import * as React from 'react';
import {
  useGridApiEventHandler,
  gridRowsLoadingSelector,
  useGridApiMethod,
  GridServerSideGroupNode,
  GridRowId,
  useGridSelector,
} from '@mui/x-data-grid';
import { gridRowGroupsToFetchSelector } from '@mui/x-data-grid/internals';
import { GridGetRowsParams, GridGetRowsResponse } from '../../../models';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { gridGetRowsParamsSelector } from './gridServerSideDataSelector';
import { GridDataSourceApi } from './serverSideInterfaces';

const getErrorMessage = (inputParams: GridGetRowsParams) =>
  `MUI: Error in fetching rows for the input params: ${JSON.stringify(inputParams)}`;

const runIfServerMode = (modeProp: 'server' | 'client', fn: Function) => () => {
  if (modeProp === 'server') {
    fn();
  }
};

// Make these configurable using dedicated props?
const MAX_CONCURRENT_REQUESTS = Infinity;
const QUEUE_PROCESS_INTERVAL_MS = 300;

enum RequestStatus {
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
class NestedDataManager {
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
    for (let i = 0; i < this.maxConcurrentRequests; i += 1) {
      const nextId = fetchQueue[i];
      if (!nextId) {
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
    this.api.setRowLoading(id, false);
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
  const groupsToAutoFetch = useGridSelector(privateApiRef, gridRowGroupsToFetchSelector);

  const fetchTopLevelRows = React.useCallback(async () => {
    const getRows = props.unstable_dataSource?.getRows;
    if (!getRows) {
      return;
    }

    const fetchParams = gridGetRowsParamsSelector(privateApiRef);

    const cachedData = privateApiRef.current.getCacheData(fetchParams) as
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

      try {
        const getRowsResponse = await getRows(fetchParams);
        privateApiRef.current.setCacheData(fetchParams, getRowsResponse);
        if (getRowsResponse.rowCount) {
          privateApiRef.current.setRowCount(getRowsResponse.rowCount);
        }
        privateApiRef.current.caches.groupKeys = [];
        privateApiRef.current.setRows(getRowsResponse.rows);
        privateApiRef.current.setLoading(false);
      } catch (error) {
        privateApiRef.current.setLoading(false);
        throw new Error(getErrorMessage(fetchParams));
      }
    }
  }, [nestedDataManager, privateApiRef, props.unstable_dataSource?.getRows]);

  const enqueueChildrenFetch = React.useCallback(
    (id: GridRowId) => {
      nestedDataManager.enqueue([id]);
    },
    [nestedDataManager],
  );

  const fetchRowChildren = React.useCallback<GridDataSourceApi['fetchRowChildren']>(
    async (id) => {
      if (!props.treeData) {
        nestedDataManager.clearPendingRequest(id);
        return;
      }
      const getRows = props.unstable_dataSource?.getRows;
      if (!getRows) {
        nestedDataManager.clearPendingRequest(id);
        return;
      }

      const rowNode = privateApiRef.current.getRowNode(id) as GridServerSideGroupNode;
      if (!rowNode) {
        nestedDataManager.clearPendingRequest(id);
        return;
      }

      const fetchParams = { ...gridGetRowsParamsSelector(privateApiRef), groupKeys: rowNode.path };

      const cachedData = privateApiRef.current.getCacheData(fetchParams) as
        | GridGetRowsResponse
        | undefined;

      if (cachedData != null) {
        const rows = cachedData.rows;
        privateApiRef.current.caches.groupKeys = rowNode.path;
        nestedDataManager.setRequestSettled(id);
        privateApiRef.current.updateRows(rows, false);
        if (cachedData.rowCount) {
          privateApiRef.current.setRowCount(cachedData.rowCount);
        }
        privateApiRef.current.setRowChildrenExpansion(id, true);
      } else {
        const isLoading = rowNode.isLoading;
        if (!isLoading) {
          privateApiRef.current.setRowLoading(id, true);
        }

        try {
          const getRowsResponse = await getRows(fetchParams);
          if (!privateApiRef.current.getRowNode(id)) {
            // The row has been removed from the grid
            nestedDataManager.clearPendingRequest(id);
            privateApiRef.current.setRowLoading(id, false);
            return;
          }
          if (nestedDataManager.getRequestStatus(id) === RequestStatus.UNKNOWN) {
            // Unregistered or cancelled request
            privateApiRef.current.setRowLoading(id, false);
            return;
          }
          nestedDataManager.setRequestSettled(id);
          privateApiRef.current.setCacheData(fetchParams, getRowsResponse);
          if (getRowsResponse.rowCount) {
            privateApiRef.current.setRowCount(getRowsResponse.rowCount);
          }
          privateApiRef.current.caches.groupKeys = rowNode.path;
          privateApiRef.current.updateRows(getRowsResponse.rows, false);
          privateApiRef.current.setRowChildrenExpansion(id, true);
          privateApiRef.current.setRowLoading(id, false);
        } catch (error) {
          nestedDataManager.setRequestSettled(id);
          privateApiRef.current.setRowLoading(id, false);
          throw new Error(getErrorMessage(fetchParams));
        }
      }
    },
    [nestedDataManager, privateApiRef, props.treeData, props.unstable_dataSource?.getRows],
  );

  const setRowLoading = React.useCallback<GridDataSourceApi['setRowLoading']>(
    (id, isLoading) => {
      const currentNode = privateApiRef.current.getRowNode(id) as GridServerSideGroupNode;
      if (!currentNode) {
        return;
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

  const dataSourceApi: GridDataSourceApi = {
    enqueueChildrenFetch,
    // TODO: Make `fetchRowChildren` private
    fetchRowChildren,
    setRowLoading,
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
      nestedDataManager.enqueue(groupsToAutoFetch);
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
