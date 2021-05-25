import { GridRowId } from '../gridRows';

export interface GridFocusApi {
  /**
   * Sets the focus to the cell at the given `id` and `field`.
   * @param {GridRowId} id The row id.
   * @param {string} field The field name.
   */
  setCellFocus: (id: GridRowId, field: string) => void;
  /**
   * Sets the focus to the column header at the given `field`.
   * @param {string} field The field name.
   */
  setColumnHeaderFocus: (field: string) => void;
}
