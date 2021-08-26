import { createSelector } from 'reselect';
import { gridRowsLookupSelector } from '../rows/gridRowsSelector';
import { GridState } from '../core/gridState';
import { GridRowId, GridRowModel } from '../../../models/gridRows';

export const gridSelectionStateSelector = (state: GridState) => state.selection;

export const selectedGridRowsCountSelector = createSelector(
  gridSelectionStateSelector,
  (selection) => selection.length,
);

export const selectedGridRowsSelector = createSelector(
  gridSelectionStateSelector,
  gridRowsLookupSelector,
  (selectedRows, rowsLookup) =>
    new Map<GridRowId, GridRowModel>(selectedRows.map((id) => [id, rowsLookup[id]])),
);

export const selectedIdsLookupSelector = createSelector(gridSelectionStateSelector, (selection) => new Map<GridRowId, true>(selection.map(el => [el, true])))
