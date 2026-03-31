import { Rowspan } from '@mui/x-virtualizer';
import { gridFilteredSortedRowIdsSelector } from '../filter/gridFilterSelector';
export const getLeftColumnIndex = ({ currentColIndex, firstColIndex, lastColIndex, isRtl, }) => {
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
export const getRightColumnIndex = ({ currentColIndex, firstColIndex, lastColIndex, isRtl, }) => {
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
export function findNonRowSpannedCell(apiRef, rowId, colIndex, rowSpanScanDirection) {
    const rowSpanHiddenCells = Rowspan.selectors.hiddenCells(apiRef.current.virtualizer.store.state);
    if (!rowSpanHiddenCells[rowId]?.[colIndex]) {
        return rowId;
    }
    const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef);
    // find closest non row spanned cell in the given `rowSpanScanDirection`
    let nextRowIndex = filteredSortedRowIds.indexOf(rowId) + (rowSpanScanDirection === 'down' ? 1 : -1);
    while (nextRowIndex >= 0 && nextRowIndex < filteredSortedRowIds.length) {
        const nextRowId = filteredSortedRowIds[nextRowIndex];
        if (!rowSpanHiddenCells[nextRowId]?.[colIndex]) {
            return nextRowId;
        }
        nextRowIndex += rowSpanScanDirection === 'down' ? 1 : -1;
    }
    return rowId;
}
