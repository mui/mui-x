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
  privateApiRef: React.MutableRefObject<GridPrivateApiPro>,
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
    () => new NestedDataManager(privateApiRef),
  ).current;
  const groupsToAutoFetch = useGridSelector(privateApiRef, gridRowGroupsToFetchSelector);
  const scheduledGroups = React.useRef<number>(0);
  const onError = props.unstable_onDataSourceError;

  const fetchRows = React.useCallback(
    async (parentId?: GridRowId) => {
      const getRows = props.unstable_dataSource?.getRows;
      if (!getRows) {
        return;
      }

      if (parentId) {
        nestedDataManager.enqueue([parentId]);
        return;
      }

      nestedDataManager.clear();
      scheduledGroups.current = 0;
      const dataSourceState = privateApiRef.current.state.dataSource;
      if (dataSourceState !== INITIAL_STATE) {
        privateApiRef.current.resetDataSourceState();
      }

      const fetchParams = gridGetRowsParamsSelector(privateApiRef);

      const cachedData = privateApiRef.current.unstable_dataSourceCache?.get(fetchParams);

      if (cachedData != null) {
        const rows = cachedData.rows;
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
        privateApiRef.current.unstable_dataSourceCache?.set(fetchParams, getRowsResponse);
        if (getRowsResponse.rowCount) {
          privateApiRef.current.setRowCount(getRowsResponse.rowCount);
        }
        privateApiRef.current.setRows(getRowsResponse.rows);
        privateApiRef.current.setLoading(false);
      } catch (error) {
        privateApiRef.current.setRows([]);
        privateApiRef.current.setLoading(false);
        onError?.(error as Error, fetchParams);
      }
    },
    [nestedDataManager, privateApiRef, props.unstable_dataSource?.getRows, onError],
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

      const cachedData = privateApiRef.current.unstable_dataSourceCache?.get(fetchParams);

      if (cachedData != null) {
        const rows = cachedData.rows;
        nestedDataManager.setRequestSettled(id);
        privateApiRef.current.updateServerRows(rows, rowNode.path);
        if (cachedData.rowCount) {
          privateApiRef.current.setRowCount(cachedData.rowCount);
        }
        privateApiRef.current.setRowChildrenExpansion(id, true);
        privateApiRef.current.unstable_dataSource.setChildrenLoading(id, false);
        return;
      }

      const existingError = gridDataSourceErrorsSelector(privateApiRef)[id] ?? null;
      if (existingError) {
        privateApiRef.current.unstable_dataSource.setChildrenFetchError(id, null);
      }

      try {
        const getRowsResponse = await getRows(fetchParams);
        if (!privateApiRef.current.getRowNode(id)) {
          // The row has been removed from the grid
          nestedDataManager.clearPendingRequest(id);
          privateApiRef.current.unstable_dataSource.setChildrenLoading(id, false);
          return;
        }
        if (nestedDataManager.getRequestStatus(id) === RequestStatus.UNKNOWN) {
          privateApiRef.current.unstable_dataSource.setChildrenLoading(id, false);
          return;
        }
        nestedDataManager.setRequestSettled(id);
        privateApiRef.current.unstable_dataSourceCache?.set(fetchParams, getRowsResponse);
        if (getRowsResponse.rowCount) {
          privateApiRef.current.setRowCount(getRowsResponse.rowCount);
        }
        privateApiRef.current.updateServerRows(getRowsResponse.rows, rowNode.path);
        privateApiRef.current.setRowChildrenExpansion(id, true);
      } catch (error) {
        const e = error as Error;
        privateApiRef.current.unstable_dataSource.setChildrenFetchError(id, e);
        onError?.(e, fetchParams);
      } finally {
        privateApiRef.current.unstable_dataSource.setChildrenLoading(id, false);
        nestedDataManager.setRequestSettled(id);
      }
    },
    [nestedDataManager, onError, privateApiRef, props.treeData, props.unstable_dataSource?.getRows],
  );

  const setChildrenLoading = React.useCallback<GridDataSourceApiBase['setChildrenLoading']>(
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

  const setChildrenFetchError = React.useCallback<GridDataSourceApiBase['setChildrenFetchError']>(
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

  useGridApiMethod(privateApiRef, dataSourceApi, 'public');
  useGridApiMethod(privateApiRef, dataSourcePrivateApi, 'private');

  /*
   * EVENTS
   */
  useGridApiEventHandler(
    privateApiRef,
    'sortModelChange',
    runIfServerMode(props.sortingMode, fetchRows),
  );
  useGridApiEventHandler(
    privateApiRef,
    'filterModelChange',
    runIfServerMode(props.filterMode, fetchRows),
  );
  useGridApiEventHandler(
    privateApiRef,
    'paginationModelChange',
    runIfServerMode(props.paginationMode, fetchRows),
  );

  /*
   * EFFECTS
   */
  React.useEffect(() => {
    if (props.unstable_dataSource) {
      privateApiRef.current.unstable_dataSourceCache?.clear();
      privateApiRef.current.unstable_dataSource.fetchRows();
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
