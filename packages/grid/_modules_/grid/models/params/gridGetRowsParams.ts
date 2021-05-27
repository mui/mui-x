import { GridFilterModel } from '../../hooks/features/filter/gridFilterModelState';
import { GridRowData } from '../gridRows';
import { GridSortModel } from '../gridSortModel';

/**
 * Object passed as parameter to the [[getRows]] option.
 */
export interface GridGetRowsParams {
  /**
   * The start index from which rows needs to be loaded.
   */
  startIndex: number;
  /**
   * The viewport page size.
   */
  viewportPageSize: number;
  /**
   * The sort model used to sort the grid.
   */
  sortModel: GridSortModel;
  /**
   * The filter model.
   */
  filterModel: GridFilterModel;
  /**
   * GridApiRef that let you manipulate the grid.
   */
  api: any;
}

/**
 * Object expected to be returned from the [[getRows]] option.
 */
export interface GridGetRowsReturnValue {
  /**
   * The start index from which rows needs to be loaded.
   */
  rows: GridRowData[];
  /**
   * The viewport page size.
   */
  rowCount?: number;
}
