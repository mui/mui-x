import { GridRowId } from '../gridRows';
import { MuiBaseEvent } from '../muiEvent';

export interface GridFocusApi {
  /**
   * Sets the focus to the cell at the given `id` and `field`.
   * @param {GridRowId} id The row id.
   * @param {string} field The column field.
   */
  setCellFocus: (id: GridRowId, field: string) => void;
  /**
   * Sets the focus to the column header at the given `field`.
   * @param {string} field The column field.
   * @param {string} event The event that triggers the action.
   */
  setColumnHeaderFocus: (field: string, event?: MuiBaseEvent) => void;
  /**
   * Moves the focus to the cell situated at the given direction.
   * If field is the last and direction=right, the focus goes to the next row.
   * If field is the first and direction=left, the focus goes to the previous row.
   * @param {GridRowId} id The base row id.
   * @param {string} field The base column field.
   * @param {'below' | 'right' | 'left'} direction Which direction is the next cell to focus.
   * @ignore - do not document.
   */
  unstable_moveFocusToRelativeCell: (
    id: GridRowId,
    field: string,
    direction: 'below' | 'right' | 'left',
  ) => void;
}
