import { ColDef } from '../colDef/colDef';
import { SortModel } from '../sortModel';

/**
 * Object passed as parameter of the column sorted event.
 */
export interface ColumnSortedParams {
  /**
   * An array of column [[ColDef]] that the grid is sorted with.
   * The array order corresponds to the order of sorting.
   */
  sortedColumns: ColDef[];
  /**
   * The sort model used to sort the grid.
   */
  sortModel: SortModel;
}
