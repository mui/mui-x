import { getRowValue } from './gridRowsUtils';
export function getUnprocessedRange(testRange, processedRange) {
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
export function isRowContextInitialized(renderContext) {
    return renderContext.firstRowIndex !== 0 || renderContext.lastRowIndex !== 0;
}
export function isRowRangeUpdated(range1, range2) {
    return (range1.firstRowIndex !== range2.firstRowIndex || range1.lastRowIndex !== range2.lastRowIndex);
}
export const getCellValue = (row, colDef, apiRef) => {
    if (!row) {
        return null;
    }
    const cellValue = row[colDef.field];
    if (colDef.rowSpanValueGetter) {
        return colDef.rowSpanValueGetter(cellValue, row, colDef, apiRef);
    }
    // This util is also called during the state initialization
    // Use util method directly instead of calling apiRef.current.getRowValue
    return getRowValue(row, colDef, apiRef);
};
