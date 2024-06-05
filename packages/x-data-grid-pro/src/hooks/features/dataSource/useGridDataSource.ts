import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import {
  useGridApiEventHandler,
  gridRowsLoadingSelector,
  useGridApiMethod,
  GridServerSideGroupNode,
  GridRowId,
  useGridSelector,
} from '@mui/x-data-grid';
import { gridRowGroupsToFetchSelector, GridStateInitializer } from '@mui/x-data-grid/internals';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import {
  gridGetRowsParamsSelector,
  gridDataSourceLoadingSelector,
  gridDataSourceErrorsSelector,
} from './gridDataSourceSelector';
import { GridDataSourceApi, GridDataSourcePrivateApi } from './interfaces';
import { runIfServerMode, NestedDataManager, RequestStatus } from './utils';

const INITIAL_STATE = {
  loading: {},
  errors: {},
};

export const dataSourceStateInitializer: GridStateInitializer = (state, _, apiRef) => {
  apiRef.current.caches.dataSource = {
    groupKeys: [],
  };

  return {
    ...state,
    dataSource: INITIAL_STATE,
  };
};

export const useGridDataSource = (
  privateApiRef: React.MutableRefObject<GridPrivateApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    | 'unstable_dataSource'
    | 'unstable_onDataSourceError'
    | 'sortingMode'
    | 'filterMode'
    | 'paginationMode'
    | 'treeData'
  >,
) => {
  const nestedDataManager = useLazyRef<NestedDataManager, void>(
    () => new NestedDataManager(privateApiRef),
  ).current;
  const groupsToAutoFetch = useGridSelector(privateApiRef, gridRowGroupsToFetchSelector);
  const scheduledGroups = React.useRef<number>(0);
  const onError = props.unstable_onDataSourceError;

  const fetchTopLevelRows = React.useCallback(async () => {
    const getRows = props.unstable_dataSource?.getRows;
    if (!getRows) {
      return;
    }

    nestedDataManager.clear();
    scheduledGroups.current = 0;
    const dataSourceState = privateApiRef.current.state.dataSource;
    if (dataSourceState !== INITIAL_STATE) {
      privateApiRef.current.resetDataSourceState();
    }

    const fetchParams = gridGetRowsParamsSelector(privateApiRef);

    const cachedData = privateApiRef.current.getCacheData(fetchParams);

    if (cachedData != null) {
      const rows = cachedData.rows;
      privateApiRef.current.caches.dataSource.groupKeys = [];
      privateApiRef.current.setRows(rows);
      if (cachedData.rowCount) {
        privateApiRef.current.setRowCount(cachedData.rowCount);
      }
      return;
    }

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
      privateApiRef.current.caches.dataSource.groupKeys = [];
      privateApiRef.current.setRows(getRowsResponse.rows);
      privateApiRef.current.setLoading(false);
    } catch (error) {
      privateApiRef.current.setRows([]);
      privateApiRef.current.setLoading(false);
      onError?.(error as Error, fetchParams);
    }
  }, [nestedDataManager, privateApiRef, props.unstable_dataSource?.getRows, onError]);

  const queueChildrenFetch = React.useCallback(
    (id: GridRowId) => {
      privateApiRef.current.setChildrenLoading(id, true);
      nestedDataManager.enqueue([id]);
    },
    [privateApiRef, nestedDataManager],
  );

  const fetchRowChildren = React.useCallback<GridDataSourcePrivateApi['fetchRowChildren']>(
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

      const cachedData = privateApiRef.current.getCacheData(fetchParams);

      const isLoading = gridDataSourceLoadingSelector(privateApiRef)[id] ?? false;
      if (cachedData != null) {
        const rows = cachedData.rows;
        privateApiRef.current.caches.dataSource.groupKeys = rowNode.path;
        nestedDataManager.setRequestSettled(id);
        privateApiRef.current.updateRows(rows, false);
        if (cachedData.rowCount) {
          privateApiRef.current.setRowCount(cachedData.rowCount);
        }
        privateApiRef.current.setRowChildrenExpansion(id, true);
        if (isLoading) {
          privateApiRef.current.setChildrenLoading(id, false);
        }
        return;
      }

      if (!isLoading) {
        privateApiRef.current.setChildrenLoading(id, true);
      }

      const existingError = gridDataSourceErrorsSelector(privateApiRef)[id] ?? null;
      if (existingError) {
        privateApiRef.current.setChildrenFetchError(id, null);
      }

      try {
        const getRowsResponse = await getRows(fetchParams);
        if (!privateApiRef.current.getRowNode(id)) {
          // The row has been removed from the grid
          nestedDataManager.clearPendingRequest(id);
          privateApiRef.current.setChildrenLoading(id, false);
          return;
        }
        if (nestedDataManager.getRequestStatus(id) === RequestStatus.UNKNOWN) {
          privateApiRef.current.setChildrenLoading(id, false);
          return;
        }
        nestedDataManager.setRequestSettled(id);
        privateApiRef.current.setCacheData(fetchParams, getRowsResponse);
        if (getRowsResponse.rowCount) {
          privateApiRef.current.setRowCount(getRowsResponse.rowCount);
        }
        privateApiRef.current.caches.dataSource.groupKeys = rowNode.path;
        privateApiRef.current.updateRows(getRowsResponse.rows, false);
        privateApiRef.current.setRowChildrenExpansion(id, true);
      } catch (error) {
        const e = error as Error;
        privateApiRef.current.setChildrenFetchError(id, e);
        onError?.(e, fetchParams);
      } finally {
        privateApiRef.current.setChildrenLoading(id, false);
        nestedDataManager.setRequestSettled(id);
      }
    },
    [nestedDataManager, onError, privateApiRef, props.treeData, props.unstable_dataSource?.getRows],
  );

  const setChildrenLoading = React.useCallback<GridDataSourceApi['setChildrenLoading']>(
    (parentId, isLoading) => {
      privateApiRef.current.setState((state) => {
        return {
          ...state,
          dataSource: {
            ...state.dataSource,
            loading: { ...state.dataSource.loading, [parentId]: isLoading },
          },
        };
      });
    },
    [privateApiRef],
  );

  const setChildrenFetchError = React.useCallback<GridDataSourceApi['setChildrenFetchError']>(
    (parentId, error) => {
      privateApiRef.current.setState((state) => {
        return {
          ...state,
          dataSource: {
            ...state.dataSource,
            errors: { ...state.dataSource.errors, [parentId]: error },
          },
        };
      });
    },
    [privateApiRef],
  );

  const resetDataSourceState = React.useCallback(() => {
    privateApiRef.current.setState((state) => {
      return {
        ...state,
        dataSource: INITIAL_STATE,
      };
    });
  }, [privateApiRef]);

  const dataSourceApi: GridDataSourceApi = {
    queueChildrenFetch,
    setChildrenLoading,
    setChildrenFetchError,
    fetchTopLevelRows,
  };

  const dataSourcePrivateApi: GridDataSourcePrivateApi = {
    fetchRowChildren,
    resetDataSourceState,
  };

  useGridApiMethod(privateApiRef, dataSourceApi, 'public');
  useGridApiMethod(privateApiRef, dataSourcePrivateApi, 'private');

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
    if (
      groupsToAutoFetch &&
      groupsToAutoFetch.length &&
      scheduledGroups.current < groupsToAutoFetch.length
    ) {
      const groupsToSchedule = groupsToAutoFetch.slice(scheduledGroups.current);
      nestedDataManager.enqueue(groupsToSchedule);
      scheduledGroups.current = groupsToAutoFetch.length;
    }
  }, [privateApiRef, nestedDataManager, groupsToAutoFetch]);
};
