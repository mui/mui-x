import { GridCellMode, GridCellValue } from '../gridCell';
import { GridRowId, GridRowModel, GridRowTreeNodeConfig } from '../gridRows';
import type { GridStateColDef } from '../colDef';
import { GridEditCellProps } from '../gridEditRowModel';

/**
 * Object passed as parameter in the column [[GridColDef]] cell renderer.
 */
export interface GridCellParams<V = any, R = any, F = V> {
  /**
   * The grid row id.
   */
  id: GridRowId;
  /**
   * The column field of the cell that triggered the event
   */
  field: string;
  /**
   * The cell value, but if the column has valueGetter, use getValue.
   */
  value: V;
  /**
   * The cell value formatted with the column valueFormatter.
   */
  formattedValue: F;
  /**
   * The row model of the row that the current cell belongs to.
   */
  row: GridRowModel<R>;
  /**
   * The node of the row that the current cell belongs to
   */
  rowNode: GridRowTreeNodeConfig;
  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: GridStateColDef;
  /**
   * If true, the cell is editable.
   */
  isEditable?: boolean;
  /**
   * The mode of the cell.
   */
  cellMode: GridCellMode;
  /**
   * If true, the cell is the active element.
   */
  hasFocus: boolean;
  /**
   * the tabIndex value.
   */
  tabIndex: 0 | -1;
  /**
   * Get the cell value of a row and field.
   * @param {GridRowId} id The row id.
   * @param {string} field The field.
   * @returns {GridCellValue} The cell value.
   */
  getValue: (id: GridRowId, field: string) => GridCellValue;
}

/**
 * GridCellParams containing api.
 */
export interface GridRenderCellParams<V = any, R = any, F = V> extends GridCellParams<V, R, F> {
  /**
   * GridApi that let you manipulate the grid.
   */
  api: any;
}

/**
 * GridEditCellProps containing api.
 */
export interface GridRenderEditCellParams extends GridEditCellProps {
  /**
   * GridApi that let you manipulate the grid.
   */
  api: any;
}

/**
 * Alias of GridRenderCellParams.
 */
export type GridValueGetterParams = Omit<GridRenderCellParams, 'formattedValue' | 'isEditable'>;

/**
 * Object passed as parameter in the column [[GridColDef]] value setter callback.
 */
export interface GridValueSetterParams {
  /**
   * The new cell value.
   */
  value: GridCellValue;
  /**
   * The row that is being editted.
   */
  row: GridRowModel;
}

/**
 * Object passed as parameter in the column [[GridColDef]] value formatter callback.
 */
export interface GridValueFormatterParams {
  /**
   * The grid row id.
   * It is not available when the value formatter is called by the filter panel.
   */
  id?: GridRowId;
  /**
   * The column field of the cell that triggered the event
   */
  field: string;
  /**
   * The cell value, but if the column has valueGetter, use getValue.
   */
  value: GridCellValue;
  /**
   * GridApi that let you manipulate the grid.
   */
  api: any;
}
