import { GridFilterModel } from '../../hooks/features/filter/gridFilterModelState';
import { GridSortModel } from '../gridSortModel';

/**
 * Object passed as parameter to the [[onFetchRows]] option.
 */
export interface GridFetchRowsParams {
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
