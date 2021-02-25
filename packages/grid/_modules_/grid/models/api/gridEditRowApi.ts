import { GridCellMode, GridCellValue } from '../gridCell';
import { GridEditRowsModel, GridEditRowUpdate } from '../gridEditRowModel';
import { GridRowId } from '../gridRows';
import { GridCellParams } from '../params/gridCellParams';
import {
  GridCellModeChangeParams,
  GridEditCellParams,
  GridEditRowModelParams,
} from '../params/gridEditCellParams';

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
  setCellMode: (id: GridRowId, field: string, mode: GridCellMode) => void;
  /**
   * Returns true if the cell is editable
   * @param params
   */
  isCellEditable: (params: GridCellParams) => boolean;
  /**
   * Set the edit cell input props
   * @param update
   */
  setEditCellProps: (id: GridRowId, update: GridEditRowUpdate) => void;
  /**
   * commit the cell value changes to update the cell value.
   * @param update
   */
  commitCellChange: (id: GridRowId, update: GridEditRowUpdate) => void;
  /**
   * get the cell value of a row and field
   * @param id
   * @param field
   */
  getCellValue: (id: GridRowId, field: string) => GridCellValue;

  onEditRowModelChange: (handler: (param: GridEditRowModelParams) => void) => void;
  onCellModeChange: (handler: (param: GridCellModeChangeParams) => void) => void;
  onEditCellChangeCommitted: (handler: (param: GridEditCellParams) => void) => void;
  onEditCellChange: (handler: (param: GridEditCellParams) => void) => void;
}
