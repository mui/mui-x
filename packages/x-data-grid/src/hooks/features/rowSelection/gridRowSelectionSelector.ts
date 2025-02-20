import {
  createSelector,
  createRootSelector,
  createSelectorMemoized,
} from '../../../utils/createSelector';
import { gridDataRowIdsSelector, gridRowsLookupSelector } from '../rows/gridRowsSelector';
import { GridStateCommunity } from '../../../models/gridStateCommunity';
import { GridRowId, GridRowModel } from '../../../models/gridRows';
import { gridFilteredRowCountSelector } from '../filter/gridFilterSelector';
import { createRowSelectionManager } from '../../../models/gridRowSelectionManager';

export const gridRowSelectionStateSelector = createRootSelector(
  (state: GridStateCommunity) => state.rowSelection,
);

export const gridRowSelectionManagerSelector = createSelectorMemoized(
  gridRowSelectionStateSelector,
  createRowSelectionManager,
);

export const selectedGridRowsCountSelector = createSelector(
  gridRowSelectionStateSelector,
  gridFilteredRowCountSelector,
  (selection, filteredRowCount) => {
    if (selection.type === 'include') {
      return selection.ids.size;
    }
    // In exclude selection, all rows are selectable.
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
      for (const id of selectionModel.ids) {
        map.set(id, rowsLookup[id]);
      }
    } else {
      for (let i = 0; i < rowIds.length; i += 1) {
        const id = rowIds[i];
        if (!selectionModel.ids.has(id)) {
          map.set(id, rowsLookup[id]);
        }
      }
    }

    return map;
  },
);
