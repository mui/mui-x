import { GridCellMode, GridCellValue } from '../gridCell';
import { GridEditRowsModel, GridEditRowUpdate } from '../gridEditRowModel';
import { GridRowId } from '../gridRows';
import { GridCellParams } from '../params/gridCellParams';

export interface GridEditRowApi {
  /**
   * Set the edit rows model of the grid
   * @param GridEditRowsModel
   */
  setEditRowsModel: (model: GridEditRowsModel) => void;
  /**
   * Set the cell mode of a cell
   * @param GridRowId
   * @param string
   * @param 'edit' | 'view'
   */
  setCellMode: (rowId: GridRowId, field: string, mode: GridCellMode) => void;
  /**
   * Returns true if the cell is editable
   * @param params
   */
  isCellEditable: (params: GridCellParams) => boolean;
  /**
   * Set the edit cell input props
   * @param update
   */
  setEditCellValue: (update: GridEditRowUpdate) => void;
  /**
   * commit the cell value changes to update the cell value.
   * @param update
   */
  commitCellValueChanges: (update: GridEditRowUpdate) => void;
  /**
   * get the cell value of a row and field
   * @param id
   * @param field
   */
  getCellValue: (id: GridRowId, field: string) => GridCellValue;

  onEditRowModelChange: (handler: (param: { update: GridEditRowUpdate }) => void) => void;
  onCellModeChange: (handler: (param: { update: GridEditRowUpdate }) => void) => void;
  onEditCellValueChangeCommitted: (handler: (param: { update: GridEditRowUpdate }) => void) => void;
  onEditCellValueChange: (handler: (param: { update: GridEditRowUpdate }) => void) => void;
}
