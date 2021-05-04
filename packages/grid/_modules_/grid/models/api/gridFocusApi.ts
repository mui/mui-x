import { GridRowId } from '../gridRows';

export interface GridFocusApi {
  /**
   * Set the active element to the cell with the indexes.
   * @param params
   */
  setCellFocus: (id: GridRowId, field: string) => void;
  /**
   * Set the active element to the column header with the indexes.
   * @param params
   */
  setColumnHeaderFocus: (field: string) => void;
}
