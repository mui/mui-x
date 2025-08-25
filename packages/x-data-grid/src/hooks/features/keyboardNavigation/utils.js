"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRightColumnIndex = exports.getLeftColumnIndex = void 0;
exports.findNonRowSpannedCell = findNonRowSpannedCell;
var x_virtualizer_1 = require("@mui/x-virtualizer");
var gridFilterSelector_1 = require("../filter/gridFilterSelector");
var getLeftColumnIndex = function (_a) {
    var currentColIndex = _a.currentColIndex, firstColIndex = _a.firstColIndex, lastColIndex = _a.lastColIndex, isRtl = _a.isRtl;
    if (isRtl) {
        if (currentColIndex < lastColIndex) {
            return currentColIndex + 1;
        }
    }
    else if (!isRtl) {
        if (currentColIndex > firstColIndex) {
            return currentColIndex - 1;
        }
    }
    return null;
};
exports.getLeftColumnIndex = getLeftColumnIndex;
var getRightColumnIndex = function (_a) {
    var currentColIndex = _a.currentColIndex, firstColIndex = _a.firstColIndex, lastColIndex = _a.lastColIndex, isRtl = _a.isRtl;
    if (isRtl) {
        if (currentColIndex > firstColIndex) {
            return currentColIndex - 1;
        }
    }
    else if (!isRtl) {
        if (currentColIndex < lastColIndex) {
            return currentColIndex + 1;
        }
    }
    return null;
};
exports.getRightColumnIndex = getRightColumnIndex;
function findNonRowSpannedCell(apiRef, rowId, colIndex, rowSpanScanDirection) {
    var _a, _b;
    var rowSpanHiddenCells = x_virtualizer_1.Rowspan.selectors.hiddenCells(apiRef.current.virtualizer.store.state);
    if (!((_a = rowSpanHiddenCells[rowId]) === null || _a === void 0 ? void 0 : _a[colIndex])) {
        return rowId;
    }
    var filteredSortedRowIds = (0, gridFilterSelector_1.gridFilteredSortedRowIdsSelector)(apiRef);
    // find closest non row spanned cell in the given `rowSpanScanDirection`
    var nextRowIndex = filteredSortedRowIds.indexOf(rowId) + (rowSpanScanDirection === 'down' ? 1 : -1);
    while (nextRowIndex >= 0 && nextRowIndex < filteredSortedRowIds.length) {
        var nextRowId = filteredSortedRowIds[nextRowIndex];
        if (!((_b = rowSpanHiddenCells[nextRowId]) === null || _b === void 0 ? void 0 : _b[colIndex])) {
            return nextRowId;
        }
        nextRowIndex += rowSpanScanDirection === 'down' ? 1 : -1;
    }
    return rowId;
}
