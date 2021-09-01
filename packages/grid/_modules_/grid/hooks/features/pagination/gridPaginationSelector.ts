import { createSelector } from 'reselect';
import { GridState } from '../core/gridState';
import { visibleSortedGridRowIdsSelector } from '../filter/gridFilterSelector';
import { GridPaginationState } from './gridPaginationState';

export const gridPaginationSelector = (state: GridState): GridPaginationState => state.pagination;

export const gridPaginatedVisibleSortedGridRowIdsSelector = createSelector(
  gridPaginationSelector,
  visibleSortedGridRowIdsSelector,
  (pagination, visibleSortedRows) => {
    const firstSelectedRowIndex = pagination.page * pagination.pageSize;
    const lastSelectedRowIndex = firstSelectedRowIndex + pagination.pageSize;

    return visibleSortedRows.slice(firstSelectedRowIndex, lastSelectedRowIndex);
  },
);
