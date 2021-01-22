/**
 * The cell value type.
 */
type CellValue = string | number | boolean | Date | null | undefined | object;

/**
 * The key value object representing the data of a row.
 */
interface RowModel {
  id: string | number;
  [key: string]: any;
}

/**
 * Object passed as parameter in the column [[ColDef]] cell renderer.
 */
export interface CellParams {
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
  value: CellValue;
  /**
   * A function that let you get data from other columns.
   * @param field
   */
  getValue: (field: string) => CellValue;
  /**
   * The row model of the row that the current cell belongs to.
   */
  row: RowModel;
  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: any;
  /**
   * The row index of the row that the current cell belongs to.
   */
  rowIndex?: number;
  /**
   * ApiRef that let you manipulate the grid.
   */
  api: any;
}
