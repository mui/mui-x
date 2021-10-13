import { createSelector } from 'reselect';
import { GridRowId, GridRowModel } from '../../../models/gridRows';
import { GridState } from '../../../models/gridState';
import { GridRowsState } from './gridRowsState';

export type GridRowsLookup = Record<GridRowId, GridRowModel>;

export const gridRowsStateSelector = (state: GridState) => state.rows;

export const gridRowCountSelector = createSelector(
  gridRowsStateSelector,
  (rows: GridRowsState) => rows.totalRowCount,
);

export const gridRowsLookupSelector = createSelector(
  gridRowsStateSelector,
  (rows: GridRowsState) => rows.idRowsLookup,
);

export const unorderedGridRowIdsSelector = createSelector(
  gridRowsStateSelector,
  (rows: GridRowsState) => rows.allRows,
);

export const unorderedGridRowModelsSelector = createSelector(
  gridRowsStateSelector,
  (rows: GridRowsState) => rows.allRows.map((id) => rows.idRowsLookup[id]),
);
