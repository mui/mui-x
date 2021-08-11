import { createSelector } from 'reselect';
import { GridRowId, GridRowModel } from '../../../models/gridRows';
import { GridState } from '../core/gridState';
import { InternalGridRowsState } from './gridRowsState';

export type GridRowsLookup = Record<GridRowId, GridRowModel>;

export const gridRowsStateSelector = (state: GridState) => state.rows;

export const gridRowCountSelector = createSelector(
  gridRowsStateSelector,
  (rows: InternalGridRowsState) => rows && rows.totalRowCount,
);

export const gridRowsLookupSelector = createSelector(
  gridRowsStateSelector,
  (rows: InternalGridRowsState) => rows && rows.idRowsLookup,
);

export const unorderedGridRowIdsSelector = createSelector(
  gridRowsStateSelector,
  (rows: InternalGridRowsState) => rows.allRows,
);

export const unorderedGridRowModelsSelector = createSelector(
  gridRowsStateSelector,
  (rows: InternalGridRowsState) => rows.allRows.map((id) => rows.idRowsLookup[id]),
);
