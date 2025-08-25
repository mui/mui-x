"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridInfiniteLoader = void 0;
var x_data_grid_1 = require("@mui/x-data-grid");
var internals_1 = require("@mui/x-data-grid/internals");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
/**
 * @requires useGridColumns (state)
 * @requires useGridDimensions (method) - can be after
 * @requires useGridScroll (method
 */
var useGridInfiniteLoader = function (apiRef, props) {
    var visibleColumns = (0, x_data_grid_1.useGridSelector)(apiRef, x_data_grid_1.gridVisibleColumnDefinitionsSelector);
    var currentPage = (0, internals_1.useGridVisibleRows)(apiRef, props);
    var isEnabled = props.rowsLoadingMode === 'client' && !!props.onRowsScrollEnd;
    var handleLoadMoreRows = (0, useEventCallback_1.default)(function () {
        var viewportPageSize = apiRef.current.getViewportPageSize();
        var rowScrollEndParams = {
            visibleColumns: visibleColumns,
            viewportPageSize: viewportPageSize,
            visibleRowsCount: currentPage.rows.length,
        };
        apiRef.current.publishEvent('rowsScrollEnd', rowScrollEndParams);
    });
    (0, x_data_grid_1.useGridEventPriority)(apiRef, 'rowsScrollEnd', props.onRowsScrollEnd);
    (0, x_data_grid_1.useGridEvent)(apiRef, 'rowsScrollEndIntersection', (0, internals_1.runIf)(isEnabled, handleLoadMoreRows));
};
exports.useGridInfiniteLoader = useGridInfiniteLoader;
