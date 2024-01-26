import { GridCellCoordinates, GridColDef, GridRowId } from '@mui/x-data-grid-pro';

export type GridCellSelectionModel = Record<GridRowId, Record<GridColDef['field'], boolean>>;

/**
 * The cell selection API interface that is available in the grid [[apiRef]].
 */
export interface GridCellSelectionApi {
  /**
   * Determines if a cell is selected or not.
   * @param {GridRowId} id The id of the row.
   * @param {GridColDef['field']} field The field.
   * @returns {boolean} A boolean indicating if the cell is selected.
   */
  isCellSelected: (id: GridRowId, field: GridColDef['field']) => boolean;
  /**
   * Returns an object containing the selection state of the cells.
   * The keys of the object correpond to the row IDs.
   * The value of each key is another object whose keys are the fields and values are the selection state.
   * @returns {GridCellSelectionModel} Object containing the selection state of the cells
   */
  getCellSelectionModel: () => GridCellSelectionModel;
  /**
   * Updates the selected cells to be those passed to the `newModel` argument.
   * Any cell already selected will be unselected.
   * @param {GridCellSelectionModel} newModel The cells to select.
   */
  setCellSelectionModel: (newModel: GridCellSelectionModel) => void;
  /**
   * Selects all cells that are inside the range given by `start` and `end` coordinates.
   * @param {GridCellCoordinates} start Object containing the row ID and field of the first cell to select.
   * @param {GridCellCoordinates} end Object containing the row ID and field of the last cell to select.
   * @param {boolean} keepOtherSelected Whether to keep current selected cells or discard. Default is false.
   */
  selectCellRange: (
    start: GridCellCoordinates,
    end: GridCellCoordinates,
    keepOtherSelected?: boolean,
  ) => void;
  /**
   * Returns an array containing only the selected cells.
   * Each item is an object with the ID and field of the cell.
   * @returns {GridCellCoordinates[]} Array with the selected cells.
   */
  getSelectedCellsAsArray: () => GridCellCoordinates[];
}
