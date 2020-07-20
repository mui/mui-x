import { ColDef } from '../colDef';

/**
 * Object passed as parameter of the column header click event.
 */
export interface ColumnHeaderClickedParams {
  /**
   * The column field of the column that triggered the event
   */
  field: string;
  /**
   * The column [[ColDef]] of the column that triggered the event
   */
  column: ColDef;
}
