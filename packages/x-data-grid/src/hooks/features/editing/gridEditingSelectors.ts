import { createSelector } from '../../../utils/createSelector';
import { GridRowId } from '../../../models/gridRows';
import { GridEditModes, GridEditMode } from '../../../models/gridEditRowModel';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';

/**
 * Select the row editing state.
 */
export const gridEditRowsStateSelector = (apiRef: React.RefObject<GridApiCommunity>) =>
  apiRef.current.state.editRows;

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
