"use strict";
'use client';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridDataSourceLazyLoader = void 0;
var React = require("react");
var throttle_1 = require("@mui/x-internals/throttle");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var debounce_1 = require("@mui/utils/debounce");
var x_data_grid_1 = require("@mui/x-data-grid");
var internals_1 = require("@mui/x-data-grid/internals");
var utils_1 = require("../lazyLoader/utils");
var useGridLazyLoaderPreProcessors_1 = require("../lazyLoader/useGridLazyLoaderPreProcessors");
var LoadingTrigger;
(function (LoadingTrigger) {
    LoadingTrigger[LoadingTrigger["VIEWPORT"] = 0] = "VIEWPORT";
    LoadingTrigger[LoadingTrigger["SCROLL_END"] = 1] = "SCROLL_END";
})(LoadingTrigger || (LoadingTrigger = {}));
var INTERVAL_CACHE_INITIAL_STATE = {
    firstRowToRender: 0,
    lastRowToRender: 0,
};
var getSkeletonRowId = function (index) { return "".concat(useGridLazyLoaderPreProcessors_1.GRID_SKELETON_ROW_ROOT_ID, "-").concat(index); };
/**
 * @requires useGridRows (state)
 * @requires useGridPagination (state)
 * @requires useGridScroll (method
 */
var useGridDataSourceLazyLoader = function (privateApiRef, props) {
    var setStrategyAvailability = React.useCallback(function () {
        privateApiRef.current.setStrategyAvailability(internals_1.GridStrategyGroup.DataSource, internals_1.DataSourceRowsUpdateStrategy.LazyLoading, props.dataSource && props.lazyLoading ? function () { return true; } : function () { return false; });
    }, [privateApiRef, props.lazyLoading, props.dataSource]);
    var _a = React.useState(false), lazyLoadingRowsUpdateStrategyActive = _a[0], setLazyLoadingRowsUpdateStrategyActive = _a[1];
    var renderedRowsIntervalCache = React.useRef(INTERVAL_CACHE_INITIAL_STATE);
    var previousLastRowIndex = React.useRef(0);
    var loadingTrigger = React.useRef(null);
    var rowsStale = React.useRef(false);
    var draggedRowId = React.useRef(null);
    var fetchRows = React.useCallback(function (params) {
        privateApiRef.current.dataSource.fetchRows(x_data_grid_1.GRID_ROOT_GROUP_ID, params);
    }, [privateApiRef]);
    var debouncedFetchRows = React.useMemo(function () { return (0, debounce_1.default)(fetchRows, 0); }, [fetchRows]);
    // Adjust the render context range to fit the pagination model's page size
    // First row index should be decreased to the start of the page, end row index should be increased to the end of the page
    var adjustRowParams = React.useCallback(function (params) {
        if (typeof params.start !== 'number') {
            return params;
        }
        var paginationModel = (0, x_data_grid_1.gridPaginationModelSelector)(privateApiRef);
        return __assign(__assign({}, params), { start: params.start - (params.start % paginationModel.pageSize), end: params.end + paginationModel.pageSize - (params.end % paginationModel.pageSize) - 1 });
    }, [privateApiRef]);
    var resetGrid = React.useCallback(function () {
        privateApiRef.current.setLoading(true);
        privateApiRef.current.dataSource.cache.clear();
        rowsStale.current = true;
        previousLastRowIndex.current = 0;
        var paginationModel = (0, x_data_grid_1.gridPaginationModelSelector)(privateApiRef);
        var sortModel = (0, x_data_grid_1.gridSortModelSelector)(privateApiRef);
        var filterModel = (0, x_data_grid_1.gridFilterModelSelector)(privateApiRef);
        var getRowsParams = {
            start: 0,
            end: paginationModel.pageSize - 1,
            sortModel: sortModel,
            filterModel: filterModel,
        };
        fetchRows(getRowsParams);
    }, [privateApiRef, fetchRows]);
    var ensureValidRowCount = React.useCallback(function (previousLoadingTrigger, newLoadingTrigger) {
        // switching from lazy loading to infinite loading should always reset the grid
        // since there is no guarantee that the new data will be placed correctly
        // there might be some skeleton rows in between the data or the data has changed (row count became unknown)
        if (previousLoadingTrigger === LoadingTrigger.VIEWPORT &&
            newLoadingTrigger === LoadingTrigger.SCROLL_END) {
            resetGrid();
            return;
        }
        // switching from infinite loading to lazy loading should reset the grid only if the known row count
        // is smaller than the amount of rows rendered
        var tree = privateApiRef.current.state.rows.tree;
        var rootGroup = tree[x_data_grid_1.GRID_ROOT_GROUP_ID];
        var rootGroupChildren = __spreadArray([], rootGroup.children, true);
        var pageRowCount = privateApiRef.current.state.pagination.rowCount;
        var rootChildrenCount = rootGroupChildren.length;
        if (rootChildrenCount > pageRowCount) {
            resetGrid();
        }
    }, [privateApiRef, resetGrid]);
    var addSkeletonRows = React.useCallback(function () {
        var _a, _b;
        var tree = privateApiRef.current.state.rows.tree;
        var rootGroup = tree[x_data_grid_1.GRID_ROOT_GROUP_ID];
        var rootGroupChildren = __spreadArray([], rootGroup.children, true);
        var pageRowCount = privateApiRef.current.state.pagination.rowCount;
        var rootChildrenCount = rootGroupChildren.length;
        /**
         * Do nothing if
         * - children count is 0
         */
        if (rootChildrenCount === 0) {
            return;
        }
        var pageToSkip = adjustRowParams({
            start: renderedRowsIntervalCache.current.firstRowToRender,
            end: renderedRowsIntervalCache.current.lastRowToRender,
        });
        var hasChanged = false;
        var isInitialPage = renderedRowsIntervalCache.current.firstRowToRender === 0 &&
            renderedRowsIntervalCache.current.lastRowToRender === 0;
        for (var i = 0; i < rootChildrenCount; i += 1) {
            if (isInitialPage) {
                break;
            }
            // replace the rows not in the viewport with skeleton rows
            if ((pageToSkip.start <= i && i <= pageToSkip.end) ||
                ((_a = tree[rootGroupChildren[i]]) === null || _a === void 0 ? void 0 : _a.type) === 'skeletonRow' || // ignore rows that are already skeleton rows
                ((_b = tree[rootGroupChildren[i]]) === null || _b === void 0 ? void 0 : _b.id) === draggedRowId.current // ignore row that is being dragged (https://github.com/mui/mui-x/issues/17854)
            ) {
                continue;
            }
            var rowId = tree[rootGroupChildren[i]].id; // keep the id, so that row related state is maintained
            var skeletonRowNode = {
                type: 'skeletonRow',
                id: rowId,
                parent: x_data_grid_1.GRID_ROOT_GROUP_ID,
                depth: 0,
            };
            tree[rowId] = skeletonRowNode;
            hasChanged = true;
        }
        // Should only happen with VIEWPORT loading trigger
        if (loadingTrigger.current === LoadingTrigger.VIEWPORT) {
            // fill the grid with skeleton rows
            for (var i = 0; i < pageRowCount - rootChildrenCount; i += 1) {
                var skeletonId = getSkeletonRowId(i + rootChildrenCount); // to avoid duplicate keys on rebuild
                rootGroupChildren.push(skeletonId);
                var skeletonRowNode = {
                    type: 'skeletonRow',
                    id: skeletonId,
                    parent: x_data_grid_1.GRID_ROOT_GROUP_ID,
                    depth: 0,
                };
                tree[skeletonId] = skeletonRowNode;
                hasChanged = true;
            }
        }
        if (!hasChanged) {
            return;
        }
        tree[x_data_grid_1.GRID_ROOT_GROUP_ID] = __assign(__assign({}, rootGroup), { children: rootGroupChildren });
        privateApiRef.current.setState(function (state) { return (__assign(__assign({}, state), { rows: __assign(__assign({}, state.rows), { tree: tree }) })); }, 'addSkeletonRows');
    }, [privateApiRef, adjustRowParams]);
    var updateLoadingTrigger = React.useCallback(function (rowCount) {
        var newLoadingTrigger = rowCount === -1 ? LoadingTrigger.SCROLL_END : LoadingTrigger.VIEWPORT;
        if (loadingTrigger.current !== null) {
            ensureValidRowCount(loadingTrigger.current, newLoadingTrigger);
        }
        if (loadingTrigger.current !== newLoadingTrigger) {
            loadingTrigger.current = newLoadingTrigger;
        }
    }, [ensureValidRowCount]);
    var handleDataUpdate = React.useCallback(function (params) {
        if ('error' in params) {
            return;
        }
        var response = params.response, fetchParams = params.fetchParams;
        var pageRowCount = privateApiRef.current.state.pagination.rowCount;
        var tree = privateApiRef.current.state.rows.tree;
        var dataRowIdToModelLookup = privateApiRef.current.state.rows.dataRowIdToModelLookup;
        if (response.rowCount !== undefined || pageRowCount === undefined) {
            privateApiRef.current.setRowCount(response.rowCount === undefined ? -1 : response.rowCount);
        }
        // scroll to the top if the rows are stale and the new request is for the first page
        if (rowsStale.current && params.fetchParams.start === 0) {
            privateApiRef.current.scroll({ top: 0 });
            // the rows can safely be replaced. skeleton rows will be added later
            privateApiRef.current.setRows(response.rows);
        }
        else {
            var rootGroup = tree[x_data_grid_1.GRID_ROOT_GROUP_ID];
            var rootGroupChildren_1 = __spreadArray([], rootGroup.children, true);
            var filteredSortedRowIds = (0, x_data_grid_1.gridFilteredSortedRowIdsSelector)(privateApiRef);
            var startingIndex = typeof fetchParams.start === 'string'
                ? Math.max(filteredSortedRowIds.indexOf(fetchParams.start), 0)
                : fetchParams.start;
            // Check for duplicate rows
            var duplicateRowCount_1 = 0;
            response.rows.forEach(function (row) {
                var rowId = (0, x_data_grid_1.gridRowIdSelector)(privateApiRef, row);
                if (tree[rowId] || dataRowIdToModelLookup[rowId]) {
                    var index = rootGroupChildren_1.indexOf(rowId);
                    if (index !== -1) {
                        var skeletonId = getSkeletonRowId(index);
                        rootGroupChildren_1[index] = skeletonId;
                        tree[skeletonId] = {
                            type: 'skeletonRow',
                            id: skeletonId,
                            parent: x_data_grid_1.GRID_ROOT_GROUP_ID,
                            depth: 0,
                        };
                    }
                    delete tree[rowId];
                    delete dataRowIdToModelLookup[rowId];
                    duplicateRowCount_1 += 1;
                }
            });
            if (duplicateRowCount_1 > 0) {
                tree[x_data_grid_1.GRID_ROOT_GROUP_ID] = __assign(__assign({}, rootGroup), { children: rootGroupChildren_1 });
                privateApiRef.current.setState(function (state) { return (__assign(__assign({}, state), { rows: __assign(__assign({}, state.rows), { tree: tree, dataRowIdToModelLookup: dataRowIdToModelLookup }) })); });
            }
            privateApiRef.current.unstable_replaceRows(startingIndex, response.rows);
        }
        rowsStale.current = false;
        if (loadingTrigger.current === null) {
            updateLoadingTrigger(privateApiRef.current.state.pagination.rowCount);
        }
        addSkeletonRows();
        privateApiRef.current.setLoading(false);
        privateApiRef.current.unstable_applyPipeProcessors('processDataSourceRows', { params: params.fetchParams, response: response }, false);
        privateApiRef.current.requestPipeProcessorsApplication('hydrateRows');
    }, [privateApiRef, updateLoadingTrigger, addSkeletonRows]);
    var handleRowCountChange = React.useCallback(function () {
        if (rowsStale.current || loadingTrigger.current === null) {
            return;
        }
        updateLoadingTrigger(privateApiRef.current.state.pagination.rowCount);
        addSkeletonRows();
        privateApiRef.current.requestPipeProcessorsApplication('hydrateRows');
    }, [privateApiRef, updateLoadingTrigger, addSkeletonRows]);
    var handleIntersection = (0, useEventCallback_1.default)(function () {
        if (rowsStale.current || loadingTrigger.current !== LoadingTrigger.SCROLL_END) {
            return;
        }
        var renderContext = (0, internals_1.gridRenderContextSelector)(privateApiRef);
        if (previousLastRowIndex.current >= renderContext.lastRowIndex) {
            return;
        }
        previousLastRowIndex.current = renderContext.lastRowIndex;
        var paginationModel = (0, x_data_grid_1.gridPaginationModelSelector)(privateApiRef);
        var sortModel = (0, x_data_grid_1.gridSortModelSelector)(privateApiRef);
        var filterModel = (0, x_data_grid_1.gridFilterModelSelector)(privateApiRef);
        var getRowsParams = {
            start: renderContext.lastRowIndex,
            end: renderContext.lastRowIndex + paginationModel.pageSize - 1,
            sortModel: sortModel,
            filterModel: filterModel,
        };
        privateApiRef.current.setLoading(true);
        fetchRows(adjustRowParams(getRowsParams));
    });
    var handleRenderedRowsIntervalChange = React.useCallback(function (params) {
        if (rowsStale.current) {
            return;
        }
        var sortModel = (0, x_data_grid_1.gridSortModelSelector)(privateApiRef);
        var filterModel = (0, x_data_grid_1.gridFilterModelSelector)(privateApiRef);
        var getRowsParams = {
            start: params.firstRowIndex,
            end: params.lastRowIndex - 1,
            sortModel: sortModel,
            filterModel: filterModel,
        };
        if (renderedRowsIntervalCache.current.firstRowToRender === params.firstRowIndex &&
            renderedRowsIntervalCache.current.lastRowToRender === params.lastRowIndex) {
            return;
        }
        renderedRowsIntervalCache.current = {
            firstRowToRender: params.firstRowIndex,
            lastRowToRender: params.lastRowIndex,
        };
        var currentVisibleRows = (0, internals_1.getVisibleRows)(privateApiRef);
        var skeletonRowsSection = (0, utils_1.findSkeletonRowsSection)({
            apiRef: privateApiRef,
            visibleRows: currentVisibleRows.rows,
            range: {
                firstRowIndex: params.firstRowIndex,
                lastRowIndex: params.lastRowIndex - 1,
            },
        });
        if (!skeletonRowsSection) {
            return;
        }
        getRowsParams.start = skeletonRowsSection.firstRowIndex;
        getRowsParams.end = skeletonRowsSection.lastRowIndex;
        fetchRows(adjustRowParams(getRowsParams));
    }, [privateApiRef, adjustRowParams, fetchRows]);
    var throttledHandleRenderedRowsIntervalChange = React.useMemo(function () { return (0, throttle_1.throttle)(handleRenderedRowsIntervalChange, props.lazyLoadingRequestThrottleMs); }, [props.lazyLoadingRequestThrottleMs, handleRenderedRowsIntervalChange]);
    React.useEffect(function () {
        return function () {
            throttledHandleRenderedRowsIntervalChange.clear();
        };
    }, [throttledHandleRenderedRowsIntervalChange]);
    var handleGridSortModelChange = React.useCallback(function (newSortModel) {
        rowsStale.current = true;
        throttledHandleRenderedRowsIntervalChange.clear();
        previousLastRowIndex.current = 0;
        var paginationModel = (0, x_data_grid_1.gridPaginationModelSelector)(privateApiRef);
        var filterModel = (0, x_data_grid_1.gridFilterModelSelector)(privateApiRef);
        var getRowsParams = {
            start: 0,
            end: paginationModel.pageSize - 1,
            sortModel: newSortModel,
            filterModel: filterModel,
        };
        privateApiRef.current.setLoading(true);
        debouncedFetchRows(getRowsParams);
    }, [privateApiRef, debouncedFetchRows, throttledHandleRenderedRowsIntervalChange]);
    var handleGridFilterModelChange = React.useCallback(function (newFilterModel) {
        rowsStale.current = true;
        throttledHandleRenderedRowsIntervalChange.clear();
        previousLastRowIndex.current = 0;
        var paginationModel = (0, x_data_grid_1.gridPaginationModelSelector)(privateApiRef);
        var sortModel = (0, x_data_grid_1.gridSortModelSelector)(privateApiRef);
        var getRowsParams = {
            start: 0,
            end: paginationModel.pageSize - 1,
            sortModel: sortModel,
            filterModel: newFilterModel,
        };
        privateApiRef.current.setLoading(true);
        debouncedFetchRows(getRowsParams);
    }, [privateApiRef, debouncedFetchRows, throttledHandleRenderedRowsIntervalChange]);
    var handleDragStart = React.useCallback(function (row) {
        draggedRowId.current = row.id;
    }, []);
    var handleDragEnd = React.useCallback(function () {
        draggedRowId.current = null;
    }, []);
    var handleStrategyActivityChange = React.useCallback(function () {
        setLazyLoadingRowsUpdateStrategyActive(privateApiRef.current.getActiveStrategy(internals_1.GridStrategyGroup.DataSource) ===
            internals_1.DataSourceRowsUpdateStrategy.LazyLoading);
    }, [privateApiRef]);
    (0, internals_1.useGridRegisterStrategyProcessor)(privateApiRef, internals_1.DataSourceRowsUpdateStrategy.LazyLoading, 'dataSourceRowsUpdate', handleDataUpdate);
    (0, x_data_grid_1.useGridEvent)(privateApiRef, 'strategyAvailabilityChange', handleStrategyActivityChange);
    (0, x_data_grid_1.useGridEvent)(privateApiRef, 'rowCountChange', (0, internals_1.runIf)(lazyLoadingRowsUpdateStrategyActive, handleRowCountChange));
    (0, x_data_grid_1.useGridEvent)(privateApiRef, 'rowsScrollEndIntersection', (0, internals_1.runIf)(lazyLoadingRowsUpdateStrategyActive, handleIntersection));
    (0, x_data_grid_1.useGridEvent)(privateApiRef, 'renderedRowsIntervalChange', (0, internals_1.runIf)(lazyLoadingRowsUpdateStrategyActive, throttledHandleRenderedRowsIntervalChange));
    (0, x_data_grid_1.useGridEvent)(privateApiRef, 'sortModelChange', (0, internals_1.runIf)(lazyLoadingRowsUpdateStrategyActive, handleGridSortModelChange));
    (0, x_data_grid_1.useGridEvent)(privateApiRef, 'filterModelChange', (0, internals_1.runIf)(lazyLoadingRowsUpdateStrategyActive, handleGridFilterModelChange));
    (0, x_data_grid_1.useGridEvent)(privateApiRef, 'rowDragStart', (0, internals_1.runIf)(lazyLoadingRowsUpdateStrategyActive, handleDragStart));
    (0, x_data_grid_1.useGridEvent)(privateApiRef, 'rowDragEnd', (0, internals_1.runIf)(lazyLoadingRowsUpdateStrategyActive, handleDragEnd));
    React.useEffect(function () {
        setStrategyAvailability();
    }, [setStrategyAvailability]);
};
exports.useGridDataSourceLazyLoader = useGridDataSourceLazyLoader;
