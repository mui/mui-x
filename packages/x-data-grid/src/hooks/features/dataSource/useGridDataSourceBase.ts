'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import useLazyRef from '@mui/utils/useLazyRef';
import useEventCallback from '@mui/utils/useEventCallback';
import debounce from '@mui/utils/debounce';
import { warnOnce } from '@mui/x-internals/warning';
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import { GRID_ROOT_GROUP_ID } from '../rows/gridRowsUtils';
import type { GridGetRowsResponse, GridDataSourceCache } from '../../../models/gridDataSource';
import { runIf } from '../../../utils/utils';
import { GridStrategyGroup } from '../../core/strategyProcessing';
import { useGridSelector } from '../../utils/useGridSelector';
import {
  gridPaginationModelSelector,
  gridVisibleRowsSelector,
} from '../pagination/gridPaginationSelector';
import { gridRowTreeSelector } from '../rows/gridRowsSelector';
import { gridGetRowsParamsSelector } from './gridDataSourceSelector';
import { CacheChunkManager, DataSourceRowsUpdateStrategy } from './utils';
import { GridDataSourceCacheDefault, type GridDataSourceCacheDefaultConfig } from './cache';
import { GridGetRowsError, GridUpdateRowError } from './gridDataSourceError';

import type { GridDataSourceApi, GridDataSourceApiBase, GridDataSourceBaseOptions } from './models';
import type { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import type { GridStrategyProcessor } from '../../core/strategyProcessing';
import type { GridEventListener } from '../../../models/events';
import type { GridRowId } from '../../../models/gridRows';

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

export const useGridDataSourceBase = <Api extends GridPrivateApiCommunity>(
  apiRef: RefObject<Api>,
  props: Pick<
    DataGridProcessedProps,
    | 'dataSource'
    | 'dataSourceCache'
    | 'dataSourceKeepPreviousData'
    | 'onDataSourceError'
    | 'pageSizeOptions'
    | 'pagination'
    | 'signature'
    | 'dataSourceRevalidateMs'
  >,
  options: GridDataSourceBaseOptions = {},
) => {
  const setStrategyAvailability = React.useCallback(() => {
    apiRef.current.setStrategyAvailability(
      GridStrategyGroup.DataSource,
      DataSourceRowsUpdateStrategy.Default,
      props.dataSource ? () => true : () => false,
    );
  }, [apiRef, props.dataSource]);

  const [currentStrategy, setCurrentStrategy] = React.useState<DataSourceRowsUpdateStrategy>(
    apiRef.current.getActiveStrategy(GridStrategyGroup.DataSource) as DataSourceRowsUpdateStrategy,
  );

  const standardRowsUpdateStrategyActive = React.useMemo(() => {
    return (
      currentStrategy === DataSourceRowsUpdateStrategy.Default ||
      currentStrategy === DataSourceRowsUpdateStrategy.GroupedData
    );
  }, [currentStrategy]);

  const paginationModel = useGridSelector(apiRef, gridPaginationModelSelector);
  const lastRequestId = React.useRef<number>(0);
  const pollingIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const onDataSourceErrorProp = props.onDataSourceError;
  const revalidateMs = props.dataSourceRevalidateMs;

  const cacheChunkManager = useLazyRef<CacheChunkManager, void>(() => {
    if (!props.pagination) {
      return new CacheChunkManager(paginationModel.pageSize);
    }

    const sortedPageSizeOptions = props.pageSizeOptions
      .map((option) => (typeof option === 'number' ? option : option.value))
      .sort((a, b) => a - b);
    const cacheChunkSize = Math.min(paginationModel.pageSize, sortedPageSizeOptions[0]);

    return new CacheChunkManager(cacheChunkSize);
  }).current;
  const [cache, setCache] = React.useState<GridDataSourceCache>(() =>
    getCache(props.dataSourceCache, options.cacheOptions),
  );

  const fetchRows = React.useCallback<GridDataSourceApiBase['fetchRows']>(
    async (parentId, params) => {
      const getRows = props.dataSource?.getRows;
      if (!getRows) {
        return;
      }

      const { skipCache, keepChildrenExpanded, showChildrenLoading, ...getRowsParams } =
        params || {};

      const fetchParams = {
        ...gridGetRowsParamsSelector(apiRef),
        ...apiRef.current.unstable_applyPipeProcessors('getRowsParams', {}),
        ...getRowsParams,
      };

      if (parentId && parentId !== GRID_ROOT_GROUP_ID && props.signature !== 'DataGrid') {
        options.fetchRowChildren?.([parentId], [fetchParams], showChildrenLoading);
        return;
      }

      options.clearDataSourceState?.();

      const cacheKeys = cacheChunkManager.getCacheKeys(fetchParams);
      const responses = cacheKeys.map((cacheKey) => cache.get(cacheKey));

      if (!skipCache && responses.every((response) => response !== undefined)) {
        // Bump the request id so any cache-miss request still in flight is treated as
        // stale and won't override the cached data we're about to apply.
        lastRequestId.current += 1;
        apiRef.current.applyStrategyProcessor('dataSourceRootRowsUpdate', {
          response: CacheChunkManager.mergeResponses(responses as GridGetRowsResponse[]),
          fetchParams,
          options: { skipCache, keepChildrenExpanded },
        });
        if (standardRowsUpdateStrategyActive) {
          apiRef.current.setLoading(false);
        }
        return;
      }

      // Manage loading state only for the default strategy
      if (standardRowsUpdateStrategyActive || apiRef.current.getRowsCount() === 0) {
        apiRef.current.setLoading(true);
      }

      const requestId = lastRequestId.current + 1;
      lastRequestId.current = requestId;

      try {
        const getRowsResponse = await getRows(fetchParams);

        const cacheResponses = cacheChunkManager.splitResponse(fetchParams, getRowsResponse);
        cacheResponses.forEach((response, key) => cache.set(key, response));

        if (lastRequestId.current === requestId) {
          apiRef.current.applyStrategyProcessor('dataSourceRootRowsUpdate', {
            response: getRowsResponse,
            fetchParams,
            options: { skipCache, keepChildrenExpanded },
          });
        }
      } catch (originalError) {
        if (lastRequestId.current === requestId) {
          apiRef.current.applyStrategyProcessor('dataSourceRootRowsUpdate', {
            error: originalError as Error,
            fetchParams,
            options: { skipCache, keepChildrenExpanded },
          });
          if (typeof onDataSourceErrorProp === 'function') {
            onDataSourceErrorProp(
              new GridGetRowsError({
                message: (originalError as Error)?.message,
                params: fetchParams,
                cause: originalError as Error,
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
        }
      } finally {
        if (standardRowsUpdateStrategyActive && lastRequestId.current === requestId) {
          apiRef.current.setLoading(false);
        }
      }
    },
    [
      cacheChunkManager,
      cache,
      apiRef,
      standardRowsUpdateStrategyActive,
      props.dataSource?.getRows,
      onDataSourceErrorProp,
      options,
      props.signature,
    ],
  );

  const handleStrategyActivityChange = React.useCallback<
    GridEventListener<'strategyAvailabilityChange'>
  >(() => {
    setCurrentStrategy(
      apiRef.current.getActiveStrategy(
        GridStrategyGroup.DataSource,
      ) as DataSourceRowsUpdateStrategy,
    );
  }, [apiRef]);

  const fetchRowChildrenOption = options.fetchRowChildren;

  const revalidate = useEventCallback(async () => {
    const getRows = props.dataSource?.getRows;
    if (!getRows || !standardRowsUpdateStrategyActive) {
      return;
    }

    const revalidateExpandedGroups = () => {
      if (currentStrategy !== DataSourceRowsUpdateStrategy.GroupedData || !fetchRowChildrenOption) {
        return;
      }

      const rowTree = gridRowTreeSelector(apiRef);
      const visibleRows = gridVisibleRowsSelector(apiRef).rows;
      const expandedGroupIds = visibleRows.reduce((acc, row) => {
        const node = rowTree[row.id];
        if (
          node.type === 'group' &&
          node.id !== GRID_ROOT_GROUP_ID &&
          node.childrenExpanded === true
        ) {
          acc.push(row.id);
        }
        return acc;
      }, [] as GridRowId[]);

      if (expandedGroupIds.length > 0) {
        fetchRowChildrenOption(expandedGroupIds, [], false);
      }
    };

    const fetchParams = {
      ...gridGetRowsParamsSelector(apiRef),
      ...apiRef.current.unstable_applyPipeProcessors('getRowsParams', {}),
    };

    const cacheKeys = cacheChunkManager.getCacheKeys(fetchParams);
    const responses = cacheKeys.map((cacheKey) => cache.get(cacheKey));
    if (responses.every((response) => response !== undefined)) {
      revalidateExpandedGroups();
      return;
    }

    try {
      const response = await getRows(fetchParams);

      const currentParams = {
        ...gridGetRowsParamsSelector(apiRef),
        ...apiRef.current.unstable_applyPipeProcessors('getRowsParams', {}),
      };
      if (!isDeepEqual(fetchParams, currentParams)) {
        return;
      }

      const cacheResponses = cacheChunkManager.splitResponse(fetchParams, response);
      cacheResponses.forEach((cacheResponse, key) => cache.set(key, cacheResponse));

      apiRef.current.applyStrategyProcessor('dataSourceRootRowsUpdate', {
        response,
        fetchParams,
        options: {},
      });
      revalidateExpandedGroups();
    } catch {
      // Ignore background revalidation errors.
    }
  });

  const stopPolling = React.useCallback(() => {
    if (pollingIntervalRef.current !== null) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  const startPolling = useEventCallback(() => {
    stopPolling();
    if (revalidateMs <= 0 || !standardRowsUpdateStrategyActive) {
      return;
    }
    pollingIntervalRef.current = setInterval(revalidate, revalidateMs);
  });

  const handleDataUpdate = React.useCallback<GridStrategyProcessor<'dataSourceRootRowsUpdate'>>(
    (params) => {
      if ('error' in params) {
        // `handleDataUpdate` is the `Default` strategy processor, so honouring
        // `dataSourceKeepPreviousData` here doesn't affect tree-data / grouped strategies.
        if (!props.dataSourceKeepPreviousData) {
          apiRef.current.setRows([]);
        }
        return;
      }

      const { response } = params;
      if (response.rowCount !== undefined) {
        apiRef.current.setRowCount(response.rowCount);
      }
      apiRef.current.setRows(response.rows);
      apiRef.current.unstable_applyPipeProcessors(
        'processDataSourceRows',
        { params: params.fetchParams, response },
        true,
      );
      startPolling();
    },
    [apiRef, props.dataSourceKeepPreviousData, startPolling],
  );

  const dataSourceUpdateRow = props.dataSource?.updateRow;
  const handleEditRowOption = options.handleEditRow;

  const editRow = React.useCallback<GridDataSourceApiBase['editRow']>(
    async (params) => {
      if (!dataSourceUpdateRow) {
        return undefined;
      }

      try {
        const finalRowUpdate = await dataSourceUpdateRow(params);
        if (typeof handleEditRowOption === 'function') {
          handleEditRowOption(params, finalRowUpdate);
          return finalRowUpdate;
        }
        if (finalRowUpdate && !isDeepEqual(finalRowUpdate, params.previousRow)) {
          // Reset the outdated cache, only if the row is _actually_ updated
          apiRef.current.dataSource.cache.clear();
        }
        apiRef.current.updateNestedRows([finalRowUpdate], []);
        return finalRowUpdate;
      } catch (errorThrown) {
        if (typeof onDataSourceErrorProp === 'function') {
          onDataSourceErrorProp(
            new GridUpdateRowError({
              message: (errorThrown as Error)?.message,
              params,
              cause: errorThrown as Error,
            }),
          );
        } else {
          warnOnce(
            [
              'MUI X: A call to `dataSource.updateRow()` threw an error which was not handled because `onDataSourceError()` is missing.',
              'To handle the error pass a callback to the `onDataSourceError` prop, for example `<DataGrid onDataSourceError={(error) => ...} />`.',
              'For more detail, see https://mui.com/x/react-data-grid/server-side-data/#error-handling.',
            ],
            'error',
          );
        }
        throw errorThrown; // Let the caller handle the error further
      }
    },
    [apiRef, dataSourceUpdateRow, onDataSourceErrorProp, handleEditRowOption],
  );

  const dataSourceApi: GridDataSourceApi = {
    dataSource: {
      fetchRows,
      cache,
      editRow,
    },
  };

  const debouncedFetchRows = React.useMemo(() => debounce(fetchRows, 0), [fetchRows]);
  const handleFetchRowsOnParamsChange = React.useCallback(() => {
    // `dataSourceKeepPreviousData` only applies to the flat `Default` strategy. For
    // `GroupedData` (tree data / row grouping), skipping the synchronous `setRows([])`
    // would leave the existing tree merged on top of the new response and render rows
    // in stale sort order (https://github.com/mui/mui-x/pull/21619).
    // This handler is only wired up when a standard strategy is active via the `runIf`
    // guards on the returned `events` object.
    const activeStrategy = apiRef.current.getActiveStrategy(GridStrategyGroup.DataSource);
    const keepPreviousData =
      props.dataSourceKeepPreviousData && activeStrategy === DataSourceRowsUpdateStrategy.Default;
    if (!keepPreviousData) {
      // Clear the rows first and immediately mark the grid as loading so the overlay
      // selector never observes the intermediate `rows=[] && loading=false` state that
      // would otherwise pick `noRowsOverlay`. Order matters: `setRows([])` rebuilds
      // `state.rows` from `props.loading`, so the `setLoading(true)` call must come after
      // it to survive the rebuild.
      apiRef.current.setRows([]);
    }
    apiRef.current.setLoading(true);
    stopPolling();
    debouncedFetchRows();
  }, [apiRef, props.dataSourceKeepPreviousData, stopPolling, debouncedFetchRows]);

  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (props.dataSourceCache === undefined) {
      return;
    }
    const newCache = getCache(props.dataSourceCache, options.cacheOptions);
    setCache((prevCache) => (prevCache !== newCache ? newCache : prevCache));
  }, [props.dataSourceCache, options.cacheOptions]);

  React.useEffect(() => {
    if (!standardRowsUpdateStrategyActive) {
      stopPolling();
    }
  }, [standardRowsUpdateStrategyActive, stopPolling]);

  React.useEffect(() => {
    if (revalidateMs <= 0) {
      stopPolling();
    }
  }, [revalidateMs, stopPolling]);

  React.useEffect(() => stopPolling, [stopPolling]);

  React.useEffect(() => {
    // Return early if the proper strategy isn't set yet
    // Context: https://github.com/mui/mui-x/issues/19650
    if (
      currentStrategy !== DataSourceRowsUpdateStrategy.Default &&
      currentStrategy !== DataSourceRowsUpdateStrategy.LazyLoading &&
      currentStrategy !== DataSourceRowsUpdateStrategy.GroupedData &&
      currentStrategy !== DataSourceRowsUpdateStrategy.LazyLoadedGroupedData
    ) {
      return undefined;
    }
    if (props.dataSource) {
      stopPolling();
      apiRef.current.setRows([]);
      apiRef.current.dataSource.cache.clear();
      apiRef.current.dataSource.fetchRows();
    }

    return () => {
      // ignore the current request on unmount
      lastRequestId.current += 1;
    };
  }, [apiRef, props.dataSource, currentStrategy, stopPolling]);

  return {
    api: { public: dataSourceApi },
    debouncedFetchRows,
    strategyProcessor: {
      strategyName: DataSourceRowsUpdateStrategy.Default,
      group: 'dataSourceRootRowsUpdate' as const,
      processor: handleDataUpdate,
    },
    setStrategyAvailability,
    startPolling,
    stopPolling,
    cacheChunkManager,
    cache,
    events: {
      strategyAvailabilityChange: handleStrategyActivityChange,
      sortModelChange: runIf(standardRowsUpdateStrategyActive, handleFetchRowsOnParamsChange),
      filterModelChange: runIf(standardRowsUpdateStrategyActive, handleFetchRowsOnParamsChange),
      paginationModelChange: runIf(standardRowsUpdateStrategyActive, handleFetchRowsOnParamsChange),
    },
  };
};
