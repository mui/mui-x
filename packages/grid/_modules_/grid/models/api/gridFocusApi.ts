import { GridCellIndexCoordinates, GridColumnHeaderIndexCoordinates } from '../gridCell';

export interface GridFocusApi {
  /**
   * Set the active element to the cell with the indexes.
   * @param indexes
   */
  setCellFocus: (indexes: GridCellIndexCoordinates) => void;
  /**
   * Set the active element to the column header with the indexes.
   * @param indexes
   */
  setColumnHeaderFocus: (indexes: GridColumnHeaderIndexCoordinates) => void;
}
