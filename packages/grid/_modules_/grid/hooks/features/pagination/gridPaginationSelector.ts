import { createSelector } from 'reselect';
import { GridPaginationState } from './gridPaginationState';
import { GridState } from '../core/gridState';
import { GridRowId } from '../../../models/gridRows';
import { visibleSortedGridRowIdsSelector } from '../filter/gridFilterSelector';

export const gridPaginationSelector = (state: any): GridPaginationState => state.pagination;

export const gridPaginatedVisibleSortedGridRowIdsSelector = createSelector<
  GridState,
  GridPaginationState,
  GridRowId[],
  GridRowId[]
>(gridPaginationSelector, visibleSortedGridRowIdsSelector, (paginationState, visibleSortedRows) => {
  const firstSelectedRowIndex = paginationState.page * paginationState.pageSize;
  const lastSelectedRowIndex = firstSelectedRowIndex + paginationState.pageSize;

  return visibleSortedRows.slice(firstSelectedRowIndex, lastSelectedRowIndex);
});
