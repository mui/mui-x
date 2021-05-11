import { GridFilterModel } from '../../hooks/features/filter/gridFilterModelState';
import { GridColumns } from '../colDef/gridColDef';
import { GridRowModel, GridRowId } from '../gridRows';

/**
 * Object passed as parameter of the filter changed event.
 */
export interface GridFilterModelParams {
  /**
   * The filter model.
   */
  filterModel: GridFilterModel;
  /**
   * The full set of columns.
   */
  columns: GridColumns;
  /**
   * The full set of rows.
   */
  rows: Map<GridRowId, GridRowModel>;
  /**
   * The set of currently visible rows.
   */
  visibleRows: Map<GridRowId, GridRowModel>;
  /**
   * Api that let you manipulate the grid.
   */
  api: any;
}
