import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import useLazyRef from '@mui/utils/useLazyRef';
import { unstable_debounce as debounce } from '@mui/utils';

import { GRID_ROOT_GROUP_ID } from '../rows/gridRowsUtils';
import { GridGetRowsResponse, GridDataSourceCache } from '../../../models/gridDataSource';
import { runIf } from '../../../utils/utils';
import { GridStrategyGroup } from '../../core/strategyProcessing';
import { useGridSelector } from '../../utils/useGridSelector';
import { gridPaginationModelSelector } from '../pagination/gridPaginationSelector';
import { gridGetRowsParamsSelector } from './gridDataSourceSelector';
import { CacheChunkManager, DataSourceRowsUpdateStrategy } from './utils';
import { GridDataSourceCacheDefault, type GridDataSourceCacheDefaultConfig } from './cache';

import type { GridDataSourceApi, GridDataSourceApiBase } from './models';
import type { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import type { GridStrategyProcessor } from '../../core/strategyProcessing';
import type { GridEventListener } from '../../../models/events';
import type { GridRowId } from '../../../models';

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
    | 'unstable_dataSource'
    | 'unstable_dataSourceCache'
    | 'unstable_onDataSourceError'
    | 'pageSizeOptions'
    | 'signature'
  >,
  options: {
    cacheOptions?: GridDataSourceCacheDefaultConfig;
    fetchRowChildren?: (parents: GridRowId[]) => void;
    clearDataSourceState?: () => void;
  } = {},
) => {
  const setStrategyAvailability = React.useCallback(() => {
    apiRef.current.setStrategyAvailability(
      GridStrategyGroup.DataSource,
      DataSourceRowsUpdateStrategy.Default,
      props.unstable_dataSource ? () => true : () => false,
    );
  }, [apiRef, props.unstable_dataSource]);

  const [defaultRowsUpdateStrategyActive, setDefaultRowsUpdateStrategyActive] =
    React.useState(false);

  const paginationModel = useGridSelector(apiRef, gridPaginationModelSelector);
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
    getCache(props.unstable_dataSourceCache, options.cacheOptions),
  );

  const fetchRows = React.useCallback<GridDataSourceApiBase['fetchRows']>(
    async (parentId, params) => {
      const getRows = props.unstable_dataSource?.getRows;
      if (!getRows) {
        return;
      }

      if (parentId && parentId !== GRID_ROOT_GROUP_ID && props.signature !== 'DataGrid') {
        options.fetchRowChildren?.([parentId]);
        return;
      }

      options.clearDataSourceState?.();

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
      cacheChunkManager,
      cache,
      apiRef,
      defaultRowsUpdateStrategyActive,
      props.unstable_dataSource?.getRows,
      onError,
      options,
      props.signature,
    ],
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
      apiRef.current.unstable_applyPipeProcessors(
        'processDataSourceRows',
        { params: params.fetchParams, response },
        true,
      );
    },
    [apiRef],
  );

  const dataSourceApi: GridDataSourceApi = {
    unstable_dataSource: {
      fetchRows,
      cache,
    },
  };

  const debouncedFetchRows = React.useMemo(() => debounce(fetchRows, 0), [fetchRows]);

  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (props.unstable_dataSourceCache === undefined) {
      return;
    }
    const newCache = getCache(props.unstable_dataSourceCache, options.cacheOptions);
    setCache((prevCache) => (prevCache !== newCache ? newCache : prevCache));
  }, [props.unstable_dataSourceCache, options.cacheOptions]);

  React.useEffect(() => {
    if (props.unstable_dataSource) {
      apiRef.current.unstable_dataSource.cache.clear();
      apiRef.current.unstable_dataSource.fetchRows();
    }
  }, [apiRef, props.unstable_dataSource]);

  return {
    api: { public: dataSourceApi },
    strategyProcessor: {
      strategyName: DataSourceRowsUpdateStrategy.Default,
      group: 'dataSourceRowsUpdate' as const,
      processor: handleDataUpdate,
    },
    setStrategyAvailability,
    cacheChunkManager,
    cache,
    events: {
      strategyAvailabilityChange: handleStrategyActivityChange,
      sortModelChange: runIf(defaultRowsUpdateStrategyActive, () => debouncedFetchRows()),
      filterModelChange: runIf(defaultRowsUpdateStrategyActive, () => debouncedFetchRows()),
      paginationModelChange: runIf(defaultRowsUpdateStrategyActive, () => debouncedFetchRows()),
    },
  };
};
