import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import {
  useGridApiEventHandler,
  gridRowsLoadingSelector,
  useGridApiMethod,
  GridDataSourceGroupNode,
  useGridSelector,
  GridRowId,
  gridPaginationModelSelector,
  gridFilteredSortedRowIdsSelector,
} from '@mui/x-data-grid';
import {
  GridGetRowsParams,
  gridRowGroupsToFetchSelector,
  GridStateInitializer,
} from '@mui/x-data-grid/internals';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { gridGetRowsParamsSelector, gridDataSourceErrorsSelector } from './gridDataSourceSelector';
import {
  FetchRowsOptions,
  GridDataSourceApi,
  GridDataSourceApiBase,
  GridDataSourcePrivateApi,
} from './interfaces';
import { NestedDataManager, RequestStatus, runIf } from './utils';
import { GridDataSourceCache } from '../../../models';
import { GridDataSourceCacheDefault, GridDataSourceCacheDefaultConfig } from './cache';

const INITIAL_STATE = {
  loading: {},
  errors: {},
};

const noopCache: GridDataSourceCache = {
  clear: () => {},
  get: () => undefined,
  set: () => {},
};

function getCache(
  cacheProp?: GridDataSourceCache | null,
  options: GridDataSourceCacheDefaultConfig = {},
) {
  if (cacheProp === null) {
    return noopCache;
  }
  return cacheProp ?? new GridDataSourceCacheDefault(options);
}

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
    | 'unstable_dataSourceCache'
    | 'unstable_onDataSourceError'
    | 'sortingMode'
    | 'filterMode'
    | 'paginationMode'
    | 'pageSizeOptions'
    | 'treeData'
    | 'lazyLoading'
  >,
) => {
  const nestedDataManager = useLazyRef<NestedDataManager, void>(
    () => new NestedDataManager(apiRef),
  ).current;
  const paginationModel = useGridSelector(apiRef, gridPaginationModelSelector);
  const groupsToAutoFetch = useGridSelector(apiRef, gridRowGroupsToFetchSelector);
  const filteredSortedRowIds = useGridSelector(apiRef, gridFilteredSortedRowIdsSelector);
  const scheduledGroups = React.useRef<number>(0);

  const isLazyLoaded = !!props.unstable_dataSource && props.lazyLoading;
  const onError = props.unstable_onDataSourceError;

  const cacheChunkSize = React.useMemo(() => {
    const sortedPageSizeOptions = props.pageSizeOptions
      .map((option) => (typeof option === 'number' ? option : option.value))
      .sort((a, b) => a - b);

    return Math.min(paginationModel.pageSize, sortedPageSizeOptions[0]);
  }, [paginationModel.pageSize, props.pageSizeOptions]);

  const [cache, setCache] = React.useState<GridDataSourceCache>(() =>
    getCache(props.unstable_dataSourceCache, {
      chunkSize: cacheChunkSize,
    }),
  );

  // Adjust the render context range to fit the pagination model's page size
  // First row index should be decreased to the start of the page, end row index should be increased to the end of the page
  const adjustRowParams = React.useCallback(
    (params: Pick<GridGetRowsParams, 'start' | 'end'>) => {
      if (typeof params.start !== 'number') {
        return params;
      }

      return {
        start: params.start - (params.start % paginationModel.pageSize),
        end: params.end + paginationModel.pageSize - (params.end % paginationModel.pageSize) - 1,
      };
    },
    [paginationModel],
  );

  const fetchRows = React.useCallback(
    async (options?: GridRowId | FetchRowsOptions) => {
      const getRows = props.unstable_dataSource?.getRows;
      if (!getRows) {
        return;
      }

      const hasDeprecatedArgument = typeof options === 'string' || typeof options === 'number';
      if (hasDeprecatedArgument) {
        console.warn(
          '`fetchRows` argument should be an options object (`FetchRowsOptions`). `GridRowId` argument is deprecated.',
        );
      }

      const parentId = hasDeprecatedArgument || !options ? options : options.parentId;
      const fetchParamsOverride =
        hasDeprecatedArgument || options?.start === undefined || options?.end === undefined
          ? {}
          : { start: options.start, end: options.end };

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

      const fetchParams = {
        ...gridGetRowsParamsSelector(apiRef),
        ...apiRef.current.unstable_applyPipeProcessors('getRowsParams', {}),
        ...fetchParamsOverride,
      };
      const startingIndex =
        typeof fetchParams.start === 'string'
          ? Math.max(filteredSortedRowIds.indexOf(fetchParams.start), 0)
          : fetchParams.start;
      const cachedData = apiRef.current.unstable_dataSource.cache.get(fetchParams);

      if (cachedData !== undefined) {
        const rows = cachedData.rows;
        apiRef.current.setRowCount(cachedData.rowCount === undefined ? -1 : cachedData.rowCount);
        if (isLazyLoaded) {
          apiRef.current.unstable_replaceRows(startingIndex, rows);
        } else {
          apiRef.current.setRows(rows);
        }
        apiRef.current.publishEvent('rowsFetched');
        return;
      }

      // with lazy loading, only the initial load should show the loading overlay
      const useLoadingIndicator = !isLazyLoaded || apiRef.current.getRowsCount() === 0;
      const isLoading = gridRowsLoadingSelector(apiRef);
      if (!isLoading && useLoadingIndicator) {
        apiRef.current.setLoading(true);
      }

      try {
        const getRowsResponse = await getRows(fetchParams);
        apiRef.current.unstable_dataSource.cache.set(fetchParams, getRowsResponse);
        apiRef.current.setRowCount(
          getRowsResponse.rowCount === undefined ? -1 : getRowsResponse.rowCount,
        );
        if (isLazyLoaded) {
          apiRef.current.unstable_replaceRows(startingIndex, getRowsResponse.rows);
        } else {
          apiRef.current.setRows(getRowsResponse.rows);
        }
        apiRef.current.setLoading(false);
        apiRef.current.publishEvent('rowsFetched');
      } catch (error) {
        if (!isLazyLoaded) {
          apiRef.current.setRows([]);
        }
        apiRef.current.setLoading(false);
        onError?.(error as Error, fetchParams);
      }
    },
    [
      nestedDataManager,
      apiRef,
      props.unstable_dataSource?.getRows,
      isLazyLoaded,
      filteredSortedRowIds,
      onError,
    ],
  );

  const fetchRowBatch = React.useCallback(
    (fetchParams: GridGetRowsParams) => {
      return fetchRows(adjustRowParams(fetchParams));
    },
    [adjustRowParams, fetchRows],
  );

  const fetchRowChildren = React.useCallback<GridDataSourcePrivateApi['fetchRowChildren']>(
    async (id) => {
      const pipedParams = apiRef.current.unstable_applyPipeProcessors('getRowsParams', {});
      if (!props.treeData && (pipedParams.groupFields?.length ?? 0) === 0) {
        nestedDataManager.clearPendingRequest(id);
        return;
      }
      const getRows = props.unstable_dataSource?.getRows;
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

      const cachedData = apiRef.current.unstable_dataSource.cache.get(fetchParams);

      if (cachedData !== undefined) {
        const rows = cachedData.rows;
        nestedDataManager.setRequestSettled(id);
        apiRef.current.updateServerRows(rows, rowNode.path);
        apiRef.current.setRowCount(cachedData.rowCount === undefined ? -1 : cachedData.rowCount);
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
        apiRef.current.unstable_dataSource.cache.set(fetchParams, getRowsResponse);
        apiRef.current.setRowCount(
          getRowsResponse.rowCount === undefined ? -1 : getRowsResponse.rowCount,
        );
        apiRef.current.updateServerRows(getRowsResponse.rows, rowNode.path);
        apiRef.current.setRowChildrenExpansion(id, true);
      } catch (error) {
        const childrenFetchError = error as Error;
        apiRef.current.unstable_dataSource.setChildrenFetchError(id, childrenFetchError);
        onError?.(childrenFetchError, fetchParams);
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

  const setChildrenFetchError = React.useCallback<GridDataSourceApiBase['setChildrenFetchError']>(
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
      cache,
    },
  };

  const dataSourcePrivateApi: GridDataSourcePrivateApi = {
    fetchRowChildren,
    resetDataSourceState,
  };

  useGridApiMethod(apiRef, dataSourceApi, 'public');
  useGridApiMethod(apiRef, dataSourcePrivateApi, 'private');

  useGridApiEventHandler(
    apiRef,
    'sortModelChange',
    runIf(props.sortingMode === 'server' && !isLazyLoaded, fetchRows),
  );
  useGridApiEventHandler(
    apiRef,
    'filterModelChange',
    runIf(props.filterMode === 'server' && !isLazyLoaded, fetchRows),
  );
  useGridApiEventHandler(
    apiRef,
    'paginationModelChange',
    runIf(props.paginationMode === 'server' && !isLazyLoaded, fetchRows),
  );
  useGridApiEventHandler(apiRef, 'getRows', runIf(isLazyLoaded, fetchRowBatch));

  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const newCache = getCache(props.unstable_dataSourceCache, {
      chunkSize: cacheChunkSize,
    });
    setCache((prevCache) => (prevCache !== newCache ? newCache : prevCache));
  }, [props.unstable_dataSourceCache, cacheChunkSize]);

  React.useEffect(() => {
    if (props.unstable_dataSource) {
      apiRef.current.unstable_dataSource.cache.clear();
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
