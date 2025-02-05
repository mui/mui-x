import { GridFilterItem, GridLogicOperator } from '../../../models/gridFilterItem';
import { GridFilterModel } from '../../../models/gridFilterModel';
import { GridRowId, GridValidRowModel } from '../../../models/gridRows';

export type GridFilterItemResult = { [key: Required<GridFilterItem>['id']]: boolean };
export type GridQuickFilterValueResult = { [key: string]: boolean };

export const defaultGridFilterLookup = {
  filteredRowsLookup: {},
  filteredChildrenCountLookup: {},
  filteredDescendantCountLookup: {},
};

export const getDefaultGridFilterModel: () => GridFilterModel = () => ({
  items: [],
  logicOperator: GridLogicOperator.And,
  quickFilterValues: [],
  quickFilterLogicOperator: GridLogicOperator.And,
});

export interface GridFilterState {
  filterModel: GridFilterModel;
  /**
   * Filtering status for each row.
   * A row is filtered if it is passing the filters, whether its parents are expanded or not.
   * All the rows are filtered except the ones registered in this lookup with `false` values.
   * This is the equivalent of the `visibleRowsLookup` if all the groups were expanded.
   */
  filteredRowsLookup: Record<GridRowId, false>;
  /**
   * Amount of children that are passing the filters or have children that are passing the filter (does not count grand children).
   * If a row is not registered in this lookup, it is supposed to have no descendant passing the filters.
   * If `GridDataSource` is being used to load the data, the value is `-1` if there are some children but the count is unknown.
   */
  filteredChildrenCountLookup: Record<GridRowId, number>;
  /**
   * Amount of descendants that are passing the filters.
   * For the Tree Data, it includes all the intermediate depth levels (= amount of children + amount of grand children + ...).
   * For the Row grouping by column, it does not include the intermediate depth levels (= amount of descendant of maximum depth).
   * If a row is not registered in this lookup, it is supposed to have no descendant passing the filters.
   */
  filteredDescendantCountLookup: Record<GridRowId, number>;
}

export interface GridFilterInitialState {
  filterModel?: GridFilterModel;
}

export interface GridAggregatedFilterItemApplierResult {
  passingFilterItems: null | GridFilterItemResult;
  passingQuickFilterValues: null | GridQuickFilterValueResult;
}

/**
 * @param {GridRowId} rowId The id of the row we want to filter.
 * @param {(filterItem: GridFilterItem) => boolean} shouldApplyItem An optional callback to allow the filtering engine to only apply some items.
 */
export type GridAggregatedFilterItemApplier = (
  row: GridValidRowModel,
  shouldApplyItem: ((field: string) => boolean) | undefined,
  result: GridAggregatedFilterItemApplierResult,
) => void;

export interface GridFilteringMethodParams {
  isRowMatchingFilters: GridAggregatedFilterItemApplier | null;
  filterModel: GridFilterModel;
}

export type GridFilteringMethodValue = Omit<GridFilterState, 'filterModel'>;

/**
 * Visibility status for each row.
 * A row is visible if it is passing the filters AND if its parents are expanded.
 * If a row is not registered in this lookup, it is visible.
 */
export type GridVisibleRowsLookupState = Record<GridRowId, false>;
