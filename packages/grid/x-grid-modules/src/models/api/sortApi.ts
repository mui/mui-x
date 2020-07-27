import { SortModel } from '../sortModel';
import { ColumnSortedParams } from '../params/columnSortedParams';

/**
 * The sort API interface that is available in the grid [[apiRef]].
 */
export interface SortApi {
  /**
   * Get the sort model currently applied in the grid.
   */
  getSortModel: () => SortModel;
  /**
   * Set the sort model of the component and trigger a new sorting of rows.
   *
   * @param model
   */
  setSortModel: (model: SortModel) => void;
  /**
   * Handler triggered after the grid has sorted its rows.
   *
   * @param handler
   */
  onSortedColumns: (handler: (param: ColumnSortedParams) => void) => () => void;
}
