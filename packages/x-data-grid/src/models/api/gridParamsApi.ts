import { GridColDef } from '../colDef';
import { GridStateColDef } from '../colDef/gridColDef';
import { GridCellMode } from '../gridCell';
import { GridValidRowModel, GridRowId, GridTreeNode, GridRowModel } from '../gridRows';
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
   * Gets the cell value.
   * Use it instead of `getCellValue` for better performance if you have `row` and `colDef`.
   * @template V
   * @param {GridRowModel} row The row model.
   * @param {GridColDef} colDef The column definition.
   * @returns {v} The cell value.
   * @ignore - do not document
   */
  getRowValue: <V extends any = any>(row: GridRowModel, colDef: GridColDef) => V;
  /**
   * Gets the cell formatted value
   * Use it instead of `getCellParams` for better performance if you only need the formatted value.
   * @template V
   * @param {GridRowModel} row The row model.
   * @param {GridColDef} colDef The column definition.
   * @returns {v} The cell value.
   * @ignore - do not document
   */
  getRowFormattedValue: <V extends any = any>(row: GridRowModel, colDef: GridColDef) => V;
  /**
   * Gets the [[GridCellParams]] object that is passed as argument in events.
   * @param {GridRowId} id The id of the row.
   * @param {string} field The column field.
   * @returns {GridCellParams} The cell params.
   */
  getCellElement: (id: GridRowId, field: string) => HTMLDivElement | null;
  /**
   * Gets the [[GridCellParams]] object that is passed as argument in events.
   * @param {GridRowId} id The id of the row.
   * @param {string} field The column field.
   * @returns {GridCellParams} The cell params.
   */
  getCellParams: <
    R extends GridValidRowModel = any,
    V = unknown,
    F = V,
    N extends GridTreeNode = GridTreeNode,
  >(
    id: GridRowId,
    field: string,
  ) => GridCellParams<R, V, F, N>;
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

export interface GridParamsPrivateApi {
  /**
   * @typedef {Object} CellParamsOverrides
   * @property {GridCellMode} cellMode - The mode of the cell.
   * @property {GridStateColDef} colDef - The column definition.
   * @property {boolean} hasFocus - Indicates if the cell is in focus.
   * @property {GridTreeNode} rowNode - The node of the row that the current cell belongs to.
   * @property {0|-1} tabIndex - The tabIndex value.
   */

  /**
   * Used internally to render the cell based on existing row data provided by the GridRow.
   * @param {GridRowId} id The id of the row.
   * @param {string} field The column field.
   * @param {GridValidRowModel} row The row model.
   * @param {CellParamsOverrides} cellParams The cell params.
   * @returns {GridCellParams} The cell params.
   */
  getCellParamsForRow: <
    R extends GridValidRowModel = any,
    V = unknown,
    F = V,
    N extends GridTreeNode = GridTreeNode,
  >(
    id: GridRowId,
    field: string,
    row: R,
    {
      cellMode,
      colDef,
      hasFocus,
      rowNode,
      tabIndex,
    }: {
      cellMode: GridCellMode;
      colDef: GridStateColDef;
      hasFocus: boolean;
      rowNode: N;
      tabIndex: 0 | -1;
    },
  ) => GridCellParams<R, V, F, N>;
}
