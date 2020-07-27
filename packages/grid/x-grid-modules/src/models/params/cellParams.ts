import { CellValue, RowData, RowModel } from '../rows';

/**
 * Object passed as parameter in the column [[ColDef]] cell renderer.
 */
export interface CellParams {
  /**
   * The cell value.
   */
  value: CellValue;
  /**
   * A function that let you get data from other columns.
   *
   * @param field
   */
  getValue: (field: string) => CellValue;
  /**
   * The full set of data of the row that the current cell belongs to.
   */
  data: RowData;
  /**
   * The row model of the row that the current cell belongs to.
   */
  rowModel: RowModel;
  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: any;
  /**
   * The row index of the row that the current cell belongs to.
   */
  rowIndex: number;
  /**
   * ApiRef that let you manipulate the grid.
   */
  api: any;
}

/**
 * Alias of CellParams.
 */
export type ValueGetterParams = CellParams;

/**
 * Alias of CellParams.
 */
export type ValueFormatterParams = CellParams;
