import { createSelector } from 'reselect';
import { GridState } from '../../../models/gridState';
import {
  gridSortedVisibleRowEntriesSelector,
  gridSortedVisibleTopLevelRowEntriesSelector,
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
  gridSortedVisibleRowEntriesSelector,
  gridSortedVisibleTopLevelRowEntriesSelector,
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

    if (topLevelFirstRowIndex === -1 || topLevelLastRowIndex === -1) {
      return null;
    }

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

export const gridSortedVisiblePaginatedRowEntriesSelector = createSelector(
  gridSortedVisibleRowEntriesSelector,
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
