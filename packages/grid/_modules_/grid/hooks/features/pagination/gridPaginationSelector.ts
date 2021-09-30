import { createSelector } from 'reselect';
import { GridState } from '../core/gridState';
import { gridSortedVisibleRowsAsArrayFlatSelector } from '../filter/gridFilterSelector';
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

export const gridSortedVisiblePaginatedRowsAsArrayFlatSelector = createSelector(
  gridPaginationSelector,
  gridSortedVisibleRowsAsArrayFlatSelector,
  (pagination, visibleSortedRows) => {
    const firstSelectedRowIndex = pagination.page * pagination.pageSize;
    const lastSelectedRowIndex = firstSelectedRowIndex + pagination.pageSize;

    return visibleSortedRows.slice(firstSelectedRowIndex, lastSelectedRowIndex);
  },
);
