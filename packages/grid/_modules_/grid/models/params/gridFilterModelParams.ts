import { FilterModel } from '../../hooks/features/filter/FilterModelState';
import { GridColumns } from '../colDef/gridColDef';
import { GridRowModel } from '../gridRows';

/**
 * Object passed as parameter of the filter changed event.
 */
export interface GridFilterModelParams {
  /**
   * The filter model.
   */
  filterModel: FilterModel;
  /**
   * The full set of columns.
   */
  columns: GridColumns;
  /**
   * The full set of rows.
   */
  rows: GridRowModel[];
  /**
   * The set of currently visible rows.
   */
  visibleRows: GridRowModel[];
  /**
   * Api that let you manipulate the grid.
   */
  api: any;
}
