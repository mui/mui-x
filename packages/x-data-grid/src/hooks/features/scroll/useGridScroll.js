"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridScroll = void 0;
var React = require("react");
var RtlProvider_1 = require("@mui/system/RtlProvider");
var useGridLogger_1 = require("../../utils/useGridLogger");
var gridColumnsSelector_1 = require("../columns/gridColumnsSelector");
var useGridSelector_1 = require("../../utils/useGridSelector");
var gridPaginationSelector_1 = require("../pagination/gridPaginationSelector");
var gridRowsSelector_1 = require("../rows/gridRowsSelector");
var gridRowsMetaSelector_1 = require("../rows/gridRowsMetaSelector");
var useGridApiMethod_1 = require("../../utils/useGridApiMethod");
var gridFilterSelector_1 = require("../filter/gridFilterSelector");
var dimensions_1 = require("../dimensions");
// Logic copied from https://www.w3.org/TR/wai-aria-practices/examples/listbox/js/listbox.js
// Similar to https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
function scrollIntoView(dimensions) {
    var containerSize = dimensions.containerSize, scrollPosition = dimensions.scrollPosition, elementSize = dimensions.elementSize, elementOffset = dimensions.elementOffset;
    var elementEnd = elementOffset + elementSize;
    // Always scroll to top when cell is higher than viewport to avoid scroll jump
    // See https://github.com/mui/mui-x/issues/4513 and https://github.com/mui/mui-x/issues/4514
    if (elementSize > containerSize) {
        return elementOffset;
    }
    if (elementEnd - containerSize > scrollPosition) {
        return elementEnd - containerSize;
    }
    if (elementOffset < scrollPosition) {
        return elementOffset;
    }
    return undefined;
}
/**
 * @requires useGridPagination (state) - can be after, async only
 * @requires useGridColumns (state) - can be after, async only
 * @requires useGridRows (state) - can be after, async only
 * @requires useGridRowsMeta (state) - can be after, async only
 * @requires useGridFilter (state)
 * @requires useGridColumnSpanning (method)
 */
var useGridScroll = function (apiRef, props) {
    var isRtl = (0, RtlProvider_1.useRtl)();
    var logger = (0, useGridLogger_1.useGridLogger)(apiRef, 'useGridScroll');
    var colRef = apiRef.current.columnHeadersContainerRef;
    var virtualScrollerRef = apiRef.current.virtualScrollerRef;
    var visibleSortedRows = (0, useGridSelector_1.useGridSelector)(apiRef, gridFilterSelector_1.gridExpandedSortedRowEntriesSelector);
    var scrollToIndexes = React.useCallback(function (params) {
        var _a;
        var dimensions = (0, dimensions_1.gridDimensionsSelector)(apiRef);
        var totalRowCount = (0, gridRowsSelector_1.gridRowCountSelector)(apiRef);
        var visibleColumns = (0, gridColumnsSelector_1.gridVisibleColumnDefinitionsSelector)(apiRef);
        var scrollToHeader = params.rowIndex == null;
        if ((!scrollToHeader && totalRowCount === 0) || visibleColumns.length === 0) {
            return false;
        }
        logger.debug("Scrolling to cell at row ".concat(params.rowIndex, ", col: ").concat(params.colIndex, " "));
        var scrollCoordinates = {};
        if (params.colIndex !== undefined) {
            var columnPositions = (0, gridColumnsSelector_1.gridColumnPositionsSelector)(apiRef);
            var cellWidth = void 0;
            if (typeof params.rowIndex !== 'undefined') {
                var rowId = (_a = visibleSortedRows[params.rowIndex]) === null || _a === void 0 ? void 0 : _a.id;
                var cellColSpanInfo = apiRef.current.unstable_getCellColSpanInfo(rowId, params.colIndex);
                if (cellColSpanInfo && !cellColSpanInfo.spannedByColSpan) {
                    cellWidth = cellColSpanInfo.cellProps.width;
                }
            }
            if (typeof cellWidth === 'undefined') {
                cellWidth = visibleColumns[params.colIndex].computedWidth;
            }
            // When using RTL, `scrollLeft` becomes negative, so we must ensure that we only compare values.
            scrollCoordinates.left = scrollIntoView({
                containerSize: dimensions.viewportOuterSize.width,
                scrollPosition: Math.abs(virtualScrollerRef.current.scrollLeft),
                elementSize: cellWidth,
                elementOffset: columnPositions[params.colIndex],
            });
        }
        if (params.rowIndex !== undefined) {
            var rowsMeta = (0, gridRowsMetaSelector_1.gridRowsMetaSelector)(apiRef);
            var page = (0, gridPaginationSelector_1.gridPageSelector)(apiRef);
            var pageSize = (0, gridPaginationSelector_1.gridPageSizeSelector)(apiRef);
            var elementIndex = !props.pagination
                ? params.rowIndex
                : params.rowIndex - page * pageSize;
            var targetOffsetHeight = rowsMeta.positions[elementIndex + 1]
                ? rowsMeta.positions[elementIndex + 1] - rowsMeta.positions[elementIndex]
                : rowsMeta.currentPageTotalHeight - rowsMeta.positions[elementIndex];
            scrollCoordinates.top = scrollIntoView({
                containerSize: dimensions.viewportInnerSize.height,
                scrollPosition: virtualScrollerRef.current.scrollTop,
                elementSize: targetOffsetHeight,
                elementOffset: rowsMeta.positions[elementIndex],
            });
        }
        scrollCoordinates = apiRef.current.unstable_applyPipeProcessors('scrollToIndexes', scrollCoordinates, params);
        if (typeof scrollCoordinates.left !== undefined ||
            typeof scrollCoordinates.top !== undefined) {
            apiRef.current.scroll(scrollCoordinates);
            return true;
        }
        return false;
    }, [logger, apiRef, virtualScrollerRef, props.pagination, visibleSortedRows]);
    var scroll = React.useCallback(function (params) {
        if (virtualScrollerRef.current && params.left !== undefined && colRef.current) {
            var direction = isRtl ? -1 : 1;
            colRef.current.scrollLeft = params.left;
            virtualScrollerRef.current.scrollLeft = direction * params.left;
            logger.debug("Scrolling left: ".concat(params.left));
        }
        if (virtualScrollerRef.current && params.top !== undefined) {
            virtualScrollerRef.current.scrollTop = params.top;
            logger.debug("Scrolling top: ".concat(params.top));
        }
        logger.debug("Scrolling, updating container, and viewport");
    }, [virtualScrollerRef, isRtl, colRef, logger]);
    var getScrollPosition = React.useCallback(function () {
        if (!(virtualScrollerRef === null || virtualScrollerRef === void 0 ? void 0 : virtualScrollerRef.current)) {
            return { top: 0, left: 0 };
        }
        return {
            top: virtualScrollerRef.current.scrollTop,
            left: virtualScrollerRef.current.scrollLeft,
        };
    }, [virtualScrollerRef]);
    var scrollApi = {
        scroll: scroll,
        scrollToIndexes: scrollToIndexes,
        getScrollPosition: getScrollPosition,
    };
    (0, useGridApiMethod_1.useGridApiMethod)(apiRef, scrollApi, 'public');
};
exports.useGridScroll = useGridScroll;
