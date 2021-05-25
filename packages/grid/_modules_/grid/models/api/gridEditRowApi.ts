import { GridCellMode } from '../gridCell';
import { GridEditCellProps, GridEditRowsModel } from '../gridEditRowModel';
import { GridRowId } from '../gridRows';
import { GridCellParams } from '../params/gridCellParams';
import { GridEditCellValueParams, GridEditCellPropsParams } from '../params/gridEditCellParams';

/**
 * The editing API interface that is available in the grid `apiRef`.
 */
export interface GridEditRowApi {
  /**
   * Set sthe edit rows model of the grid.
   * @param {GridEditRowsModel} model The new edit rows model.
   */
  setEditRowsModel: (model: GridEditRowsModel) => void;
  /**
   * Gets the edit rows model of the grid.
   * @returns {GridEditRowsModel} The edit rows model.
   */
  getEditRowsModel: () => GridEditRowsModel;
  /**
   * Sets the mode of a cell.
   * @param {GridRowId} id The id of the row.
   * @param {string} field The field to change the mode.
   * @param {GridCellMode} mode Can be: `"edit"`, `"view"`.
   */
  setCellMode: (id: GridRowId, field: string, mode: GridCellMode) => void;
  /**
   * Gets the mode of a cell.
   * @param {GridRowId} id The id of the row.
   * @param {string} field The field to get the mode.
   * @returns Returns `"edit"` or `"view"`.
   */
  getCellMode: (id: GridRowId, field: string) => GridCellMode;
  /**
   * Controls if a cell is editable.
   * @param {GridCellParams} params The cell params.
   * @returns {boolean} A boolean value determining if the cell is editable.
   */
  isCellEditable: (params: GridCellParams) => boolean;
  /**
   * Sets the input props of the edit cell.
   * @param {GridEditCellPropsParams} params The params to set.
   */
  setEditCellProps: (params: GridEditCellPropsParams) => void;
  /**
   * Gets the input props for the edit cell of a given `rowId` and `field`.
   * @param {GridRowId} rowId The id of the row.
   * @param {string} field The column field.
   * @returns {GridEditCellProps} The props for the edit cell.
   */
  getEditCellProps: (rowId: GridRowId, field: string) => GridEditCellProps;
  /**
   * Gets the params to be passed when calling `setEditCellProps`.
   * @param {GridRowId} rowId The id of the row.
   * @param {string} field The column field.
   * @returns {GridEditCellPropsParams} The params.
   */
  getEditCellPropsParams: (rowId: GridRowId, field: string) => GridEditCellPropsParams;
  /**
   * Get the edit cell value params.
   * @param rowId
   * @param field
   * @ignore - do not document
   */
  getEditCellValueParams: (rowId: GridRowId, field: string) => GridEditCellValueParams;
  /**
   * Commit the cell value changes to update the cell value.
   * @param update
   * @ignore - do not document
   */
  commitCellChange: (params: GridEditCellPropsParams) => void;
  /**
   * Sets the cell value.
   * @param {GridEditCellValueParams} params An object with the row id, the field and the new value.
   */
  setCellValue: (params: GridEditCellValueParams) => void;
}
