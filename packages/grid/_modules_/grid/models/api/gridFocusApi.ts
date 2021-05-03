import { GridCellIdentifier, GridColIdentifier } from '../../hooks/features/focus/gridFocusState';

export interface GridFocusApi {
  /**
   * Set the active element to the cell with the indexes.
   * @param params
   */
  setCellFocus: (params: GridCellIdentifier) => void;
  /**
   * Set the active element to the column header with the indexes.
   * @param params
   */
  setColumnHeaderFocus: (params: GridColIdentifier) => void;
}
