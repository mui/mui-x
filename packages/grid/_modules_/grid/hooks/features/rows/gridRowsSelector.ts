import { createSelector } from 'reselect';
import { GridState } from '../core/gridState';
import { GridRowsState } from './gridRowsState';

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
