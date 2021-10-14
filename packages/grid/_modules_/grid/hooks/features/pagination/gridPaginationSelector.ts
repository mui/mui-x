import { createSelector } from 'reselect';
import { GridState } from '../../../models/gridState';
import {
  gridSortedVisibleRowEntriesSelector,
  gridSortedVisibleTopLevelRowEntriesSelector,
} from '../filter/gridFilterSelector';
import { GridPaginationState } from './gridPaginationState';
import { gridRowTreeSelector } from '../rows/gridRowsSelector';

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
  gridSortedVisibleRowEntriesSelector,
  gridSortedVisibleTopLevelRowEntriesSelector,
  (pagination, rowTree, visibleSortedRowEntries, visibleSortedTopLevelRowEntries) => {
    const topLevelFirstRowIndex = pagination.pageSize * pagination.page;
    const topLevelFirstRow = visibleSortedTopLevelRowEntries[topLevelFirstRowIndex];

    if (!topLevelFirstRow) {
      return null;
    }

    const topLevelInCurrentPageCount = visibleSortedTopLevelRowEntries.slice(
      topLevelFirstRowIndex,
      topLevelFirstRowIndex + pagination.pageSize,
    ).length;

    const firstRowIndex = visibleSortedRowEntries.findIndex(
      (row) => row.id === topLevelFirstRow.id,
    );
    let lastRowIndex = firstRowIndex;
    let topLevelRowAdded = 0;

    while (
      lastRowIndex < visibleSortedRowEntries.length &&
      topLevelRowAdded <= topLevelInCurrentPageCount
    ) {
      const row = visibleSortedRowEntries[lastRowIndex];
      const depth = rowTree[row.id].depth;

      if (topLevelRowAdded < topLevelInCurrentPageCount || depth > 0) {
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
