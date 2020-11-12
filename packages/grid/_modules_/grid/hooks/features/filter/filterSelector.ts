import { createSelector } from 'reselect';
import { RowModel } from '../../../models/rows';
import { GridState } from '../core/gridState';
import { sortedRowsSelector } from '../sorting/sortingSelector';
import { HiddenRowsState } from './hiddenRowsState';

export const filterStateSelector = (state: GridState) => state.filter;

export const visibleSortedRowsSelector = createSelector<
  GridState,
  // HiddenRowsState,
  RowModel[],
  RowModel[]
>(sortedRowsSelector, (sortedRows: RowModel[]) => {
  const visibleRows = [...sortedRows];
  // .filter(
  // (row) => filterState.hiddenRows.indexOf(row.id) === -1,
  // );
  return visibleRows;
});

export const visibleRowCountSelector = createSelector<GridState, RowModel[], number>(
  visibleSortedRowsSelector,
  (rows) => rows.length,
);
