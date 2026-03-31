import useEventCallback from '@mui/utils/useEventCallback';
const selectors = {};
export const Colspan = {
    initialize: initializeState,
    use: useColspan,
    selectors,
};
function initializeState(_params) {
    return {
        colspanMap: new Map(),
    };
}
function useColspan(store, params, api) {
    const getColspan = params.colspan?.getColspan;
    const resetColSpan = () => {
        store.state.colspanMap = new Map();
    };
    const getCellColSpanInfo = (rowId, columnIndex) => {
        return store.state.colspanMap.get(rowId)?.[columnIndex];
    };
    // Calculate `colSpan` for each cell in the row
    const calculateColSpan = useEventCallback(getColspan
        ? (rowId, minFirstColumn, maxLastColumn, columns) => {
            for (let i = minFirstColumn; i < maxLastColumn; i += 1) {
                const cellProps = calculateCellColSpan(store.state.colspanMap, i, rowId, minFirstColumn, maxLastColumn, columns, getColspan);
                if (cellProps.colSpan > 1) {
                    i += cellProps.colSpan - 1;
                }
            }
        }
        : () => { });
    api.calculateColSpan = calculateColSpan;
    return {
        resetColSpan,
        getCellColSpanInfo,
        calculateColSpan,
    };
}
function calculateCellColSpan(lookup, columnIndex, rowId, minFirstColumnIndex, maxLastColumnIndex, columns, getColspan) {
    const columnsLength = columns.length;
    const column = columns[columnIndex];
    const colSpan = getColspan(rowId, column, columnIndex);
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
    let width = column.computedWidth;
    for (let j = 1; j < colSpan; j += 1) {
        const nextColumnIndex = columnIndex + j;
        // Cells should be spanned only within their column section (left-pinned, right-pinned and unpinned).
        if (nextColumnIndex >= minFirstColumnIndex && nextColumnIndex < maxLastColumnIndex) {
            const nextColumn = columns[nextColumnIndex];
            width += nextColumn.computedWidth;
            setCellColSpanInfo(lookup, rowId, columnIndex + j, {
                spannedByColSpan: true,
                rightVisibleCellIndex: Math.min(columnIndex + colSpan, columnsLength - 1),
                leftVisibleCellIndex: columnIndex,
            });
        }
        setCellColSpanInfo(lookup, rowId, columnIndex, {
            spannedByColSpan: false,
            cellProps: { colSpan, width },
        });
    }
    return { colSpan };
}
function setCellColSpanInfo(colspanMap, rowId, columnIndex, cellColSpanInfo) {
    let columnInfo = colspanMap.get(rowId);
    if (!columnInfo) {
        columnInfo = {};
        colspanMap.set(rowId, columnInfo);
    }
    columnInfo[columnIndex] = cellColSpanInfo;
}
