import { createSelector } from 'reselect';
import { RowModel } from '../../../models/rows';
import { GridState } from '../core/gridState';
import { sortedRowsSelector } from '../sorting/sortingSelector';
import { VisibleRowsState } from './visibleRowsState';

export const visibleRowsStateSelector = (state: GridState) => state.visibleRows;

export const visibleSortedRowsSelector = createSelector<
  GridState,
  VisibleRowsState,
  RowModel[],
  RowModel[]
>(visibleRowsStateSelector, sortedRowsSelector, (visibleRowsState, sortedRows: RowModel[]) => {
  return [...sortedRows].filter((row) => visibleRowsState.visibleRowsLookup[row.id] !== false);
});

export const visibleRowCountSelector = createSelector<GridState, RowModel[], number>(
  visibleSortedRowsSelector,
  (rows) => rows.length,
);
