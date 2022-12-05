import { GridRowId, GridRowModel } from '../gridRows';
import { GridFilterModel } from '../gridFilterModel';
import { GridFilterItem, GridLinkOperator } from '../gridFilterItem';
import { GridControlledStateReasonLookup } from '../events';

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
  upsertFilterItem: (item: GridFilterItem) => void;
  /**
   * Updates or inserts many [[GridFilterItem]].
   * @param {GridFilterItem[]} items The filters to update.
   */
  upsertFilterItems: (items: GridFilterItem[]) => void;
  /**
   * Applies all filters on all rows.
   * @ignore - do not document.
   */
  unstable_applyFilters: () => void;
  /**
   * Deletes a [[GridFilterItem]].
   * @param {GridFilterItem} item The filter to delete.
   */
  deleteFilterItem: (item: GridFilterItem) => void;
  /**
   * Changes the [[GridLinkOperator]] used to connect the filters.
   * @param {GridLinkOperator} operator The new link operator. It can be: `"and"` or `"or`".
   */
  setFilterLinkOperator: (operator: GridLinkOperator) => void;
  /**
   * Sets the filter model to the one given by `model`.
   * @param {GridFilterModel} model The new filter model.
   * @param {string} reason The reason for the model to have changed.
   */
  setFilterModel: (
    model: GridFilterModel,
    reason?: GridControlledStateReasonLookup['filter'],
  ) => void;
  /**
   * Returns a sorted `Map` containing only the visible rows.
   * @returns {Map<GridRowId, GridRowModel>} The sorted `Map`.
   */
  getVisibleRowModels: () => Map<GridRowId, GridRowModel>;
  /**
   * Set the quick filter values ot the one given by `values`
   * @param {any[]} values The list of element to quick filter
   */
  setQuickFilterValues: (values: any[]) => void;
}
