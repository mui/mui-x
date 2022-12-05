import { createSelector } from '../../../utils/createSelector';
import { gridRowsLookupSelector } from '../rows/gridRowsSelector';
import { GridStateCommunity } from '../../../models/gridStateCommunity';
import { GridRowId, GridRowModel } from '../../../models/gridRows';

export const gridRowSelectionStateSelector = (state: GridStateCommunity) => state.rowSelection;

export const selectedGridRowsCountSelector = createSelector(
  gridRowSelectionStateSelector,
  (selection) => selection.length,
);

export const selectedGridRowsSelector = createSelector(
  gridRowSelectionStateSelector,
  gridRowsLookupSelector,
  (selectedRows, rowsLookup) =>
    new Map<GridRowId, GridRowModel>(selectedRows.map((id) => [id, rowsLookup[id]])),
);

export const selectedIdsLookupSelector = createSelector(
  gridRowSelectionStateSelector,
  (selection) =>
    selection.reduce<Record<GridRowId, GridRowId>>((lookup, rowId) => {
      lookup[rowId] = rowId;
      return lookup;
    }, {}),
);
