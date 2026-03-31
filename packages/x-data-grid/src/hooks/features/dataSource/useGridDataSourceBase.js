'use client';
import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import useEventCallback from '@mui/utils/useEventCallback';
import debounce from '@mui/utils/debounce';
import { warnOnce } from '@mui/x-internals/warning';
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import { GRID_ROOT_GROUP_ID } from '../rows/gridRowsUtils';
import { runIf } from '../../../utils/utils';
import { GridStrategyGroup } from '../../core/strategyProcessing';
import { useGridSelector } from '../../utils/useGridSelector';
import { gridPaginationModelSelector, gridVisibleRowsSelector, } from '../pagination/gridPaginationSelector';
import { gridRowTreeSelector } from '../rows/gridRowsSelector';
import { gridGetRowsParamsSelector } from './gridDataSourceSelector';
import { CacheChunkManager, DataSourceRowsUpdateStrategy } from './utils';
import { GridDataSourceCacheDefault } from './cache';
import { GridGetRowsError, GridUpdateRowError } from './gridDataSourceError';
const noopCache = {
    clear: () => { },
    get: () => undefined,
    set: () => { },
};
function getCache(cacheProp, options = {}) {
    if (cacheProp === null) {
        return noopCache;
    }
    return cacheProp ?? new GridDataSourceCacheDefault(options);
}
export const useGridDataSourceBase = (apiRef, props, options = {}) => {
    const setStrategyAvailability = React.useCallback(() => {
        apiRef.current.setStrategyAvailability(GridStrategyGroup.DataSource, DataSourceRowsUpdateStrategy.Default, props.dataSource ? () => true : () => false);
    }, [apiRef, props.dataSource]);
    const [currentStrategy, setCurrentStrategy] = React.useState(apiRef.current.getActiveStrategy(GridStrategyGroup.DataSource));
    const standardRowsUpdateStrategyActive = React.useMemo(() => {
        return (currentStrategy === DataSourceRowsUpdateStrategy.Default ||
            currentStrategy === DataSourceRowsUpdateStrategy.GroupedData);
    }, [currentStrategy]);
    const paginationModel = useGridSelector(apiRef, gridPaginationModelSelector);
    const lastRequestId = React.useRef(0);
    const pollingIntervalRef = React.useRef(null);
    const onDataSourceErrorProp = props.onDataSourceError;
    const revalidateMs = props.dataSourceRevalidateMs;
    const cacheChunkManager = useLazyRef(() => {
        if (!props.pagination) {
            return new CacheChunkManager(paginationModel.pageSize);
        }
        const sortedPageSizeOptions = props.pageSizeOptions
            .map((option) => (typeof option === 'number' ? option : option.value))
            .sort((a, b) => a - b);
        const cacheChunkSize = Math.min(paginationModel.pageSize, sortedPageSizeOptions[0]);
        return new CacheChunkManager(cacheChunkSize);
    }).current;
    const [cache, setCache] = React.useState(() => getCache(props.dataSourceCache, options.cacheOptions));
    const fetchRows = React.useCallback(async (parentId, params) => {
        const getRows = props.dataSource?.getRows;
        if (!getRows) {
            return;
        }
        if (parentId && parentId !== GRID_ROOT_GROUP_ID && props.signature !== 'DataGrid') {
            options.fetchRowChildren?.([parentId]);
            return;
        }
        options.clearDataSourceState?.();
        const { skipCache, keepChildrenExpanded, ...getRowsParams } = params || {};
        const fetchParams = {
            ...gridGetRowsParamsSelector(apiRef),
            ...apiRef.current.unstable_applyPipeProcessors('getRowsParams', {}),
            ...getRowsParams,
        };
        const cacheKeys = cacheChunkManager.getCacheKeys(fetchParams);
        const responses = cacheKeys.map((cacheKey) => cache.get(cacheKey));
        if (!skipCache && responses.every((response) => response !== undefined)) {
            apiRef.current.applyStrategyProcessor('dataSourceRowsUpdate', {
                response: CacheChunkManager.mergeResponses(responses),
                fetchParams,
                options: { skipCache, keepChildrenExpanded },
            });
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
                apiRef.current.applyStrategyProcessor('dataSourceRowsUpdate', {
                    response: getRowsResponse,
                    fetchParams,
                    options: { skipCache, keepChildrenExpanded },
                });
            }
        }
        catch (originalError) {
            if (lastRequestId.current === requestId) {
                apiRef.current.applyStrategyProcessor('dataSourceRowsUpdate', {
                    error: originalError,
                    fetchParams,
                    options: { skipCache, keepChildrenExpanded },
                });
                if (typeof onDataSourceErrorProp === 'function') {
                    onDataSourceErrorProp(new GridGetRowsError({
                        message: originalError?.message,
                        params: fetchParams,
                        cause: originalError,
                    }));
                }
                else {
                    warnOnce([
                        'MUI X: A call to `dataSource.getRows()` threw an error which was not handled because `onDataSourceError()` is missing.',
                        'To handle the error pass a callback to the `onDataSourceError` prop, for example `<DataGrid onDataSourceError={(error) => ...} />`.',
                        'For more detail, see https://mui.com/x/react-data-grid/server-side-data/#error-handling.',
                    ], 'error');
                }
            }
        }
        finally {
            if (standardRowsUpdateStrategyActive && lastRequestId.current === requestId) {
                apiRef.current.setLoading(false);
            }
        }
    }, [
        cacheChunkManager,
        cache,
        apiRef,
        standardRowsUpdateStrategyActive,
        props.dataSource?.getRows,
        onDataSourceErrorProp,
        options,
        props.signature,
    ]);
    const handleStrategyActivityChange = React.useCallback(() => {
        setCurrentStrategy(apiRef.current.getActiveStrategy(GridStrategyGroup.DataSource));
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
                if (node.type === 'group' &&
                    node.id !== GRID_ROOT_GROUP_ID &&
                    node.childrenExpanded === true) {
                    acc.push(row.id);
                }
                return acc;
            }, []);
            if (expandedGroupIds.length > 0) {
                fetchRowChildrenOption(expandedGroupIds, { showChildrenLoading: false });
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
            apiRef.current.applyStrategyProcessor('dataSourceRowsUpdate', {
                response,
                fetchParams,
                options: {},
            });
            revalidateExpandedGroups();
        }
        catch {
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
    const handleDataUpdate = React.useCallback((params) => {
        if ('error' in params) {
            apiRef.current.setRows([]);
            return;
        }
        const { response } = params;
        if (response.rowCount !== undefined) {
            apiRef.current.setRowCount(response.rowCount);
        }
        apiRef.current.setRows(response.rows);
        apiRef.current.unstable_applyPipeProcessors('processDataSourceRows', { params: params.fetchParams, response }, true);
        startPolling();
    }, [apiRef, startPolling]);
    const dataSourceUpdateRow = props.dataSource?.updateRow;
    const handleEditRowOption = options.handleEditRow;
    const editRow = React.useCallback(async (params) => {
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
        }
        catch (errorThrown) {
            if (typeof onDataSourceErrorProp === 'function') {
                onDataSourceErrorProp(new GridUpdateRowError({
                    message: errorThrown?.message,
                    params,
                    cause: errorThrown,
                }));
            }
            else {
                warnOnce([
                    'MUI X: A call to `dataSource.updateRow()` threw an error which was not handled because `onDataSourceError()` is missing.',
                    'To handle the error pass a callback to the `onDataSourceError` prop, for example `<DataGrid onDataSourceError={(error) => ...} />`.',
                    'For more detail, see https://mui.com/x/react-data-grid/server-side-data/#error-handling.',
                ], 'error');
            }
            throw errorThrown; // Let the caller handle the error further
        }
    }, [apiRef, dataSourceUpdateRow, onDataSourceErrorProp, handleEditRowOption]);
    const dataSourceApi = {
        dataSource: {
            fetchRows,
            cache,
            editRow,
        },
    };
    const debouncedFetchRows = React.useMemo(() => debounce(fetchRows, 0), [fetchRows]);
    const handleFetchRowsOnParamsChange = React.useCallback(() => {
        apiRef.current.setRows([]);
        stopPolling();
        debouncedFetchRows();
    }, [stopPolling, debouncedFetchRows, apiRef]);
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
        if (currentStrategy !== DataSourceRowsUpdateStrategy.Default &&
            currentStrategy !== DataSourceRowsUpdateStrategy.LazyLoading &&
            currentStrategy !== DataSourceRowsUpdateStrategy.GroupedData) {
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
            group: 'dataSourceRowsUpdate',
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
