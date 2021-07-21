import { createSelector } from 'reselect';
import { GridState } from '../core/gridState';
import { GridRowId } from '../../../models/gridRows';
import { visibleSortedGridRowIdsSelector } from '../filter/gridFilterSelector';
import { GridPaginationState } from './gridPaginationState';

export const gridPaginationSelector = (state: any): GridPaginationState => state.pagination;

export const gridPaginatedVisibleSortedGridRowIdsSelector = createSelector<
  GridState,
  GridPaginationState,
  GridRowId[],
  GridRowId[]
>(gridPaginationSelector, visibleSortedGridRowIdsSelector, (pagination, visibleSortedRows) => {
  const firstSelectedRowIndex = pagination.currentPage * pagination.pageSize;
  const lastSelectedRowIndex = firstSelectedRowIndex + pagination.pageSize;

  return visibleSortedRows.slice(firstSelectedRowIndex, lastSelectedRowIndex);
});
