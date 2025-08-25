"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridLazyLoader = void 0;
var React = require("react");
var x_data_grid_1 = require("@mui/x-data-grid");
var internals_1 = require("@mui/x-data-grid/internals");
var utils_1 = require("./utils");
/**
 * @requires useGridRows (state)
 * @requires useGridPagination (state)
 * @requires useGridDimensions (method) - can be after
 * @requires useGridScroll (method
 */
var useGridLazyLoader = function (privateApiRef, props) {
    var sortModel = (0, x_data_grid_1.useGridSelector)(privateApiRef, x_data_grid_1.gridSortModelSelector);
    var filterModel = (0, x_data_grid_1.useGridSelector)(privateApiRef, x_data_grid_1.gridFilterModelSelector);
    var renderedRowsIntervalCache = React.useRef({
        firstRowToRender: 0,
        lastRowToRender: 0,
    });
    var isDisabled = props.rowsLoadingMode !== 'server';
    var handleRenderedRowsIntervalChange = React.useCallback(function (params) {
        if (isDisabled) {
            return;
        }
        var fetchRowsParams = {
            firstRowToRender: params.firstRowIndex,
            lastRowToRender: params.lastRowIndex,
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
        if (sortModel.length === 0 && filterModel.items.length === 0) {
            var currentVisibleRows = (0, internals_1.getVisibleRows)(privateApiRef, {
                pagination: props.pagination,
                paginationMode: props.paginationMode,
            });
            var skeletonRowsSection = (0, utils_1.findSkeletonRowsSection)({
                apiRef: privateApiRef,
                visibleRows: currentVisibleRows.rows,
                range: {
                    firstRowIndex: params.firstRowIndex,
                    lastRowIndex: params.lastRowIndex,
                },
            });
            if (!skeletonRowsSection) {
                return;
            }
            fetchRowsParams.firstRowToRender = skeletonRowsSection.firstRowIndex;
            fetchRowsParams.lastRowToRender = skeletonRowsSection.lastRowIndex;
        }
        privateApiRef.current.publishEvent('fetchRows', fetchRowsParams);
    }, [privateApiRef, isDisabled, props.pagination, props.paginationMode, sortModel, filterModel]);
    var handleGridSortModelChange = React.useCallback(function (newSortModel) {
        if (isDisabled) {
            return;
        }
        privateApiRef.current.requestPipeProcessorsApplication('hydrateRows');
        var renderContext = (0, x_data_grid_1.gridRenderContextSelector)(privateApiRef);
        var fetchRowsParams = {
            firstRowToRender: renderContext.firstRowIndex,
            lastRowToRender: renderContext.lastRowIndex,
            sortModel: newSortModel,
            filterModel: filterModel,
        };
        privateApiRef.current.publishEvent('fetchRows', fetchRowsParams);
    }, [privateApiRef, isDisabled, filterModel]);
    var handleGridFilterModelChange = React.useCallback(function (newFilterModel) {
        if (isDisabled) {
            return;
        }
        privateApiRef.current.requestPipeProcessorsApplication('hydrateRows');
        var renderContext = (0, x_data_grid_1.gridRenderContextSelector)(privateApiRef);
        var fetchRowsParams = {
            firstRowToRender: renderContext.firstRowIndex,
            lastRowToRender: renderContext.lastRowIndex,
            sortModel: sortModel,
            filterModel: newFilterModel,
        };
        privateApiRef.current.publishEvent('fetchRows', fetchRowsParams);
    }, [privateApiRef, isDisabled, sortModel]);
    (0, x_data_grid_1.useGridEvent)(privateApiRef, 'renderedRowsIntervalChange', handleRenderedRowsIntervalChange);
    (0, x_data_grid_1.useGridEvent)(privateApiRef, 'sortModelChange', handleGridSortModelChange);
    (0, x_data_grid_1.useGridEvent)(privateApiRef, 'filterModelChange', handleGridFilterModelChange);
    (0, x_data_grid_1.useGridEventPriority)(privateApiRef, 'fetchRows', props.onFetchRows);
};
exports.useGridLazyLoader = useGridLazyLoader;
