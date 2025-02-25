import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import useLazyRef from '@mui/utils/useLazyRef';
import {
  GridDataSourceGroupNode,
  GridRowId,
  useGridSelector,
  GridDataSourceCacheDefaultConfig,
  GridGetRowsError,
} from '@mui/x-data-grid';
import {
  gridRowGroupsToFetchSelector,
  useGridDataSourceBase,
  CacheChunkManager,
  gridGetRowsParamsSelector,
  DataSourceRowsUpdateStrategy,
  GridStrategyGroup,
} from '@mui/x-data-grid/internals';
import { warnOnce } from '@mui/x-internals/warning';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { NestedDataManager, RequestStatus } from './utils';
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
  options: {
    cacheOptions?: GridDataSourceCacheDefaultConfig;
    fetchRowChildren?: (parentId: GridRowId) => void;
  } = {},
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

  const { api, strategyProcessor, events, cacheChunkManager, cache } = useGridDataSourceBase(
    apiRef,
    props,
    { ...options, fetchRowChildren: nestedDataManager.queue, clearDataSourceState },
  );

  const setStrategyAvailability = React.useCallback(() => {
    apiRef.current.setStrategyAvailability(
      GridStrategyGroup.DataSource,
      DataSourceRowsUpdateStrategy.Default,
      props.dataSource && !props.lazyLoading ? () => true : () => false,
    );
  }, [apiRef, props.dataSource, props.lazyLoading]);

  const onDataSourceErrorProp = props.onDataSourceError;

  const fetchRowChildren = React.useCallback<GridDataSourcePrivateApiPro['fetchRowChildren']>(
    async (id) => {
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
        groupKeys: rowNode.path,
      };

      const cacheKeys = cacheChunkManager.getCacheKeys(fetchParams);
      const responses = cacheKeys.map((cacheKey) => cache.get(cacheKey));
      const cachedData = responses.some((response) => response === undefined)
        ? undefined
        : CacheChunkManager.mergeResponses(responses as GridGetRowsResponsePro[]);

      if (cachedData !== undefined) {
        const rows = cachedData.rows;
        nestedDataManager.setRequestSettled(id);
        apiRef.current.updateServerRows(rows, rowNode.path);
        apiRef.current.setRowCount(cachedData.rowCount === undefined ? -1 : cachedData.rowCount);
        apiRef.current.setRowChildrenExpansion(id, true);
        apiRef.current.dataSource.setChildrenLoading(id, false);
        return;
      }

      const existingError = gridDataSourceErrorsSelector(apiRef)[id] ?? null;
      if (existingError) {
        apiRef.current.dataSource.setChildrenFetchError(id, null);
      }

      try {
        const getRowsResponse = await getRows(fetchParams);
        if (!apiRef.current.getRowNode(id)) {
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

        apiRef.current.setRowCount(
          getRowsResponse.rowCount === undefined ? -1 : getRowsResponse.rowCount,
        );
        apiRef.current.updateServerRows(getRowsResponse.rows, rowNode.path);
        apiRef.current.setRowChildrenExpansion(id, true);
      } catch (error) {
        const childrenFetchError = error as Error;
        apiRef.current.dataSource.setChildrenFetchError(id, childrenFetchError);
        if (typeof onDataSourceErrorProp === 'function') {
          onDataSourceErrorProp(
            new GridGetRowsError({
              message: childrenFetchError.message,
              params: fetchParams,
              cause: childrenFetchError,
            }),
          );
        } else if (process.env.NODE_ENV !== 'production') {
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

  const dataSourceApi: GridDataSourceApiPro = {
    dataSource: {
      ...api.public.dataSource,
      setChildrenLoading,
      setChildrenFetchError,
    },
  };

  const dataSourcePrivateApi: GridDataSourcePrivateApiPro = {
    ...api.private,
    fetchRowChildren,
    resetDataSourceState,
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
    strategyProcessor,
    events,
    setStrategyAvailability,
    cacheChunkManager,
    cache,
  };
};
