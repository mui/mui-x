import { GridRowId, GridRowModel } from '../gridRows';
import { GridFilterModel } from '../../hooks/features/filter/gridFilterModelState';
import { GridFilterItem, GridLinkOperator } from '../gridFilterItem';

/**
 * The filter API interface that is available in the grid [[apiRef]].
 */
export interface GridFilterApi {
  /**
   * Shows the filter panel. If `targetColumnField` is given, a filter for this field is also added.
   * @param targetColumnField
   */
  showFilterPanel: (targetColumnField?: string) => void;
  /**
   * Hides the filter panel.
   */
  hideFilterPanel: () => void;
  /**
   * Updates or inserts a [[GridFilterItem]].
   * @param item
   */
  upsertFilter: (item: GridFilterItem) => void;
  /**
   * Applies a [[GridFilterItem]] on alls rows. If no `linkOperator` is given, the "AND" operator is used.
   * @param item
   * @param linkOperator
   */
  applyFilter: (item: GridFilterItem, linkOperator?: GridLinkOperator) => void;
  /**
   * Applies all filters on all rows.
   */
  applyFilters: () => void;
  /**
   * Deletes a [[GridFilterItem]].
   * @param item
   */
  deleteFilter: (item: GridFilterItem) => void;
  /**
   * Changes the [[GridLinkOperator]] used to connect the filters.
   * @param operator
   */
  applyFilterLinkOperator: (operator: GridLinkOperator) => void;
  /**
   * Sets the filter model.
   */
  setFilterModel: (model: GridFilterModel) => void;
  /**
   * Returns a sorted `Map` containing only the visible rows.
   */
  getVisibleRowModels: () => Map<GridRowId, GridRowModel>;
}
