import { createSelector } from 'reselect';
import { RowId, RowModel } from '../../../models/rows';
import { GridState } from '../core/gridState';
import { InternalGridRowsState } from './gridRowsState';

export type GridRowsLookup = Record<RowId, RowModel>;

export const gridRowsStateSelector = (state: GridState) => state.rows;
export const gridRowCountSelector = createSelector<GridState, InternalGridRowsState, number>(
  gridRowsStateSelector,
  (rows: InternalGridRowsState) => rows && rows.totalRowCount,
);
export const gridRowsLookupSelector = createSelector<
  GridState,
  InternalGridRowsState,
  GridRowsLookup
>(gridRowsStateSelector, (rows: InternalGridRowsState) => rows && rows.idRowsLookup);
export const unorderedGridRowModelsSelector = createSelector<
  GridState,
  InternalGridRowsState,
  RowModel[]
>(gridRowsStateSelector, (rows: InternalGridRowsState) =>
  rows.allRows.map((id) => rows.idRowsLookup[id]),
);
