import { GridCellMode, GridRowMode, GridCellValue } from '../gridCell';
import { GridEditRowsModel, GridEditCellProps } from '../gridEditRowModel';
import { GridRowId } from '../gridRows';
import { GridCellParams } from '../params/gridCellParams';
import {
  GridCommitCellChangeParams,
  GridEditCellValueParams,
  GridEditCellPropsParams,
} from '../params/gridEditCellParams';
import { MuiBaseEvent } from '../muiEvent';

/**
 * The shared methods used by the cell and row editing API.
 */
export interface GridEditingSharedApi {
  /**
   * Set the edit rows model of the grid.
   * @param {GridEditRowsModel} model The new edit rows model.
   */
  setEditRowsModel: (model: GridEditRowsModel) => void;
  /**
   * Gets the edit rows model of the grid.
   * @returns {GridEditRowsModel} The edit rows model.
   */
  getEditRowsModel: () => GridEditRowsModel;
  /**
   * Controls if a cell is editable.
   * @param {GridCellParams} params The cell params.
   * @returns {boolean} A boolean value determining if the cell is editable.
   */
  isCellEditable: (params: GridCellParams) => boolean;
  /**
   * Sets the value of the edit cell.
   * Commonly used inside the edit cell component.
   * @param {GridEditCellValueParams} params Contains the id, field and value to set.
   * @param {React.SyntheticEvent} event The event to pass forward.
   * @returns {Promise<boolean> | void} A promise with the validation status if `preventCommitWhileValidating` is `true`. Otherwise, void.
   */
  setEditCellValue: (
    params: GridEditCellValueParams,
    event?: MuiBaseEvent,
  ) => Promise<boolean> | void;
  /**
   * @ignore - do not document.
   */
  unstable_setEditCellProps: (params: GridEditCellPropsParams) => GridEditCellProps;
  /**
   * @ignore - do not document.
   */
  unstable_parseValue: (id: GridRowId, field: string, value: GridCellValue) => GridCellValue;
}

/**
 * The row editing API interface.
 */
export interface GridRowEditingApi extends GridEditingSharedApi {
  /**
   * Sets the mode of a row.
   * @param {GridRowId} id The id of the row.
   * @param {GridRowMode} mode Can be: `"edit"`, `"view"`.
   */
  setRowMode: (id: GridRowId, mode: GridRowMode) => void;
  /**
   * Gets the mode of a row.
   * @param {GridRowId} id The id of the row.
   * @returns {GridRowMode} Returns `"edit"` or `"view"`.
   */
  getRowMode: (id: GridRowId) => GridRowMode;
  /**
   * Updates the row at the given id with the values stored in the edit row model.
   * @param {GridRowId} id The id to commit to.
   * @param {React.SyntheticEvent} event The event to pass forward.
   * @returns {boolean} A boolean indicating if there is an error.
   */
  commitRowChange: (id: GridRowId, event?: MuiBaseEvent) => boolean | Promise<boolean>;
  /**
   * @ignore - do not document.
   */
  unstable_setRowEditingEditCellValue: (params: GridEditCellValueParams) => Promise<boolean>;
}

/**
 * The cell editing API interface.
 */
export interface GridCellEditingApi extends GridEditingSharedApi {
  /**
   * Updates the field at the given id with the value stored in the edit row model.
   * @param {GridCommitCellChangeParams} params The id and field to commit to.
   * @param {React.SyntheticEvent} event The event to pass forward.
   * @returns {boolean} A boolean indicating if there is an error.
   */
  commitCellChange: (
    params: GridCommitCellChangeParams,
    event?: MuiBaseEvent,
  ) => boolean | Promise<boolean>;
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
   * @returns {GridCellMode} Returns `"edit"` or `"view"`.
   */
  getCellMode: (id: GridRowId, field: string) => GridCellMode;
  /**
   * @ignore - do not document.
   */
  unstable_setCellEditingEditCellValue: (params: GridEditCellValueParams) => void;
}

/**
 * The editing API interface that is available in the grid `apiRef`.
 */
export interface GridEditingApi extends GridCellEditingApi, GridRowEditingApi {}
