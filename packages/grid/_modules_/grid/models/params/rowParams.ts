import { CellValue } from '../cell';
import { RowData, RowModel } from '../rows';

/**
 * Object passed as parameter in the column [[ColDef]] cell renderer.
 */
export interface RowParams {
  /**
   * The HTMLElement that triggered the event
   */
  element?: HTMLElement;
  /**
   * A function that let you get data from other columns.
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
   * All grid columns.
   */
  columns: any;
  /**
   * The row index of the row that the current cell belongs to.
   */
  rowIndex: number;
  /**
   * ApiRef that let you manipulate the grid.
   */
  api: any;
}
