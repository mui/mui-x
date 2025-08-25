"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridVirtualizer = useGridVirtualizer;
var React = require("react");
var useLazyRef_1 = require("@mui/utils/useLazyRef");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var RtlProvider_1 = require("@mui/system/RtlProvider");
var math_1 = require("@mui/x-internals/math");
var lruMemoize_1 = require("@mui/x-internals/lruMemoize");
var store_1 = require("@mui/x-internals/store");
var x_virtualizer_1 = require("@mui/x-virtualizer");
var useFirstRender_1 = require("../utils/useFirstRender");
var createSelector_1 = require("../../utils/createSelector");
var useGridSelector_1 = require("../utils/useGridSelector");
var gridDimensionsSelectors_1 = require("../features/dimensions/gridDimensionsSelectors");
var density_1 = require("../features/density");
var gridColumnsSelector_1 = require("../features/columns/gridColumnsSelector");
var gridRowsSelector_1 = require("../features/rows/gridRowsSelector");
var useGridVisibleRows_1 = require("../utils/useGridVisibleRows");
var pagination_1 = require("../features/pagination");
var gridFocusedVirtualCellSelector_1 = require("../features/virtualization/gridFocusedVirtualCellSelector");
var rowSelection_1 = require("../features/rowSelection");
var dataGridPropsDefaultValues_1 = require("../../constants/dataGridPropsDefaultValues");
var gridRowsUtils_1 = require("../features/rows/gridRowsUtils");
var gridColumnsUtils_1 = require("../features/columns/gridColumnsUtils");
function identity(x) {
    return x;
}
var columnsTotalWidthSelector = (0, createSelector_1.createSelector)(gridColumnsSelector_1.gridVisibleColumnDefinitionsSelector, gridColumnsSelector_1.gridColumnPositionsSelector, function (visibleColumns, positions) {
    var colCount = visibleColumns.length;
    if (colCount === 0) {
        return 0;
    }
    return (0, math_1.roundToDecimalPlaces)(positions[colCount - 1] + visibleColumns[colCount - 1].computedWidth, 1);
});
/** Translates virtualizer state to grid state */
var addGridDimensionsCreator = function () {
    return (0, lruMemoize_1.lruMemoize)(function (dimensions, headerHeight, groupHeaderHeight, headerFilterHeight, headersTotalHeight) {
        return __assign(__assign({}, dimensions), { headerHeight: headerHeight, groupHeaderHeight: groupHeaderHeight, headerFilterHeight: headerFilterHeight, headersTotalHeight: headersTotalHeight });
    }, { maxSize: 1 });
};
/**
 * Virtualizer setup
 */
function useGridVirtualizer(apiRef, rootProps) {
    var _a, _b, _c;
    var isRtl = (0, RtlProvider_1.useRtl)();
    var listView = rootProps.listView;
    var visibleColumns = (0, useGridSelector_1.useGridSelector)(apiRef, gridColumnsSelector_1.gridVisibleColumnDefinitionsSelector);
    var pinnedRows = (0, useGridSelector_1.useGridSelector)(apiRef, gridRowsSelector_1.gridPinnedRowsSelector);
    var pinnedColumns = (0, gridColumnsSelector_1.gridVisiblePinnedColumnDefinitionsSelector)(apiRef);
    var rowSelectionManager = (0, useGridSelector_1.useGridSelector)(apiRef, rowSelection_1.gridRowSelectionManagerSelector);
    var isRowSelected = function (id) {
        return rowSelectionManager.has(id) && apiRef.current.isRowSelectable(id);
    };
    var currentPage = (0, useGridVisibleRows_1.useGridVisibleRows)(apiRef);
    var hasColSpan = (0, useGridSelector_1.useGridSelector)(apiRef, gridColumnsSelector_1.gridHasColSpanSelector);
    var verticalScrollbarWidth = (0, useGridSelector_1.useGridSelector)(apiRef, gridDimensionsSelectors_1.gridVerticalScrollbarWidthSelector);
    var hasFiller = (0, useGridSelector_1.useGridSelector)(apiRef, gridDimensionsSelectors_1.gridHasFillerSelector);
    var autoHeight = rootProps.autoHeight;
    var scrollReset = listView;
    // <DIMENSIONS>
    var density = (0, useGridSelector_1.useGridSelector)(apiRef, density_1.gridDensityFactorSelector);
    var baseRowHeight = (0, gridRowsUtils_1.getValidRowHeight)(rootProps.rowHeight, dataGridPropsDefaultValues_1.DATA_GRID_PROPS_DEFAULT_VALUES.rowHeight, gridRowsUtils_1.rowHeightWarning);
    var rowHeight = Math.floor(baseRowHeight * density);
    var headerHeight = Math.floor(rootProps.columnHeaderHeight * density);
    var groupHeaderHeight = Math.floor(((_a = rootProps.columnGroupHeaderHeight) !== null && _a !== void 0 ? _a : rootProps.columnHeaderHeight) * density);
    var headerFilterHeight = Math.floor(((_b = rootProps.headerFilterHeight) !== null && _b !== void 0 ? _b : rootProps.columnHeaderHeight) * density);
    var columnsTotalWidth = (0, useGridSelector_1.useGridSelector)(apiRef, columnsTotalWidthSelector);
    var headersTotalHeight = (0, gridColumnsUtils_1.getTotalHeaderHeight)(apiRef, rootProps);
    var leftPinnedWidth = pinnedColumns.left.reduce(function (w, col) { return w + col.computedWidth; }, 0);
    var rightPinnedWidth = pinnedColumns.right.reduce(function (w, col) { return w + col.computedWidth; }, 0);
    var dimensionsParams = {
        rowHeight: rowHeight,
        headerHeight: headerHeight,
        columnsTotalWidth: columnsTotalWidth,
        leftPinnedWidth: leftPinnedWidth,
        rightPinnedWidth: rightPinnedWidth,
        topPinnedHeight: headersTotalHeight,
        bottomPinnedHeight: 0,
        scrollbarSize: rootProps.scrollbarSize,
    };
    var addGridDimensions = (0, useLazyRef_1.default)(addGridDimensionsCreator).current;
    // </DIMENSIONS>
    // <ROWS_META>
    var dataRowCount = (0, useGridSelector_1.useGridSelector)(apiRef, gridRowsSelector_1.gridRowCountSelector);
    var pagination = (0, useGridSelector_1.useGridSelector)(apiRef, pagination_1.gridPaginationSelector);
    var rowCount = Math.min(pagination.enabled ? pagination.paginationModel.pageSize : dataRowCount, dataRowCount);
    var getRowHeight = rootProps.getRowHeight, getEstimatedRowHeight = rootProps.getEstimatedRowHeight, getRowSpacing = rootProps.getRowSpacing;
    // </ROWS_META>
    var focusedVirtualCell = (0, useGridSelector_1.useGridSelector)(apiRef, gridFocusedVirtualCellSelector_1.gridFocusedVirtualCellSelector);
    var virtualizer = (0, x_virtualizer_1.useVirtualizer)({
        refs: {
            container: apiRef.current.mainElementRef,
            scroller: apiRef.current.virtualScrollerRef,
            scrollbarVertical: apiRef.current.virtualScrollbarVerticalRef,
            scrollbarHorizontal: apiRef.current.virtualScrollbarHorizontalRef,
        },
        dimensions: dimensionsParams,
        virtualization: {
            isRtl: isRtl,
            rowBufferPx: rootProps.rowBufferPx,
            columnBufferPx: rootProps.columnBufferPx,
        },
        colspan: {
            enabled: hasColSpan,
            getColspan: function (rowId, column) {
                var _a, _b;
                if (typeof column.colSpan === 'function') {
                    var row = apiRef.current.getRow(rowId);
                    var value = apiRef.current.getRowValue(row, column);
                    return (_a = column.colSpan(value, row, column, apiRef)) !== null && _a !== void 0 ? _a : 0;
                }
                return (_b = column.colSpan) !== null && _b !== void 0 ? _b : 1;
            },
        },
        initialState: {
            scroll: (_c = rootProps.initialState) === null || _c === void 0 ? void 0 : _c.scroll,
            rowSpanning: apiRef.current.state.rowSpanning,
            virtualization: apiRef.current.state.virtualization,
        },
        rows: currentPage.rows,
        range: currentPage.range,
        rowCount: rowCount,
        columns: visibleColumns,
        pinnedRows: pinnedRows,
        pinnedColumns: pinnedColumns,
        autoHeight: autoHeight,
        minimalContentHeight: gridRowsUtils_1.minimalContentHeight,
        getRowHeight: React.useMemo(function () {
            if (!getRowHeight) {
                return undefined;
            }
            return function (rowEntry) { return getRowHeight(__assign(__assign({}, rowEntry), { densityFactor: density })); };
        }, [getRowHeight, density]),
        getEstimatedRowHeight: React.useMemo(function () {
            return getEstimatedRowHeight
                ? function (rowEntry) { return getEstimatedRowHeight(__assign(__assign({}, rowEntry), { densityFactor: density })); }
                : undefined;
        }, [getEstimatedRowHeight, density]),
        getRowSpacing: React.useMemo(function () {
            return getRowSpacing
                ? function (rowEntry) {
                    var _a;
                    var indexRelativeToCurrentPage = (_a = currentPage.rowIdToIndexMap.get(rowEntry.id)) !== null && _a !== void 0 ? _a : -1;
                    var visibility = {
                        isFirstVisible: indexRelativeToCurrentPage === 0,
                        isLastVisible: indexRelativeToCurrentPage === currentPage.rows.length - 1,
                        indexRelativeToCurrentPage: indexRelativeToCurrentPage,
                    };
                    return getRowSpacing(__assign(__assign(__assign({}, rowEntry), visibility), { indexRelativeToCurrentPage: apiRef.current.getRowIndexRelativeToVisibleRows(rowEntry.id) }));
                }
                : undefined;
        }, [apiRef, getRowSpacing, currentPage.rows, currentPage.rowIdToIndexMap]),
        applyRowHeight: (0, useEventCallback_1.default)(function (entry, row) {
            return apiRef.current.unstable_applyPipeProcessors('rowHeight', entry, row);
        }),
        virtualizeColumnsWithAutoRowHeight: rootProps.virtualizeColumnsWithAutoRowHeight,
        focusedVirtualCell: (0, useEventCallback_1.default)(function () { return focusedVirtualCell; }),
        resizeThrottleMs: rootProps.resizeThrottleMs,
        onResize: (0, useEventCallback_1.default)(function (size) { return apiRef.current.publishEvent('resize', size); }),
        onWheel: (0, useEventCallback_1.default)(function (event) {
            apiRef.current.publishEvent('virtualScrollerWheel', {}, event);
        }),
        onTouchMove: (0, useEventCallback_1.default)(function (event) {
            apiRef.current.publishEvent('virtualScrollerTouchMove', {}, event);
        }),
        onRenderContextChange: (0, useEventCallback_1.default)(function (nextRenderContext) {
            apiRef.current.publishEvent('renderedRowsIntervalChange', nextRenderContext);
        }),
        onScrollChange: function (scrollPosition, nextRenderContext) {
            apiRef.current.publishEvent('scrollPositionChange', {
                top: scrollPosition.top,
                left: scrollPosition.left,
                renderContext: nextRenderContext,
            });
        },
        scrollReset: scrollReset,
        renderRow: function (params) {
            var _a;
            return (<rootProps.slots.row key={params.id} row={params.model} rowId={params.id} index={params.rowIndex} selected={isRowSelected(params.id)} offsetLeft={params.offsetLeft} columnsTotalWidth={columnsTotalWidth} rowHeight={params.baseRowHeight} pinnedColumns={pinnedColumns} visibleColumns={visibleColumns} firstColumnIndex={params.firstColumnIndex} lastColumnIndex={params.lastColumnIndex} focusedColumnIndex={params.focusedColumnIndex} isFirstVisible={params.isFirstVisible} isLastVisible={params.isLastVisible} isNotVisible={params.isVirtualFocusRow} showBottomBorder={params.showBottomBorder} scrollbarWidth={verticalScrollbarWidth} gridHasFiller={hasFiller} {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.row}/>);
        },
        renderInfiniteLoadingTrigger: function (id) { var _a, _b; return (_b = (_a = apiRef.current).getInfiniteLoadingTriggerElement) === null || _b === void 0 ? void 0 : _b.call(_a, { lastRowId: id }); },
    });
    // HACK: Keep the grid's store in sync with the virtualizer store. We set up the
    // subscription in the render phase rather than in an effect because other grid
    // initialization code runs between those two moments.
    //
    // TODO(v9): Remove this
    (0, useFirstRender_1.useFirstRender)(function () {
        apiRef.current.store.state.dimensions = addGridDimensions(virtualizer.store.state.dimensions, headerHeight, groupHeaderHeight, headerFilterHeight, headersTotalHeight);
        apiRef.current.store.state.rowsMeta = virtualizer.store.state.rowsMeta;
        apiRef.current.store.state.virtualization = virtualizer.store.state.virtualization;
    });
    (0, store_1.useStoreEffect)(virtualizer.store, x_virtualizer_1.Dimensions.selectors.dimensions, function (_, dimensions) {
        apiRef.current.setState(function (gridState) { return (__assign(__assign({}, gridState), { dimensions: addGridDimensions(dimensions, headerHeight, groupHeaderHeight, headerFilterHeight, headersTotalHeight) })); });
    });
    (0, store_1.useStoreEffect)(virtualizer.store, identity, function (_, state) {
        if (state.rowsMeta !== apiRef.current.state.rowsMeta) {
            apiRef.current.setState(function (gridState) { return (__assign(__assign({}, gridState), { rowsMeta: state.rowsMeta })); });
        }
        if (state.virtualization !== apiRef.current.state.virtualization) {
            apiRef.current.setState(function (gridState) { return (__assign(__assign({}, gridState), { virtualization: state.virtualization })); });
        }
    });
    apiRef.current.register('private', {
        virtualizer: virtualizer,
    });
}
