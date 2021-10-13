import { createSelector } from 'reselect';
import { GridState } from '../../../models/gridState';
import { gridSortedVisibleRowEntriesSelector } from '../filter/gridFilterSelector';
import { GridPaginationState } from './gridPaginationState';

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
  gridSortedVisibleRowEntriesSelector,
  (pagination, visibleSortedRows) => {
    const firstSelectedRowIndex = pagination.page * pagination.pageSize;
    const lastSelectedRowIndex = firstSelectedRowIndex + pagination.pageSize;

    return visibleSortedRows.slice(firstSelectedRowIndex, lastSelectedRowIndex);
  },
);
