import { createSelector, createSelectorMemoized } from '../../../utils/createSelector';
import { gridRowsLookupSelector } from '../rows/gridRowsSelector';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridRowId, GridRowModel } from '../../../models/gridRows';

export const gridRowSelectionStateSelector = (apiRef: React.RefObject<GridApiCommunity>) =>
  apiRef.current.state.rowSelection;

export const selectedGridRowsCountSelector = createSelector(
  gridRowSelectionStateSelector,
  (selection) => selection.length,
);

export const selectedGridRowsSelector = createSelectorMemoized(
  gridRowSelectionStateSelector,
  gridRowsLookupSelector,
  (selectedRows, rowsLookup) =>
    new Map<GridRowId, GridRowModel>(selectedRows.map((id) => [id, rowsLookup[id]])),
);

export const selectedIdsLookupSelector = createSelectorMemoized(
  gridRowSelectionStateSelector,
  (selection) =>
    selection.reduce<Record<GridRowId, GridRowId>>((lookup, rowId) => {
      lookup[rowId] = rowId;
      return lookup;
    }, {}),
);
