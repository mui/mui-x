import { GridCellIndexCoordinates } from '../gridCell';

export interface GridNavigationApi {
  /**
   * Set the active element to the cell with the indexes.
   * @param indexes
   */
  setCellFocus: (indexes: GridCellIndexCoordinates) => void;
}
