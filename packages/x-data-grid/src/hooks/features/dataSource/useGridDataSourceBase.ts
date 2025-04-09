import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import useLazyRef from '@mui/utils/useLazyRef';
import { unstable_debounce as debounce } from '@mui/utils';
import { warnOnce } from '@mui/x-internals/warning';
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import { GRID_ROOT_GROUP_ID } from '../rows/gridRowsUtils';
import { GridGetRowsResponse, GridDataSourceCache } from '../../../models/gridDataSource';
import { runIf } from '../../../utils/utils';
import { GridStrategyGroup } from '../../core/strategyProcessing';
import { useGridSelector } from '../../utils/useGridSelector';
import { gridPaginationModelSelector } from '../pagination/gridPaginationSelector';
import { gridGetRowsParamsSelector } from './gridDataSourceSelector';
import { CacheChunkManager, DataSourceRowsUpdateStrategy } from './utils';
import { GridDataSourceCacheDefault, type GridDataSourceCacheDefaultConfig } from './cache';
import { GridGetRowsError, GridUpdateRowError } from './gridDataSourceError';

import type { GridDataSourceApi, GridDataSourceApiBase, GridDataSourceBaseOptions } from './models';
import type { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import type { GridStrategyProcessor } from '../../core/strategyProcessing';
import type { GridEventListener } from '../../../models/events';

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
    'dataSource' | 'dataSourceCache' | 'onDataSourceError' | 'pageSizeOptions' | 'signature'
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

  const [defaultRowsUpdateStrategyActive, setDefaultRowsUpdateStrategyActive] =
    React.useState(false);

  const paginationModel = useGridSelector(apiRef, gridPaginationModelSelector);
  const lastRequestId = React.useRef<number>(0);

  const onDataSourceErrorProp = props.onDataSourceError;

  const cacheChunkManager = useLazyRef<CacheChunkManager, void>(() => {
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
        cacheResponses.forEach((response, key) => cache.set(key, response));

        if (lastRequestId.current === requestId) {
          apiRef.current.applyStrategyProcessor('dataSourceRowsUpdate', {
            response: getRowsResponse,
            fetchParams,
          });
        }
      } catch (originalError) {
        if (lastRequestId.current === requestId) {
          apiRef.current.applyStrategyProcessor('dataSourceRowsUpdate', {
            error: originalError as Error,
            fetchParams,
          });
          if (typeof onDataSourceErrorProp === 'function') {
            onDataSourceErrorProp(
              new GridGetRowsError({
                message: (originalError as Error)?.message,
                params: fetchParams,
                cause: originalError as Error,
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
      props.dataSource?.getRows,
      onDataSourceErrorProp,
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

  const dataSourceUpdateRow = props.dataSource?.updateRow;
  const handleEditRowOption = options.handleEditRow;

  const editRow = React.useCallback<GridDataSourceApiBase['editRow']>(
    async (params, handleError) => {
      if (!dataSourceUpdateRow) {
        return undefined;
      }

      try {
        const finalRowUpdate = await dataSourceUpdateRow(params);
        if (typeof handleEditRowOption === 'function') {
          handleEditRowOption(params, finalRowUpdate);
          return finalRowUpdate;
        }
        apiRef.current.updateNestedRows([finalRowUpdate], []);
        if (finalRowUpdate && !isDeepEqual(finalRowUpdate, params.previousRow)) {
          // Reset the outdated cache, only if the row is _actually_ updated
          apiRef.current.dataSource.cache.clear();
        }
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
        } else if (process.env.NODE_ENV !== 'production') {
          warnOnce(
            [
              'MUI X: A call to `dataSource.updateRow()` threw an error which was not handled because `onDataSourceError()` is missing.',
              'To handle the error pass a callback to the `onDataSourceError` prop, for example `<DataGrid onDataSourceError={(error) => ...} />`.',
              'For more detail, see https://mui.com/x/react-data-grid/server-side-data/#error-handling.',
            ],
            'error',
          );
        }
        handleError();
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
    if (props.dataSource) {
      apiRef.current.dataSource.cache.clear();
      apiRef.current.dataSource.fetchRows();
    }
  }, [apiRef, props.dataSource]);

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
