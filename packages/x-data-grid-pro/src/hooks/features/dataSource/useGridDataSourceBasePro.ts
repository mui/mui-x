'use client';
import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import useLazyRef from '@mui/utils/useLazyRef';
import {
  GridDataSourceGroupNode,
  useGridSelector,
  GridGetRowsError,
  gridRowIdSelector,
  gridRowNodeSelector,
  GridRowModelUpdate,
  GridRowModel,
  gridRowTreeSelector,
  GridUpdateRowParams,
  GridRowId,
  GRID_ROOT_GROUP_ID,
} from '@mui/x-data-grid';
import {
  gridRowGroupsToFetchSelector,
  useGridDataSourceBase,
  CacheChunkManager,
  gridGetRowsParamsSelector,
  DataSourceRowsUpdateStrategy,
  GridStrategyGroup,
  GridDataSourceBaseOptions,
  GridStrategyProcessor,
  getTreeNodeDescendants,
} from '@mui/x-data-grid/internals';
import { warnOnce } from '@mui/x-internals/warning';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { NestedDataManager, RequestStatus, getGroupKeys } from './utils';
import {
  GridDataSourceApiBasePro,
  GridDataSourceApiPro,
  GridDataSourcePrivateApiPro,
  GridGetRowsParamsPro,
  GridGetRowsResponsePro,
} from './models';
import { gridDataSourceErrorsSelector } from './gridDataSourceSelector';

export const INITIAL_STATE = {
  loading: {},
  errors: {},
};

export const useGridDataSourceBasePro = <Api extends GridPrivateApiPro>(
  apiRef: RefObject<Api>,
  props: DataGridProProcessedProps,
  options: GridDataSourceBaseOptions = {},
) => {
  const groupsToAutoFetch = useGridSelector(apiRef, gridRowGroupsToFetchSelector);
  const nestedDataManager = useLazyRef<NestedDataManager, void>(
    () => new NestedDataManager(apiRef),
  ).current;
  const scheduledGroups = React.useRef<number>(0);

  const clearDataSourceState = React.useCallback(() => {
    nestedDataManager.clear();
    scheduledGroups.current = 0;
    const dataSourceState = apiRef.current.state.dataSource;
    if (dataSourceState !== INITIAL_STATE) {
      apiRef.current.resetDataSourceState();
    }
    return null;
  }, [apiRef, nestedDataManager]);

  const handleEditRow = React.useCallback(
    (params: GridUpdateRowParams, updatedRow: GridRowModel) => {
      if (updatedRow && !isDeepEqual(updatedRow, params.previousRow)) {
        // Reset the outdated cache, only if the row is _actually_ updated
        apiRef.current.dataSource.cache.clear();
      }
      const groupKeys = getGroupKeys(gridRowTreeSelector(apiRef), params.rowId) as string[];
      apiRef.current.updateNestedRows([updatedRow], groupKeys);
    },
    [apiRef],
  );

  const {
    api,
    debouncedFetchRows,
    strategyProcessor: flatTreeStrategyProcessor,
    events,
    cacheChunkManager,
    cache,
  } = useGridDataSourceBase(apiRef, props, {
    fetchRowChildren: (parentId, fetchParams) => nestedDataManager.queue([parentId], [fetchParams]),
    clearDataSourceState,
    handleEditRow,
    ...options,
  });

  const setStrategyAvailability = React.useCallback(() => {
    const currentStrategy = props.treeData
      ? DataSourceRowsUpdateStrategy.GroupedData
      : DataSourceRowsUpdateStrategy.Default;

    const prevStrategy =
      currentStrategy === DataSourceRowsUpdateStrategy.GroupedData
        ? DataSourceRowsUpdateStrategy.Default
        : DataSourceRowsUpdateStrategy.GroupedData;

    apiRef.current.setStrategyAvailability(GridStrategyGroup.DataSource, prevStrategy, () => false);

    apiRef.current.setStrategyAvailability(
      GridStrategyGroup.DataSource,
      currentStrategy,
      props.dataSource && !props.lazyLoading ? () => true : () => false,
    );
  }, [apiRef, props.dataSource, props.lazyLoading, props.treeData]);

  const onDataSourceErrorProp = props.onDataSourceError;

  const fetchRowChildren = React.useCallback<GridDataSourcePrivateApiPro['fetchRowChildren']>(
    async (id, argParams) => {
      const pipedParams = apiRef.current.unstable_applyPipeProcessors(
        'getRowsParams',
        {},
      ) as Partial<GridGetRowsParamsPro & { groupFields: string[] }>;
      if (!props.treeData && (pipedParams.groupFields?.length ?? 0) === 0) {
        nestedDataManager.clearPendingRequest(id);
        return;
      }
      const getRows = props.dataSource?.getRows;
      if (!getRows) {
        nestedDataManager.clearPendingRequest(id);
        return;
      }

      const rowNode = apiRef.current.getRowNode<GridDataSourceGroupNode>(id);
      if (!rowNode) {
        nestedDataManager.clearPendingRequest(id);
        return;
      }

      const fetchParams = {
        ...gridGetRowsParamsSelector(apiRef),
        ...pipedParams,
        ...argParams,
        groupKeys: rowNode.path,
      };

      const cacheKeys = cacheChunkManager.getCacheKeys(fetchParams);
      const responses = cacheKeys.map((cacheKey) => cache.get(cacheKey));
      const cachedData = responses.some((response) => response === undefined)
        ? undefined
        : CacheChunkManager.mergeResponses(responses as GridGetRowsResponsePro[]);

      if (cachedData !== undefined) {
        nestedDataManager.setRequestSettled(id);
        apiRef.current.applyStrategyProcessor('dataSourceNestedRowsUpdate', {
          parentId: id,
          path: rowNode.path,
          response: cachedData,
          fetchParams,
        });
        apiRef.current.dataSource.setChildrenLoading(id, false);
        return;
      }

      const existingError = gridDataSourceErrorsSelector(apiRef)[id] ?? null;
      if (existingError) {
        apiRef.current.dataSource.setChildrenFetchError(id, null);
      }

      try {
        const getRowsResponse = await getRows(fetchParams);
        if (!gridRowNodeSelector(apiRef, id)) {
          // The row has been removed from the grid
          nestedDataManager.clearPendingRequest(id);
          return;
        }
        if (nestedDataManager.getRequestStatus(id) === RequestStatus.UNKNOWN) {
          apiRef.current.dataSource.setChildrenLoading(id, false);
          return;
        }
        nestedDataManager.setRequestSettled(id);

        const cacheResponses = cacheChunkManager.splitResponse(fetchParams, getRowsResponse);
        cacheResponses.forEach((response, key) => {
          cache.set(key, response);
        });

        apiRef.current.applyStrategyProcessor('dataSourceNestedRowsUpdate', {
          parentId: id,
          path: rowNode.path,
          response: getRowsResponse,
          fetchParams,
        });
      } catch (error) {
        const childrenFetchError = error as Error;
        apiRef.current.dataSource.setChildrenFetchError(id, childrenFetchError);
        apiRef.current.applyStrategyProcessor('dataSourceNestedRowsUpdate', {
          parentId: id,
          path: rowNode.path,
          error: childrenFetchError,
          fetchParams,
        });
        if (typeof onDataSourceErrorProp === 'function') {
          onDataSourceErrorProp(
            new GridGetRowsError({
              message: childrenFetchError.message,
              params: fetchParams,
              cause: childrenFetchError,
            }),
          );
        } else {
          warnOnce(
            [
              'MUI X: A call to `dataSource.getRows()` threw an error which was not handled because `onDataSourceError()` is missing.',
              'To handle the error pass a callback to the `onDataSourceError` prop, for example `<DataGrid onDataSourceError={(error) => ...} />`.',
              'For more detail, see https://mui.com/x/react-data-grid/server-side-data/#error-handling.',
            ],
            'error',
          );
        }
      } finally {
        apiRef.current.dataSource.setChildrenLoading(id, false);
        nestedDataManager.setRequestSettled(id);
      }
    },
    [
      nestedDataManager,
      cacheChunkManager,
      cache,
      onDataSourceErrorProp,
      apiRef,
      props.treeData,
      props.dataSource?.getRows,
    ],
  );

  const setChildrenLoading = React.useCallback<GridDataSourceApiBasePro['setChildrenLoading']>(
    (parentId, isLoading) => {
      apiRef.current.setState((state) => {
        if (!state.dataSource.loading[parentId] && isLoading === false) {
          return state;
        }
        const newLoadingState = { ...state.dataSource.loading };
        if (isLoading === false) {
          delete newLoadingState[parentId];
        } else {
          newLoadingState[parentId] = isLoading;
        }
        return {
          ...state,
          dataSource: {
            ...state.dataSource,
            loading: newLoadingState,
          },
        };
      });
    },
    [apiRef],
  );

  const setChildrenFetchError = React.useCallback<
    GridDataSourceApiBasePro['setChildrenFetchError']
  >(
    (parentId, error) => {
      apiRef.current.setState((state) => {
        const newErrorsState = { ...state.dataSource.errors };
        if (error === null && newErrorsState[parentId] !== undefined) {
          delete newErrorsState[parentId];
        } else {
          newErrorsState[parentId] = error;
        }
        return {
          ...state,
          dataSource: {
            ...state.dataSource,
            errors: newErrorsState,
          },
        };
      });
    },
    [apiRef],
  );

  const resetDataSourceState = React.useCallback<
    GridDataSourcePrivateApiPro['resetDataSourceState']
  >(() => {
    apiRef.current.setState((state) => {
      return {
        ...state,
        dataSource: INITIAL_STATE,
      };
    });
  }, [apiRef]);

  const removeChildrenRows = React.useCallback<GridDataSourcePrivateApiPro['removeChildrenRows']>(
    (parentId) => {
      const rowNode = gridRowNodeSelector(apiRef, parentId);
      if (!rowNode || rowNode.type !== 'group' || rowNode.children.length === 0) {
        return;
      }

      const removedRows: { id: GridRowId; _action: 'delete' }[] = [];
      const traverse = (nodeId: GridRowId) => {
        const node = gridRowNodeSelector(apiRef, nodeId);
        if (!node) {
          return;
        }

        if (node.type === 'group' && node.children.length > 0) {
          node.children.forEach(traverse);
        }
        removedRows.push({ id: nodeId, _action: 'delete' });
      };

      rowNode.children.forEach(traverse);

      if (removedRows.length > 0) {
        apiRef.current.updateNestedRows(removedRows, (rowNode as GridDataSourceGroupNode).path);
      }
    },
    [apiRef],
  );

  const handleGroupedDataUpdate = React.useCallback<
    GridStrategyProcessor<'dataSourceRootRowsUpdate'>
  >(
    (params) => {
      if ('error' in params) {
        apiRef.current.setRows([]);
        return;
      }

      const {
        response,
        options: { keepChildrenExpanded },
      } = params;
      if (response.rowCount !== undefined) {
        apiRef.current.setRowCount(response.rowCount);
      }

      if (keepChildrenExpanded === false) {
        apiRef.current.setRows(response.rows);
      } else {
        const tree = gridRowTreeSelector(apiRef);
        // Remove existing outdated rows before setting the new ones
        // Create a set of the current root rows
        const parentRowsToDelete = new Set(
          getTreeNodeDescendants(tree, GRID_ROOT_GROUP_ID, false, true),
        );
        // Remove from the list the rows that are again in the response
        response.rows.forEach((row) => {
          parentRowsToDelete.delete(gridRowIdSelector(apiRef, row));
        });
        const rowsToDelete: { id: GridRowId; _action: 'delete' }[] = [];
        if (parentRowsToDelete.size > 0) {
          parentRowsToDelete.forEach((parentRowId) => {
            const descendants = getTreeNodeDescendants(tree, parentRowId, false, false);
            for (let i = descendants.length - 1; i >= 0; i -= 1) {
              // delete deepest descendants first
              rowsToDelete.push({ id: descendants[i], _action: 'delete' });
            }
            rowsToDelete.push({ id: parentRowId, _action: 'delete' });
          });
        }
        apiRef.current.updateRows(response.rows.concat(rowsToDelete));
      }

      apiRef.current.unstable_applyPipeProcessors(
        'processDataSourceRows',
        { params: params.fetchParams, response },
        true,
      );
    },
    [apiRef],
  );

  const handleNestedDataUpdate = React.useCallback<
    GridStrategyProcessor<'dataSourceNestedRowsUpdate'>
  >(
    (params) => {
      if ('error' in params) {
        // Error is handled in fetchRowChildren (setChildrenFetchError)
        return;
      }

      const { parentId, path, response } = params;

      // Update row count if provided
      if (response.rowCount !== undefined) {
        apiRef.current.setRowCount(response.rowCount);
      }

      // Remove existing outdated rows before setting the new ones
      const rowsToDelete: GridRowModelUpdate[] = [];
      response.rows.forEach((row) => {
        const rowId = gridRowIdSelector(apiRef, row);
        const treeNode = gridRowNodeSelector(apiRef, rowId);
        if (treeNode) {
          rowsToDelete.push({ id: rowId, _action: 'delete' });
        }
      });

      if (rowsToDelete.length > 0) {
        apiRef.current.updateNestedRows(rowsToDelete, path);
      }
      apiRef.current.updateNestedRows(response.rows, path);

      // Expand the parent after children are loaded
      apiRef.current.setRowChildrenExpansion(parentId, true);
    },
    [apiRef],
  );

  const dataSourceApi: GridDataSourceApiPro = {
    dataSource: {
      ...api.public.dataSource,
      setChildrenLoading,
      setChildrenFetchError,
    },
  };

  const dataSourcePrivateApi: GridDataSourcePrivateApiPro = {
    fetchRowChildren,
    resetDataSourceState,
    removeChildrenRows,
  };

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

  return {
    api: { public: dataSourceApi, private: dataSourcePrivateApi },
    debouncedFetchRows,
    flatTreeStrategyProcessor,
    groupedDataStrategyProcessor: {
      strategyName: DataSourceRowsUpdateStrategy.GroupedData,
      group: 'dataSourceRootRowsUpdate' as const,
      processor: handleGroupedDataUpdate,
    },
    nestedDataStrategyProcessor: {
      strategyName: DataSourceRowsUpdateStrategy.GroupedData,
      group: 'dataSourceNestedRowsUpdate' as const,
      processor: handleNestedDataUpdate,
    },
    events,
    setStrategyAvailability,
    cacheChunkManager,
    cache,
  };
};
