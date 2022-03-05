import { createSelector } from '../../../utils/createSelector';
import { gridRowsLookupSelector } from '../rows/gridRowsSelector';
import { GridStateCommunity } from '../../../models/gridStateCommunity';
import { GridRowId, GridRowModel } from '../../../models/gridRows';

export const gridSelectionStateSelector = (state: GridStateCommunity) => state.selection;

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

export const selectedIdsLookupSelector = createSelector(gridSelectionStateSelector, (selection) =>
  selection.reduce<Record<GridRowId, GridRowId>>((lookup, rowId) => {
    lookup[rowId] = rowId;
    return lookup;
  }, {}),
);
