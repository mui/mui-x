import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import {
  useGridApiEventHandler,
  useGridApiMethod,
  GridDataSourceGroupNode,
  useGridSelector,
  gridPaginationModelSelector,
  GRID_ROOT_GROUP_ID,
  GridEventListener,
} from '@mui/x-data-grid';
import {
  GridGetRowsResponse,
  gridRowGroupsToFetchSelector,
  GridStateInitializer,
  GridStrategyGroup,
  GridStrategyProcessor,
  useGridRegisterStrategyProcessor,
} from '@mui/x-data-grid/internals';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { gridGetRowsParamsSelector, gridDataSourceErrorsSelector } from './gridDataSourceSelector';
import { GridDataSourceApi, GridDataSourceApiBase, GridDataSourcePrivateApi } from './interfaces';
import {
  CacheChunkManager,
  DataSourceRowsUpdateStrategy,
  NestedDataManager,
  RequestStatus,
  runIf,
} from './utils';
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
    | 'unstable_lazyLoading'
  >,
) => {
  const setStrategyAvailability = React.useCallback(() => {
    apiRef.current.setStrategyAvailability(
      GridStrategyGroup.DataSource,
      DataSourceRowsUpdateStrategy.Default,
      props.unstable_dataSource && !props.unstable_lazyLoading ? () => true : () => false,
    );
  }, [apiRef, props.unstable_lazyLoading, props.unstable_dataSource]);

  const [defaultRowsUpdateStrategyActive, setDefaultRowsUpdateStrategyActive] =
    React.useState(false);
  const nestedDataManager = useLazyRef<NestedDataManager, void>(
    () => new NestedDataManager(apiRef),
  ).current;
  const paginationModel = useGridSelector(apiRef, gridPaginationModelSelector);
  const groupsToAutoFetch = useGridSelector(apiRef, gridRowGroupsToFetchSelector);
  const scheduledGroups = React.useRef<number>(0);
  const lastRequestId = React.useRef<number>(0);

  const onError = props.unstable_onDataSourceError;

  const cacheChunkManager = useLazyRef<CacheChunkManager, void>(() => {
    const sortedPageSizeOptions = props.pageSizeOptions
      .map((option) => (typeof option === 'number' ? option : option.value))
      .sort((a, b) => a - b);
    const cacheChunkSize = Math.min(paginationModel.pageSize, sortedPageSizeOptions[0]);

    return new CacheChunkManager(cacheChunkSize);
  }).current;
  const [cache, setCache] = React.useState<GridDataSourceCache>(() =>
    getCache(props.unstable_dataSourceCache),
  );

  const fetchRows = React.useCallback<GridDataSourceApiBase['fetchRows']>(
    async (parentId, params) => {
      const getRows = props.unstable_dataSource?.getRows;
      if (!getRows) {
        return;
      }

      if (parentId && parentId !== GRID_ROOT_GROUP_ID) {
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
        ...params,
      };

      const cacheKeys = cacheChunkManager.getCacheKeys(fetchParams);
      const responses = cacheKeys.map((cacheKey) => cache.get(cacheKey));

      if (responses.every((response) => response !== undefined)) {
        apiRef.current.applyStrategyProcessor('dataSourceRowsUpdate', {
          response: CacheChunkManager.mergeResponses(responses as GridGetRowsResponse[]),
          fetchParams,
        });
        return;
      }

      // Manage loading state only for the default strategy
      if (defaultRowsUpdateStrategyActive || apiRef.current.getRowsCount() === 0) {
        apiRef.current.setLoading(true);
      }

      const requestId = lastRequestId.current + 1;
      lastRequestId.current = requestId;

      try {
        const getRowsResponse = await getRows(fetchParams);

        const cacheResponses = cacheChunkManager.splitResponse(fetchParams, getRowsResponse);
        cacheResponses.forEach((response, key) => {
          cache.set(key, response);
        });

        if (lastRequestId.current === requestId) {
          apiRef.current.applyStrategyProcessor('dataSourceRowsUpdate', {
            response: getRowsResponse,
            fetchParams,
          });
        }
      } catch (error) {
        if (lastRequestId.current === requestId) {
          apiRef.current.applyStrategyProcessor('dataSourceRowsUpdate', {
            error: error as Error,
            fetchParams,
          });
          onError?.(error as Error, fetchParams);
        }
      } finally {
        if (defaultRowsUpdateStrategyActive && lastRequestId.current === requestId) {
          apiRef.current.setLoading(false);
        }
      }
    },
    [
      nestedDataManager,
      cacheChunkManager,
      cache,
      apiRef,
      defaultRowsUpdateStrategyActive,
      props.unstable_dataSource?.getRows,
      onError,
    ],
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

      const cacheKeys = cacheChunkManager.getCacheKeys(fetchParams);
      const responses = cacheKeys.map((cacheKey) => cache.get(cacheKey));
      const cachedData = responses.some((response) => response === undefined)
        ? undefined
        : CacheChunkManager.mergeResponses(responses as GridGetRowsResponse[]);

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
        apiRef.current.unstable_dataSource.setChildrenFetchError(id, childrenFetchError);
        onError?.(childrenFetchError, fetchParams);
      } finally {
        apiRef.current.unstable_dataSource.setChildrenLoading(id, false);
        nestedDataManager.setRequestSettled(id);
      }
    },
    [
      nestedDataManager,
      cacheChunkManager,
      cache,
      onError,
      apiRef,
      props.treeData,
      props.unstable_dataSource?.getRows,
    ],
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

  const handleStrategyActivityChange = React.useCallback<
    GridEventListener<'strategyAvailabilityChange'>
  >(() => {
    setDefaultRowsUpdateStrategyActive(
      apiRef.current.getActiveStrategy(GridStrategyGroup.DataSource) ===
        DataSourceRowsUpdateStrategy.Default,
    );
  }, [apiRef]);

  const handleDataUpdate = React.useCallback<GridStrategyProcessor<'dataSourceRowsUpdate'>>(
    (params) => {
      if ('error' in params) {
        apiRef.current.setRows([]);
        return;
      }

      const { response } = params;
      if (response.rowCount !== undefined) {
        apiRef.current.setRowCount(response.rowCount);
      }
      apiRef.current.setRows(response.rows);
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

  useGridRegisterStrategyProcessor(
    apiRef,
    DataSourceRowsUpdateStrategy.Default,
    'dataSourceRowsUpdate',
    handleDataUpdate,
  );

  useGridApiEventHandler(apiRef, 'strategyAvailabilityChange', handleStrategyActivityChange);
  useGridApiEventHandler(
    apiRef,
    'sortModelChange',
    runIf(defaultRowsUpdateStrategyActive, () => fetchRows()),
  );
  useGridApiEventHandler(
    apiRef,
    'filterModelChange',
    runIf(defaultRowsUpdateStrategyActive, () => fetchRows()),
  );
  useGridApiEventHandler(
    apiRef,
    'paginationModelChange',
    runIf(defaultRowsUpdateStrategyActive, () => fetchRows()),
  );

  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const newCache = getCache(props.unstable_dataSourceCache);
    setCache((prevCache) => (prevCache !== newCache ? newCache : prevCache));
  }, [props.unstable_dataSourceCache]);

  React.useEffect(() => {
    setStrategyAvailability();
  }, [setStrategyAvailability]);

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
