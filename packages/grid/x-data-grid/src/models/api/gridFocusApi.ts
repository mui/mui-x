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
}
