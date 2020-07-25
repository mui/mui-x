import { CellValue, RowData } from '../rows';
import { ColDef } from '../colDef';

/**
 * Object passed as parameter in the Cell Click event handler.
 */
export interface CellClickedParam {
  /**
   * The HTMLElement that triggered the event.
   */
  element: HTMLElement;
  /**
   * The value of the cell that triggered the event.
   */
  value: CellValue;
  /**
   * The column field of the cell that triggered the event.
   */
  field: string;
  /**
   * The other row data of the cell that triggered the event.
   */
  data: RowData;
  /**
   * The row index of the cell that triggered the event.
   */
  rowIndex: number;
  /**
   * The column of the cell that triggered the event.
   */
  colDef: ColDef;
}
