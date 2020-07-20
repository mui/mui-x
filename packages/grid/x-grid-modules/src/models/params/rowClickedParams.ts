import { RowData, RowModel } from '../rows';
import { ColDef } from '../colDef/colDef';

/**
 * The object passed as parameter of the Row click event handler.
 */
export interface RowClickedParam {
  /**
   * The row element that trigger the click
   */
  element: HTMLElement;
  /**
   * The row model of the row that triggered the click
   */
  rowModel: RowModel;
  /**
   * The row data of the row that triggered the click
   */
  data: RowData;
  /**
   * The row index of the row that triggered the click
   */
  rowIndex: number;
  /**
   * The column of the row that triggered the click
   */
  colDef: ColDef;
}
