import { GridCellMode } from '../gridCell';
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
   * Set the edit rows model of the grid.
   * @param GridEditRowsModel
   */
  setEditRowsModel: (model: GridEditRowsModel) => void;
  /**
   * Set the cellMode of a cell.
   * @param GridRowId
   * @param string
   * @param 'edit' | 'view'
   */
  setCellMode: (id: GridRowId, field: string, mode: GridCellMode) => void;
  /**
   * Returns true if the cell is editable.
   * @param params
   */
  isCellEditable: (params: GridCellParams) => boolean;
  /**
   * Set the edit cell input props.
   * @param update
   */
  setEditCellProps: (id: GridRowId, update: GridEditRowUpdate) => void;
  /**
   * Commit the cell value changes to update the cell value.
   * @param update
   */
  commitCellChange: (id: GridRowId, update: GridEditRowUpdate) => void;
  /**
   * Callback fired when the EditRowModel changed.
   * @param handler
   */
  onEditRowModelChange: (handler: (param: GridEditRowModelParams) => void) => void;
  /**
   * Callback fired when the cell mode changed.
   * @param handler
   */
  onCellModeChange: (handler: (param: GridCellModeChangeParams) => void) => void;
  /**
   * Callback fired when the cell changes are committed.
   * @param handler
   */
  onEditCellChangeCommitted: (handler: (param: GridEditCellParams) => void) => void;
  /**
   * Callback fired when the edit cell value changed.
   * @param handler
   */
  onEditCellChange: (handler: (param: GridEditCellParams) => void) => void;
}
