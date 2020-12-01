import { FilterModel } from '../../hooks/features/filter/FilterModelState';
import { Columns } from '../colDef/colDef';
import { RowModel } from '../rows';

/**
 * Object passed as parameter of the filter changed event.
 */
export interface FilterModelParams {
  /**
   * The filter model.
   */
  filterModel: FilterModel;
  /**
   * The full set of columns.
   */
  columns: Columns;
  /**
   * The full set of rows.
   */
  rows: RowModel[];
  /**
   * Api that let you manipulate the grid.
   */
  api: any;
}
