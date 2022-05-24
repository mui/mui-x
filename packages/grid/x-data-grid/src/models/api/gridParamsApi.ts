import { GridValidRowModel, GridRowId } from '../gridRows';
import { GridCellParams } from '../params/gridCellParams';
import { GridColumnHeaderParams } from '../params/gridColumnHeaderParams';
import { GridRowParams } from '../params/gridRowParams';

export interface GridParamsApi {
  /**
   * Gets the value of a cell at the given `id` and `field`.
   * @template V
   * @param {GridRowId} id The id of the row.
   * @param {string} field The column field.
   * @returns {v} The cell value.
   */
  getCellValue: <V extends any = any>(id: GridRowId, field: string) => V;
  /**
   * Gets the underlying DOM element for a cell at the given `id` and `field`.
   * @param {GridRowId} id The id of the row.
   * @param {string} field The column field.
   * @returns {HTMLDivElement | null} The DOM element or `null`.
   */
  getCellElement: (id: GridRowId, field: string) => HTMLDivElement | null;
  /**
   * Gets the [[GridCellParams]] object that is passed as argument in events.
   * @param {GridRowId} id The id of the row.
   * @param {string} field The column field.
   * @returns {GridCellParams} The cell params.
   */
  getCellParams: <V = any, R extends GridValidRowModel = any, F = V>(
    id: GridRowId,
    field: string,
  ) => GridCellParams<R, V, F>;
  /**
   * Gets the [[GridRowParams]] object that is passed as argument in events.
   * @param {GridRowId} id The id of the row.
   * @param {string} field The column field.
   * @returns {GridRowParams} The row params.
   */
  getRowParams: (id: GridRowId) => GridRowParams;
  /**
   * Gets the underlying DOM element for a row at the given `id`.
   * @param {GridRowId} id The id of the row.
   * @returns {HTMLDivElement | null} The DOM element or `null`.
   */
  getRowElement: (id: GridRowId) => HTMLDivElement | null;
  /**
   * Gets the underlying DOM element for the column header with the given `field`.
   * @param {string} field The column field.
   * @returns {HTMLDivElement | null} The DOM element or `null`.
   */
  getColumnHeaderElement: (field: string) => HTMLDivElement | null;
  /**
   * Gets the [[GridColumnHeaderParams]] object that is passed as argument in events.
   * @param {string} field The column field.
   * @returns {GridColumnHeaderParams} The cell params.
   */
  getColumnHeaderParams: (field: string) => GridColumnHeaderParams;
}
