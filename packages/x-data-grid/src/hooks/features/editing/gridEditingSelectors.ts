import { createSelector, createRootSelector } from '../../../utils/createSelector';
import { GridRowId } from '../../../models/gridRows';
import { GridEditModes, GridEditMode } from '../../../models/gridEditRowModel';
import { GridStateCommunity } from '../../../models/gridStateCommunity';
/**
 * Select the row editing state.
 */
export const gridEditRowsStateSelector = createRootSelector(
  (state: GridStateCommunity) => state.editRows,
);

export const gridRowIsEditingSelector = createSelector(
  gridEditRowsStateSelector,
  (editRows, { rowId, editMode }: { rowId: GridRowId; editMode: GridEditMode }) =>
    editMode === GridEditModes.Row && Boolean(editRows[rowId]),
);

export const gridEditCellStateSelector = createSelector(
  gridEditRowsStateSelector,
  (
    editRows,
    {
      rowId,
      field,
    }: {
      rowId: GridRowId;
      field: string;
    },
  ) => editRows[rowId]?.[field] ?? null,
);
