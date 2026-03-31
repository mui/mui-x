import { gridRowNodeSelector } from '@mui/x-data-grid';
/**
 * Adjusts the row fetch parameters to align with page boundaries.
 * - Start index is decreased to the start of the page
 * - End index is increased to the end of the page (capped by rowCount - 1 if defined)
 */
export const adjustRowParams = (params, options) => {
    if (typeof params.start !== 'number') {
        return params;
    }
    const { pageSize, rowCount } = options;
    const adjustedStart = params.start - (params.start % pageSize);
    const pageAlignedEnd = params.end + pageSize - (params.end % pageSize) - 1;
    // rowCount of -1 means "unknown/infinite", treat same as undefined (no capping)
    const maxEnd = rowCount !== undefined && rowCount !== -1 ? Math.max(0, rowCount - 1) : Infinity;
    return {
        ...params,
        start: adjustedStart,
        end: Math.min(maxEnd, pageAlignedEnd),
    };
};
export const findSkeletonRowsSection = ({ apiRef, visibleRows, range, }) => {
    let { firstRowIndex, lastRowIndex } = range;
    const visibleRowsSection = visibleRows.slice(range.firstRowIndex, range.lastRowIndex);
    let startIndex = 0;
    let endIndex = visibleRowsSection.length - 1;
    let isSkeletonSectionFound = false;
    while (!isSkeletonSectionFound && firstRowIndex < lastRowIndex) {
        const isStartingWithASkeletonRow = gridRowNodeSelector(apiRef, visibleRowsSection[startIndex].id)?.type === 'skeletonRow';
        const isEndingWithASkeletonRow = gridRowNodeSelector(apiRef, visibleRowsSection[endIndex].id)?.type === 'skeletonRow';
        if (isStartingWithASkeletonRow && isEndingWithASkeletonRow) {
            isSkeletonSectionFound = true;
        }
        if (!isStartingWithASkeletonRow) {
            startIndex += 1;
            firstRowIndex += 1;
        }
        if (!isEndingWithASkeletonRow) {
            endIndex -= 1;
            lastRowIndex -= 1;
        }
    }
    return isSkeletonSectionFound
        ? {
            firstRowIndex,
            lastRowIndex,
        }
        : undefined;
};
