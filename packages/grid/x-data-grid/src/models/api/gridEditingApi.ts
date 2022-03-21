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
   * Immediatelly updates the value of the cell, without waiting for the debounce.
   * @param {GridRowId} id The row id.
   * @param {string} field The field to update. If not passed, updates all fields in the given row id.
   * @ignore - do not document.
   */
  unstable_runPendingEditCellValueMutation: (id: GridRowId, field?: string) => void;
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
   * Updates the row corresponding to the given id with the values stored in the edit row model.
   * @param {GridRowId} id The id to commit to.
   * @param {React.SyntheticEvent} event The event to pass forward.
   * @returns {boolean} A boolean indicating if there is an error.
   */
  commitRowChange: (id: GridRowId, event?: MuiBaseEvent) => boolean | Promise<boolean>;
  /**
   * Updates the value of a cell and calls all `preProcessEditCellProps` if necessary.
   * @param {GridCommitCellChangeParams} params Object with the new value and id and field to update.
   * @returns {Promise<boolean>} Resolves with `true` when all values in the row are valid.
   * @ignore - do not document.
   */
  unstable_setRowEditingEditCellValue: (params: GridEditCellValueParams) => Promise<boolean>;
}

/**
 * The cell editing API interface.
 */
export interface GridCellEditingApi extends GridEditingSharedApi {
  /**
   * Updates the field corresponding to the given id with the value stored in the edit row model.
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
   * Updates the value of a cell and calls `preProcessEditCellProps` if necessary.
   * @param {GridCommitCellChangeParams} params Object with the new value and id and field to update.
   * @returns {Promise<boolean>} Resolves with `true` when the new value is valid.
   * @ignore - do not document.
   */
  unstable_setCellEditingEditCellValue: (params: GridEditCellValueParams) => Promise<boolean>;
}

/**
 * Params passed to `apiRef.current.startCellEditMode`.
 */
interface GridStartCellEditModeParams {
  /**
   * The row id.
   */
  id: GridRowId;
  /**
   * The field.
   */
  field: string;
}

/**
 * Params passed to `apiRef.current.stopCellEditMode`.
 */
interface GridStopCellEditModeParams {
  /**
   * The row id.
   */
  id: GridRowId;
  /**
   * The field.
   */
  field: string;
  /**
   * Whether or not to ignore the modifications made on this cell.
   * @default false
   */
  ignoreModifications?: boolean;
  /**
   * To which cell to move focus after finishing editing.
   * @default "none"
   */
  cellToFocusAfter?: 'none' | 'below' | 'right' | 'left';
}

/**
 * Params passed to `apiRef.current.startRowEditMode`.
 */
interface GridStartRowEditModeParams {
  /**
   * The row id.
   */
  id: GridRowId;
  /**
   * The field to put focus.
   */
  fieldToFocus?: string;
}

/**
 * Params passed to `apiRef.current.stopRowEditMode`.
 */
interface GridStopRowEditModeParams {
  /**
   * The row id.
   */
  id: GridRowId;
  /**
   * Whether or not to ignore the modifications made on this cell.
   * @default false
   */
  ignoreModifications?: boolean;
  /**
   * The field from the row below to move the focus after updating the row.
   */
  fieldFromRowBelowToFocus?: string;
}

export interface GridNewCellEditingApi
  extends Omit<GridEditingSharedApi, 'getEditRowsModel' | 'setEditRowsModel'>,
    Pick<GridCellEditingApi, 'getCellMode'> {
  /**
   * Puts the cell corresponding to the given row id and field into edit mode.
   * @param {GridStartCellEditModeParams} params The row id and field of the cell to edit.
   */
  startCellEditMode(params: GridStartCellEditModeParams): void;
  /**
   * Puts the cell corresponding to the given row id and field into view mode and updates the original row with the new value stored.
   * If `params.ignoreModifications` is `false` it will discard the modifications made.
   * @param {GridStopCellEditModeParams} params The row id and field of the cell to stop editing.
   */
  stopCellEditMode(params: GridStopCellEditModeParams): void;
  /**
   * Updates the value of a cell being edited.
   * Don't call this method directly, prefer `setEditCellValue`.
   * @param {GridCommitCellChangeParams} params Object with the new value and id and field to update.
   * @returns {Promise<boolean>} Resolves with `true` when the new value is valid.
   * @ignore - do not document.
   */
  unstable_setCellEditingEditCellValue: (params: GridEditCellValueParams) => Promise<boolean>;
}

export interface GridNewRowEditingApi
  extends Omit<GridEditingSharedApi, 'getEditRowsModel' | 'setEditRowsModel'>,
    Pick<GridRowEditingApi, 'getRowMode'> {
  /**
   * Puts the row corresponding to the given id into edit mode.
   * @param {GridStartCellEditModeParams} params The row id edit.
   */
  startRowEditMode(params: GridStartRowEditModeParams): void;
  /**
   * Puts the row corresponding to the given id and into view mode and updates the original row with the new values stored.
   * If `params.ignoreModifications` is `false` it will discard the modifications made.
   * @param {GridStopCellEditModeParams} params The row id and field of the cell to stop editing.
   */
  stopRowEditMode(params: GridStopRowEditModeParams): void;
  /**
   * Updates the value of a cell being edited.
   * Don't call this method directly, prefer `setEditCellValue`.
   * @param {GridCommitCellChangeParams} params Object with the new value and id and field to update.
   * @returns {Promise<boolean>} Resolves with `true` when all values in the row are valid.
   * @ignore - do not document.
   */
  unstable_setRowEditingEditCellValue: (params: GridEditCellValueParams) => Promise<boolean>;
}

/**
 * The editing API interface that is available in the grid `apiRef`.
 */
export interface GridEditingApi
  extends GridCellEditingApi,
    GridRowEditingApi,
    GridNewCellEditingApi,
    GridNewRowEditingApi {}

export interface GridOldEditingApi extends GridCellEditingApi, GridRowEditingApi {}

export interface GridNewEditingApi extends GridNewCellEditingApi, GridNewRowEditingApi {}
