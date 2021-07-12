import { createSelector } from 'reselect';
import { GridState } from '../core/gridState';
import { GridRowId } from '../../../models/gridRows';
import { visibleSortedGridRowIdsSelector } from '../filter/gridFilterSelector';
import { GridPageState, GridPageSizeState } from './gridPaginationState';

export const gridPageSelector = (state: any): GridPageState => state.page;

export const gridPageSizeSelector = (state: any): GridPageSizeState => state.pageSize;

export const gridPaginatedVisibleSortedGridRowIdsSelector = createSelector<
  GridState,
  GridPageState,
  GridPageSizeState,
  GridRowId[],
  GridRowId[]
>(
  gridPageSelector,
  gridPageSizeSelector,
  visibleSortedGridRowIdsSelector,
  (pageState, pageSize, visibleSortedRows) => {
    const firstSelectedRowIndex = pageState.currentPage * pageSize;
    const lastSelectedRowIndex = firstSelectedRowIndex + pageSize;

    return visibleSortedRows.slice(firstSelectedRowIndex, lastSelectedRowIndex);
  },
);
