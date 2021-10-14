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

export const gridSortedVisiblePaginatedRowEntriesSelector = createSelector(
  gridPaginationSelector,
  gridRowTreeSelector,
  gridSortedVisibleRowEntriesSelector,
  gridSortedVisibleTopLevelRowEntriesSelector,
  (pagination, rowTree, visibleSortedRowEntries, visibleSortedTopLevelRowEntries) => {
    const topLevelRowStart = pagination.pageSize * pagination.page;
    const topLevelRowsInCurrentPage = visibleSortedTopLevelRowEntries.slice(
      topLevelRowStart,
      topLevelRowStart + pagination.pageSize,
    );

    const rowStart = visibleSortedRowEntries.findIndex(
      (row) => row.id === visibleSortedTopLevelRowEntries[topLevelRowStart].id,
    );
    let rowEnd = rowStart + 1;
    let topLevelRowCount = 1;

    while (
      rowEnd < visibleSortedRowEntries.length &&
      topLevelRowCount <= topLevelRowsInCurrentPage.length
    ) {
      rowEnd += 1;

      if (rowEnd < visibleSortedRowEntries.length) {
        const row = visibleSortedRowEntries[rowEnd];
        const depth = rowTree[row.id].depth;

        if (depth === 0) {
          topLevelRowCount += 1;
        }
      }
    }

    return visibleSortedRowEntries.slice(rowStart, rowEnd);
  },
);
