import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import {
  useGridApiEventHandler,
  gridRowsLoadingSelector,
  useGridApiMethod,
  GridServerSideGroupNode,
  useGridSelector,
  GridRowId,
} from '@mui/x-data-grid';
import { gridRowGroupsToFetchSelector, GridStateInitializer } from '@mui/x-data-grid/internals';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { gridGetRowsParamsSelector, gridDataSourceErrorsSelector } from './gridDataSourceSelector';
import { GridDataSourceApi, GridDataSourceApiBase, GridDataSourcePrivateApi } from './interfaces';
import { runIfServerMode, NestedDataManager, RequestStatus } from './utils';

const INITIAL_STATE = {
  loading: {},
  errors: {},
};

export const dataSourceStateInitializer: GridStateInitializer = (state) => {
  return {
    ...state,
    dataSource: INITIAL_STATE,
  };
};

export const useGridDataSource = (
  apiRef: React.MutableRefObject<GridPrivateApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    | 'unstable_dataSource'
    | 'unstable_onDataSourceError'
    | 'sortingMode'
    | 'filterMode'
    | 'paginationMode'
    | 'treeData'
    | 'getRowId'
    | 'loading'
    | 'rowCount'
  >,
) => {
  const nestedDataManager = useLazyRef<NestedDataManager, void>(
    () => new NestedDataManager(apiRef),
  ).current;
  const groupsToAutoFetch = useGridSelector(apiRef, gridRowGroupsToFetchSelector);
  const scheduledGroups = React.useRef<number>(0);
  const onError = props.unstable_onDataSourceError;

  const fetchRows = React.useCallback(
    async (parentId?: GridRowId) => {
      const getRows = props.unstable_dataSource?.getRows;
      if (!getRows) {
        return;
      }

      if (parentId) {
        nestedDataManager.queue([parentId]);
        return;
      }

      nestedDataManager.clear();
      scheduledGroups.current = 0;
      const dataSourceState = apiRef.current.state.dataSource;
      if (dataSourceState !== INITIAL_STATE) {
        apiRef.current.resetDataSourceState();
      }

      const fetchParams = gridGetRowsParamsSelector(apiRef);

      const cachedData = apiRef.current.unstable_dataSourceCache.get(fetchParams);

      if (cachedData !== undefined) {
        const rows = cachedData.rows;
        apiRef.current.setRows(rows);
        if (cachedData.rowCount) {
          apiRef.current.setRowCount(cachedData.rowCount);
        }
        return;
      }

      const isLoading = gridRowsLoadingSelector(apiRef);
      if (!isLoading) {
        apiRef.current.setLoading(true);
      }

      try {
        const getRowsResponse = await getRows(fetchParams);
        apiRef.current.unstable_dataSourceCache.set(fetchParams, getRowsResponse);
        if (getRowsResponse.rowCount) {
          apiRef.current.setRowCount(getRowsResponse.rowCount);
        }
        apiRef.current.setRows(getRowsResponse.rows);
        apiRef.current.setLoading(false);
      } catch (error) {
        apiRef.current.setRows([]);
        apiRef.current.setLoading(false);
        onError?.(error as Error, fetchParams);
      }
    },
    [nestedDataManager, apiRef, props.unstable_dataSource?.getRows, onError],
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

      const rowNode = apiRef.current.getRowNode<GridServerSideGroupNode>(id);
      if (!rowNode) {
        nestedDataManager.clearPendingRequest(id);
        return;
      }

      const fetchParams = { ...gridGetRowsParamsSelector(apiRef), groupKeys: rowNode.path };

      const cachedData = apiRef.current.unstable_dataSourceCache.get(fetchParams);

      if (cachedData !== undefined) {
        const rows = cachedData.rows;
        nestedDataManager.setRequestSettled(id);
        apiRef.current.updateServerRows(rows, rowNode.path);
        if (cachedData.rowCount) {
          apiRef.current.setRowCount(cachedData.rowCount);
        }
        apiRef.current.setRowChildrenExpansion(id, true);
        apiRef.current.unstable_dataSource.setChildrenLoading(id, false);
        return;
      }

      const existingError = gridDataSourceErrorsSelector(apiRef)[id] ?? null;
      if (existingError) {
        apiRef.current.unstable_dataSource.setChildrenFetchError(id, null);
      }

      try {
        const getRowsResponse = await getRows(fetchParams);
        if (!apiRef.current.getRowNode(id)) {
          // The row has been removed from the grid
          nestedDataManager.clearPendingRequest(id);
          return;
        }
        if (nestedDataManager.getRequestStatus(id) === RequestStatus.UNKNOWN) {
          apiRef.current.unstable_dataSource.setChildrenLoading(id, false);
          return;
        }
        nestedDataManager.setRequestSettled(id);
        apiRef.current.unstable_dataSourceCache.set(fetchParams, getRowsResponse);
        if (getRowsResponse.rowCount) {
          apiRef.current.setRowCount(getRowsResponse.rowCount);
        }
        apiRef.current.updateServerRows(getRowsResponse.rows, rowNode.path);
        apiRef.current.setRowChildrenExpansion(id, true);
      } catch (error) {
        const e = error as Error;
        apiRef.current.unstable_dataSource.setChildrenFetchError(id, e);
        onError?.(e, fetchParams);
      } finally {
        apiRef.current.unstable_dataSource.setChildrenLoading(id, false);
        nestedDataManager.setRequestSettled(id);
      }
    },
    [nestedDataManager, onError, apiRef, props.treeData, props.unstable_dataSource?.getRows],
  );

  const setChildrenLoading = React.useCallback<GridDataSourceApiBase['setChildrenLoading']>(
    (parentId, isLoading) => {
      apiRef.current.setState((state) => {
        return {
          ...state,
          dataSource: {
            ...state.dataSource,
            loading: { ...state.dataSource.loading, [parentId]: isLoading },
          },
        };
      });
    },
    [apiRef],
  );

  const setChildrenFetchError = React.useCallback<GridDataSourceApiBase['setChildrenFetchError']>(
    (parentId, error) => {
      apiRef.current.setState((state) => {
        return {
          ...state,
          dataSource: {
            ...state.dataSource,
            errors: { ...state.dataSource.errors, [parentId]: error },
          },
        };
      });
    },
    [apiRef],
  );

  const resetDataSourceState = React.useCallback(() => {
    apiRef.current.setState((state) => {
      return {
        ...state,
        dataSource: INITIAL_STATE,
      };
    });
  }, [apiRef]);

  const dataSourceApi: GridDataSourceApi = {
    unstable_dataSource: {
      setChildrenLoading,
      setChildrenFetchError,
      fetchRows,
    },
  };

  const dataSourcePrivateApi: GridDataSourcePrivateApi = {
    fetchRowChildren,
    resetDataSourceState,
  };

  useGridApiMethod(apiRef, dataSourceApi, 'public');
  useGridApiMethod(apiRef, dataSourcePrivateApi, 'private');

  /*
   * EVENTS
   */
  useGridApiEventHandler(apiRef, 'sortModelChange', runIfServerMode(props.sortingMode, fetchRows));
  useGridApiEventHandler(apiRef, 'filterModelChange', runIfServerMode(props.filterMode, fetchRows));
  useGridApiEventHandler(
    apiRef,
    'paginationModelChange',
    runIfServerMode(props.paginationMode, fetchRows),
  );

  /*
   * EFFECTS
   */
  React.useEffect(() => {
    if (props.unstable_dataSource) {
      apiRef.current.unstable_dataSourceCache.clear();
      apiRef.current.unstable_dataSource.fetchRows();
    }
  }, [apiRef, props.unstable_dataSource]);

  React.useEffect(() => {
    if (
      groupsToAutoFetch &&
      groupsToAutoFetch.length &&
      scheduledGroups.current < groupsToAutoFetch.length
    ) {
      const groupsToSchedule = groupsToAutoFetch.slice(scheduledGroups.current);
      nestedDataManager.queue(groupsToSchedule);
      scheduledGroups.current = groupsToAutoFetch.length;
    }
  }, [apiRef, nestedDataManager, groupsToAutoFetch]);
};
