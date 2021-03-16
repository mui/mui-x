import { GridCellMode } from '../gridCell';
import { GridEditCellProps, GridEditRowsModel, GridEditRowProps } from '../gridEditRowModel';
import { GridRowId } from '../gridRows';
import { GridCellParams } from '../params/gridCellParams';
import {
  GridCellModeChangeParams,
  GridEditCellValueParams,
  GridEditCellPropsParams,
  GridEditRowModelParams,
} from '../params/gridEditCellParams';

export interface GridEditRowApi {
  /**
   * Set the edit rows model of the grid.
   * @param GridEditRowsModel
   */
  setEditRowsModel: (model: GridEditRowsModel) => void;
  /**
   * Get the edit rows model of the grid.
   * @returns GridEditRowsModel
   */
  getEditRowsModel: () => GridEditRowsModel;
  /**
   * Set the cellMode of a cell.
   * @param GridRowId
   * @param string
   * @param 'edit' | 'view'
   */
  setCellMode: (id: GridRowId, field: string, mode: GridCellMode) => void;
  /**
   * Get the cellMode of a cell.
   * @param GridRowId
   * @param string
   * @returns 'edit' | 'view'
   */
  getCellMode: (id: GridRowId, field: string) => GridCellMode;
  /**
   * Returns true if the cell is editable.
   * @param params
   */
  isCellEditable: (params: GridCellParams) => boolean;
  /**
   * Set the edit cell input props.
   * @param rowId
   * @param update
   */
  setEditCellProps: (rowId: GridRowId, update: GridEditRowProps) => void;
  /**
   * Get the edit cell input props.
   * @param rowId
   * @param field
   */
  getEditCellProps: (rowId: GridRowId, field: string) => GridEditCellProps;
  /**
   * Get the edit cell params.
   * @param rowId
   * @param field
   */
  getEditCellPropsParams: (rowId: GridRowId, field: string) => GridEditCellPropsParams;
  getEditCellValueParams: (rowId: GridRowId, field: string) => GridEditCellValueParams;
  /**
   * Commit the cell value changes to update the cell value.
   * @param update
   */
  commitCellChange: (params: GridEditCellPropsParams) => void;
  setCellValue: (params: GridEditCellValueParams) => void;
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
  onEditCellChangeCommitted: (handler: (param: GridEditCellValueParams) => void) => void;
  /**
   * Callback fired when the edit cell value changed.
   * @param handler
   */
  onEditCellChange: (handler: (param: GridEditCellValueParams) => void) => void;
}
