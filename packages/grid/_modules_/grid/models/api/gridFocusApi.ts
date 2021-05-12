import { GridRowId } from '../gridRows';

export interface GridFocusApi {
  /**
   * Set the active element to the cell with the indexes.
   * @param id
   * @param field
   */
  setCellFocus: (id: GridRowId, field: string) => void;
  /**
   * Set the active element to the column header with the indexes.
   * @param field
   */
  setColumnHeaderFocus: (field: string) => void;
}
