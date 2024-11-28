import { createSelector, createSelectorMemoized } from '../../../utils/createSelector';
import { gridDataRowIdsSelector, gridRowsLookupSelector } from '../rows/gridRowsSelector';
import { GridStateCommunity } from '../../../models/gridStateCommunity';
import { GridRowId, GridRowModel } from '../../../models/gridRows';
import { gridFilteredRowCountSelector } from '../filter/gridFilterSelector';

export const gridRowSelectionStateSelector = (state: GridStateCommunity) => state.rowSelection;

export const selectedGridRowsCountSelector = createSelector(
  gridRowSelectionStateSelector,
  gridFilteredRowCountSelector,
  (selection, filteredRowCount) => {
    if (selection.type === 'include') {
      return selection.ids.size;
    }
    // TODO: is this correct?
    return filteredRowCount - selection.ids.size;
  },
);

export const selectedGridRowsSelector = createSelectorMemoized(
  gridRowSelectionStateSelector,
  gridRowsLookupSelector,
  gridDataRowIdsSelector,
  (selectionModel, rowsLookup, rowIds) => {
    const map = new Map<GridRowId, GridRowModel>();
    if (selectionModel.type === 'include') {
      selectionModel.ids.forEach((id) => {
        map.set(id, rowsLookup[id]);
      });
    } else {
      rowIds.forEach((id) => {
        if (!selectionModel.ids.has(id)) {
          map.set(id, rowsLookup[id]);
        }
      });
    }

    return map;
  },
);
