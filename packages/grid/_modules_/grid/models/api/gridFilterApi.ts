import { GridRowId, GridRowModel } from '../gridRows';
import { GridFilterModel } from '../gridFilterModel';
import { GridFilterItem, GridLinkOperator } from '../gridFilterItem';

/**
 * The filter API interface that is available in the grid [[apiRef]].
 */
export interface GridFilterApi {
  /**
   * Shows the filter panel. If `targetColumnField` is given, a filter for this field is also added.
   * @param {string} targetColumnField The column field to add a filter.
   */
  showFilterPanel: (targetColumnField?: string) => void;
  /**
   * Hides the filter panel.
   */
  hideFilterPanel: () => void;
  /**
   * Updates or inserts a [[GridFilterItem]].
   * @param {GridFilterItem} item The filter to update.
   */
  upsertFilter: (item: GridFilterItem) => void;
  /**
   * Applies a [[GridFilterItem]] on all rows. If no `linkOperator` is given, the "and" operator is used.
   * @param {GridFilterItem} item The filter to be applied.
   * @param {GridLinkOperator} linkOperator The link operator to use.
   */
  applyFilter: (item: GridFilterItem, linkOperator?: GridLinkOperator) => void;
  /**
   * Applies all filters on all rows.
   */
  applyFilters: () => void;
  /**
   * Deletes a [[GridFilterItem]].
   * @param {GridFilterItem} item The filter to delete.
   */
  deleteFilter: (item: GridFilterItem) => void;
  /**
   * Changes the [[GridLinkOperator]] used to connect the filters.
   * @param {GridLinkOperator} operator The new link operator. It can be: `"and"` or `"or`".
   */
  applyFilterLinkOperator: (operator: GridLinkOperator) => void;
  /**
   * Sets the filter model to the one given by `model`.
   * @param {GridFilterModel} model The new filter model.
   */
  setFilterModel: (model: GridFilterModel) => void;
  /**
   * Returns a sorted `Map` containing only the visible rows.
   * @returns {Map<GridRowId, GridRowModel>} The sorted `Map`.
   */
  getVisibleRowModels: () => Map<GridRowId, GridRowModel>;
}
