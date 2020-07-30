import { SortModel } from '../sortModel';
import { SortModelParams } from '../params/sortModelParams';

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
   * Handler triggered when the columns sorting changed before the grid has sorted its rows.
   *
   * @param handler
   */
  onSortModelChange: (handler: (param: SortModelParams) => void) => () => void;
}
