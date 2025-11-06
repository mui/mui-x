"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCellValue = void 0;
exports.getUnprocessedRange = getUnprocessedRange;
exports.isRowContextInitialized = isRowContextInitialized;
exports.isRowRangeUpdated = isRowRangeUpdated;
function getUnprocessedRange(testRange, processedRange) {
    if (testRange.firstRowIndex >= processedRange.firstRowIndex &&
        testRange.lastRowIndex <= processedRange.lastRowIndex) {
        return null;
    }
    // Overflowing at the end
    // Example: testRange={ firstRowIndex: 10, lastRowIndex: 20 }, processedRange={ firstRowIndex: 0, lastRowIndex: 15 }
    // Unprocessed Range={ firstRowIndex: 16, lastRowIndex: 20 }
    if (testRange.firstRowIndex >= processedRange.firstRowIndex &&
        testRange.lastRowIndex > processedRange.lastRowIndex) {
        return { firstRowIndex: processedRange.lastRowIndex, lastRowIndex: testRange.lastRowIndex };
    }
    // Overflowing at the beginning
    // Example: testRange={ firstRowIndex: 0, lastRowIndex: 20 }, processedRange={ firstRowIndex: 16, lastRowIndex: 30 }
    // Unprocessed Range={ firstRowIndex: 0, lastRowIndex: 15 }
    if (testRange.firstRowIndex < processedRange.firstRowIndex &&
        testRange.lastRowIndex <= processedRange.lastRowIndex) {
        return {
            firstRowIndex: testRange.firstRowIndex,
            lastRowIndex: processedRange.firstRowIndex - 1,
        };
    }
    // TODO: Should return two ranges handle overflowing at both ends ?
    return testRange;
}
function isRowContextInitialized(renderContext) {
    return renderContext.firstRowIndex !== 0 || renderContext.lastRowIndex !== 0;
}
function isRowRangeUpdated(range1, range2) {
    return (range1.firstRowIndex !== range2.firstRowIndex || range1.lastRowIndex !== range2.lastRowIndex);
}
var getCellValue = function (row, colDef, apiRef) {
    var _a;
    if (!row) {
        return null;
    }
    var cellValue = row[colDef.field];
    var valueGetter = (_a = colDef.rowSpanValueGetter) !== null && _a !== void 0 ? _a : colDef.valueGetter;
    if (valueGetter) {
        cellValue = valueGetter(cellValue, row, colDef, apiRef);
    }
    return cellValue;
};
exports.getCellValue = getCellValue;
