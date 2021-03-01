import { GridCellValue } from '../gridCell';
import { GridRowModel } from '../gridRows';

/**
 * Object passed as parameter in the column [[GridColDef]] cell renderer.
 */
export interface GridCellParams {
  /**
   * The HTMLElement that triggered the event
   */
  element?: HTMLElement;
  /**
   * The column field of the cell that triggered the event
   */
  field: string;
  /**
   * The cell value, but if the column has valueGetter, use getValue.
   */
  value: GridCellValue;
  /**
   * A function that let you get data from other columns.
   * @param field
   */
  getValue: (field: string) => GridCellValue;
  /**
   * The row model of the row that the current cell belongs to.
   */
  row: GridRowModel;
  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: any;
  /**
   * The row index of the row that the current cell belongs to.
   */
  rowIndex?: number;
  /**
   * The column index that the current cell belongs to.
   */
  colIndex?: number;
  /**
   * GridApi that let you manipulate the grid.
   */
  api: any;
  /**
   * If true, the cell is editable.
   */
  isEditable?: boolean;
}

/**
 * Alias of GridCellParams.
 */
export type ValueGetterParams = GridCellParams;

/**
 * Alias of GridCellParams.
 */
export type ValueFormatterParams = GridCellParams;
