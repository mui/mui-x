import { Columns } from '../colDef/colDef';
import { SortModel } from '../sortModel';
/**
 * Object passed as parameter of the column sorted event.
 */
export interface SortModelParams {
  /**
   * The sort model used to sort the grid.
   */
  sortModel: SortModel;
  /**
   * The full set of columns.
   */
  columns: Columns;
  /**
   * Api that let you manipulate the grid.
   */
  api: any;
}
