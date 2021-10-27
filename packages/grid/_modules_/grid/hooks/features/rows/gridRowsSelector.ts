import { createSelector } from 'reselect';
import { GridState } from '../../../models/gridState';
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

export const gridRowIdsSelector = createSelector(
  gridRowsStateSelector,
  (rows: GridRowsState) => rows.allRows,
);
