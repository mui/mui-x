import { createSelector } from 'reselect';
import { gridRowsLookupSelector } from '../rows/gridRowsSelector';
import { GridState } from '../core/gridState';
import { GridRowId } from '../../../models/gridRows';

export const gridSelectionStateSelector = (state: GridState) => state.selection;

export const gridArraySelectionStateSelector = (state: GridState) =>
  Array.isArray(state.selection) ? state.selection : [state.selection];

export const selectedGridRowsCountSelector = createSelector(
  gridArraySelectionStateSelector,
  (selection) => selection.length,
);

export const selectedGridRowsSelector = createSelector(
  gridArraySelectionStateSelector,
  gridRowsLookupSelector,
  (selectedRows, rowsLookup) => new Map(selectedRows.map((id) => [id, rowsLookup[id]])),
);

export const selectedIdsLookupSelector = createSelector(
  gridArraySelectionStateSelector,
  (selection) =>
    selection.reduce((lookup, rowId) => {
      lookup[rowId] = rowId;
      return lookup;
    }, {} as Record<string, GridRowId>),
);
