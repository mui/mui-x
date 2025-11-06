"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Colspan = void 0;
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var selectors = {};
exports.Colspan = {
    initialize: initializeState,
    use: useColspan,
    selectors: selectors,
};
function initializeState(_params) {
    return {
        colspanMap: new Map(),
    };
}
function useColspan(store, params, api) {
    var _a;
    var getColspan = (_a = params.colspan) === null || _a === void 0 ? void 0 : _a.getColspan;
    var resetColSpan = function () {
        store.state.colspanMap = new Map();
    };
    var getCellColSpanInfo = function (rowId, columnIndex) {
        var _a;
        return (_a = store.state.colspanMap.get(rowId)) === null || _a === void 0 ? void 0 : _a[columnIndex];
    };
    // Calculate `colSpan` for each cell in the row
    var calculateColSpan = (0, useEventCallback_1.default)(getColspan
        ? function (rowId, minFirstColumn, maxLastColumn, columns) {
            for (var i = minFirstColumn; i < maxLastColumn; i += 1) {
                var cellProps = calculateCellColSpan(store.state.colspanMap, i, rowId, minFirstColumn, maxLastColumn, columns, getColspan);
                if (cellProps.colSpan > 1) {
                    i += cellProps.colSpan - 1;
                }
            }
        }
        : function () { });
    api.calculateColSpan = calculateColSpan;
    return {
        resetColSpan: resetColSpan,
        getCellColSpanInfo: getCellColSpanInfo,
        calculateColSpan: calculateColSpan,
    };
}
function calculateCellColSpan(lookup, columnIndex, rowId, minFirstColumnIndex, maxLastColumnIndex, columns, getColspan) {
    var columnsLength = columns.length;
    var column = columns[columnIndex];
    var colSpan = getColspan(rowId, column, columnIndex);
    if (!colSpan || colSpan === 1) {
        setCellColSpanInfo(lookup, rowId, columnIndex, {
            spannedByColSpan: false,
            cellProps: {
                colSpan: 1,
                width: column.computedWidth,
            },
        });
        return { colSpan: 1 };
    }
    var width = column.computedWidth;
    for (var j = 1; j < colSpan; j += 1) {
        var nextColumnIndex = columnIndex + j;
        // Cells should be spanned only within their column section (left-pinned, right-pinned and unpinned).
        if (nextColumnIndex >= minFirstColumnIndex && nextColumnIndex < maxLastColumnIndex) {
            var nextColumn = columns[nextColumnIndex];
            width += nextColumn.computedWidth;
            setCellColSpanInfo(lookup, rowId, columnIndex + j, {
                spannedByColSpan: true,
                rightVisibleCellIndex: Math.min(columnIndex + colSpan, columnsLength - 1),
                leftVisibleCellIndex: columnIndex,
            });
        }
        setCellColSpanInfo(lookup, rowId, columnIndex, {
            spannedByColSpan: false,
            cellProps: { colSpan: colSpan, width: width },
        });
    }
    return { colSpan: colSpan };
}
function setCellColSpanInfo(colspanMap, rowId, columnIndex, cellColSpanInfo) {
    var columnInfo = colspanMap.get(rowId);
    if (!columnInfo) {
        columnInfo = {};
        colspanMap.set(rowId, columnInfo);
    }
    columnInfo[columnIndex] = cellColSpanInfo;
}
