import { GridCellMode } from '../gridCell';
import { GridEditCellProps, GridEditRowsModel } from '../gridEditRowModel';
import { GridRowId } from '../gridRows';
import { GridCellParams } from '../params/gridCellParams';
import { GridEditCellValueParams, GridEditCellPropsParams } from '../params/gridEditCellParams';

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
  setEditCellProps: (params: GridEditCellPropsParams) => void;
  /**
   * Get the edit cell input props.
   * @param rowId
   * @param field
   */
  getEditCellProps: (rowId: GridRowId, field: string) => GridEditCellProps;
  /**
   * Get the edit cell input props params passed in handler.
   * @param rowId
   * @param field
   */
  getEditCellPropsParams: (rowId: GridRowId, field: string) => GridEditCellPropsParams;
  /**
   * Get the edit cell value params.
   * @param rowId
   * @param field
   */
  getEditCellValueParams: (rowId: GridRowId, field: string) => GridEditCellValueParams;
  /**
   * Commit the cell value changes to update the cell value.
   * @param update
   */
  commitCellChange: (params: GridEditCellPropsParams) => void;
  /**
   * Set the cell value.
   * @param params
   */
  setCellValue: (params: GridEditCellValueParams) => void;
}
