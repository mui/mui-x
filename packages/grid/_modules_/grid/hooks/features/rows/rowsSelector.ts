import { createSelector } from 'reselect';
import { RowId, RowModel } from '../../../models/rows';
import { GridState } from '../core/gridState';
import { InternalRowsState } from './rowsState';

export const rowsStateSelector = (state: GridState) => state.rows;
export const rowCountSelector = createSelector<GridState, InternalRowsState, number>(
  rowsStateSelector,
  (rows: InternalRowsState) => rows && rows.totalRowCount,
);
export const rowsLookupSelector = createSelector<
  GridState,
  InternalRowsState,
  Record<RowId, RowModel>
>(rowsStateSelector, (rows: InternalRowsState) => rows && rows.idRowsLookup);
export const unorderedRowModelsSelector = createSelector<GridState, InternalRowsState, RowModel[]>(
  rowsStateSelector,
  (rows: InternalRowsState) => rows.allRows.map((id) => rows.idRowsLookup[id]),
);
