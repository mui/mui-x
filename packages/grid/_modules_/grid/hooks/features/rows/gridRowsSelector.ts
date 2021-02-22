import { createSelector } from 'reselect';
import { GridRowId, GridRowModel } from '../../../models/gridRows';
import { GridState } from '../core/gridState';
import { InternalGridRowsState } from './gridRowsState';

export type GridRowsLookup = Record<GridRowId, GridRowModel>;

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
  GridRowModel[]
>(gridRowsStateSelector, (rows: InternalGridRowsState) =>
  rows.allRows.map((id) => rows.idRowsLookup[id]),
);
