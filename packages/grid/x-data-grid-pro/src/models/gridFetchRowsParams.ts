import { GridFilterModel, GridSortModel } from '@mui/x-data-grid/models';

/**
 * Object passed as parameter to the [[onFetchRows]] option.
 */
export interface GridFetchRowsParams {
  /**
   * The index of the first row to render.
   */
  firstRowToRender: number;
  /**
   * The index of the last row to render.
   */
  lastRowToRender: number;
  /**
   * The sort model used to sort the grid.
   */
  sortModel: GridSortModel;
  /**
   * The filter model.
   */
  filterModel: GridFilterModel;
}
