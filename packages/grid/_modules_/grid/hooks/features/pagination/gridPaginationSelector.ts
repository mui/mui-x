import { createSelector } from 'reselect';
import { GridState } from '../../../models/gridState';
import {
  gridVisibleSortedRowEntriesSelector,
  gridVisibleSortedRowIdsSelector,
  gridVisibleSortedTopLevelRowEntriesSelector,
} from '../filter/gridFilterSelector';
import { GridPaginationState } from './gridPaginationState';
import { gridRowTreeDepthSelector, gridRowTreeSelector } from '../rows/gridRowsSelector';

export const gridPaginationSelector = (state: GridState): GridPaginationState => state.pagination;

export const gridPageSelector = createSelector(
  gridPaginationSelector,
  (pagination) => pagination.page,
);

export const gridPageSizeSelector = createSelector(
  gridPaginationSelector,
  (pagination) => pagination.pageSize,
);

export const gridPaginationRowRangeSelector = createSelector(
  gridPaginationSelector,
  gridRowTreeSelector,
  gridRowTreeDepthSelector,
  gridVisibleSortedRowEntriesSelector,
  gridVisibleSortedTopLevelRowEntriesSelector,
  (pagination, rowTree, rowTreeDepth, visibleSortedRowEntries, visibleSortedTopLevelRowEntries) => {
    const visibleTopLevelRowCount = visibleSortedTopLevelRowEntries.length;
    const topLevelFirstRowIndex = Math.min(
      pagination.pageSize * pagination.page,
      visibleTopLevelRowCount - 1,
    );
    const topLevelLastRowIndex = Math.min(
      topLevelFirstRowIndex + pagination.pageSize - 1,
      visibleTopLevelRowCount - 1,
    );

    // The range contains no element
    if (topLevelFirstRowIndex === -1 || topLevelLastRowIndex === -1) {
      return null;
    }

    // The tree is flat, their is no need to look for children
    if (rowTreeDepth < 2) {
      return { firstRowIndex: topLevelFirstRowIndex, lastRowIndex: topLevelLastRowIndex };
    }

    const topLevelFirstRow = visibleSortedTopLevelRowEntries[topLevelFirstRowIndex];
    const topLevelRowsInCurrentPageCount = topLevelLastRowIndex - topLevelFirstRowIndex + 1;
    const firstRowIndex = visibleSortedRowEntries.findIndex(
      (row) => row.id === topLevelFirstRow.id,
    );
    let lastRowIndex = firstRowIndex;
    let topLevelRowAdded = 0;

    while (
      lastRowIndex < visibleSortedRowEntries.length &&
      topLevelRowAdded <= topLevelRowsInCurrentPageCount
    ) {
      const row = visibleSortedRowEntries[lastRowIndex];
      const depth = rowTree[row.id].depth;

      if (topLevelRowAdded < topLevelRowsInCurrentPageCount || depth > 0) {
        lastRowIndex += 1;
      }

      if (depth === 0) {
        topLevelRowAdded += 1;
      }
    }

    return { firstRowIndex, lastRowIndex: lastRowIndex - 1 };
  },
);

export const gridPaginatedVisibleSortedGridRowEntriesSelector = createSelector(
  gridVisibleSortedRowEntriesSelector,
  gridPaginationRowRangeSelector,
  (visibleSortedRowEntries, paginationRange) => {
    if (!paginationRange) {
      return [];
    }

    return visibleSortedRowEntries.slice(
      paginationRange.firstRowIndex,
      paginationRange.lastRowIndex + 1,
    );
  },
);

export const gridPaginatedVisibleSortedGridRowIdsSelector = createSelector(
  gridVisibleSortedRowIdsSelector,
  gridPaginationRowRangeSelector,
  (visibleSortedRowIds, paginationRange) => {
    if (!paginationRange) {
      return [];
    }

    return visibleSortedRowIds.slice(
      paginationRange.firstRowIndex,
      paginationRange.lastRowIndex + 1,
    );
  },
);
