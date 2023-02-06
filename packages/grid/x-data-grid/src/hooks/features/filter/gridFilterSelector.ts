import { createSelector } from '../../../utils/createSelector';
import { GridFilterItem } from '../../../models/gridFilterItem';
import { GridStateCommunity } from '../../../models/gridStateCommunity';
import { gridSortedRowEntriesSelector } from '../sorting/gridSortingSelector';
import { gridColumnLookupSelector } from '../columns/gridColumnsSelector';
import { gridRowMaximumTreeDepthSelector, gridRowTreeSelector } from '../rows/gridRowsSelector';

/**
 * @category Filtering
 */
const gridFilterStateSelector = (state: GridStateCommunity) => state.filter;

/**
 * Get the current filter model.
 * @category Filtering
 */
export const gridFilterModelSelector = createSelector(
  gridFilterStateSelector,
  (filterState) => filterState.filterModel,
);

/**
 * Get the current quick filter values.
 * @category Filtering
 */
export const gridQuickFilterValuesSelector = createSelector(
  gridFilterModelSelector,
  (filterModel) => filterModel.quickFilterValues,
);

/**
 * @category Filtering
 * @ignore - do not document.
 */
export const gridVisibleRowsLookupSelector = createSelector(
  gridFilterStateSelector,
  (filterState) => filterState.visibleRowsLookup,
);

/**
 * @category Filtering
 * @ignore - do not document.
 */
export const gridFilteredRowsLookupSelector = createSelector(
  gridFilterStateSelector,
  (filterState) => filterState.filteredRowsLookup,
);

/**
 * @category Filtering
 * @ignore - do not document.
 */
export const gridFilteredDescendantCountLookupSelector = createSelector(
  gridFilterStateSelector,
  (filterState) => filterState.filteredDescendantCountLookup,
);

/**
 * Get the id and the model of the rows accessible after the filtering process.
 * Does not contain the collapsed children.
 * @category Filtering
 */
export const gridExpandedSortedRowEntriesSelector = createSelector(
  gridVisibleRowsLookupSelector,
  gridSortedRowEntriesSelector,
  (visibleRowsLookup, sortedRows) =>
    sortedRows.filter((row) => visibleRowsLookup[row.id] !== false),
);

/**
 * Get the id of the rows accessible after the filtering process.
 * Does not contain the collapsed children.
 * @category Filtering
 */
export const gridExpandedSortedRowIdsSelector = createSelector(
  gridExpandedSortedRowEntriesSelector,
  (visibleSortedRowEntries) => visibleSortedRowEntries.map((row) => row.id),
);

/**
 * Get the id and the model of the rows accessible after the filtering process.
 * Contains the collapsed children.
 * @category Filtering
 */
export const gridFilteredSortedRowEntriesSelector = createSelector(
  gridFilteredRowsLookupSelector,
  gridSortedRowEntriesSelector,
  (filteredRowsLookup, sortedRows) =>
    sortedRows.filter((row) => filteredRowsLookup[row.id] !== false),
);

/**
 * Get the id of the rows accessible after the filtering process.
 * Contains the collapsed children.
 * @category Filtering
 */
export const gridFilteredSortedRowIdsSelector = createSelector(
  gridFilteredSortedRowEntriesSelector,
  (filteredSortedRowEntries) => filteredSortedRowEntries.map((row) => row.id),
);

/**
 * Get the id and the model of the top level rows accessible after the filtering process.
 * @category Filtering
 */
export const gridFilteredSortedTopLevelRowEntriesSelector = createSelector(
  gridExpandedSortedRowEntriesSelector,
  gridRowTreeSelector,
  gridRowMaximumTreeDepthSelector,
  (visibleSortedRows, rowTree, rowTreeDepth) => {
    if (rowTreeDepth < 2) {
      return visibleSortedRows;
    }

    return visibleSortedRows.filter((row) => rowTree[row.id]?.depth === 0);
  },
);

/**
 * Get the amount of rows accessible after the filtering process.
 * @category Filtering
 */
export const gridExpandedRowCountSelector = createSelector(
  gridExpandedSortedRowEntriesSelector,
  (visibleSortedRows) => visibleSortedRows.length,
);

/**
 * Get the amount of top level rows accessible after the filtering process.
 * @category Filtering
 */
export const gridFilteredTopLevelRowCountSelector = createSelector(
  gridFilteredSortedTopLevelRowEntriesSelector,
  (visibleSortedTopLevelRows) => visibleSortedTopLevelRows.length,
);

/**
 * @category Filtering
 * @ignore - do not document.
 */
export const gridFilterActiveItemsSelector = createSelector(
  gridFilterModelSelector,
  gridColumnLookupSelector,
  (filterModel, columnLookup) =>
    filterModel.items?.filter((item) => {
      if (!item.field) {
        return false;
      }
      const column = columnLookup[item.field];
      if (!column?.filterOperators || column?.filterOperators?.length === 0) {
        return false;
      }
      const filterOperator = column.filterOperators.find(
        (operator) => operator.value === item.operator,
      );
      if (!filterOperator) {
        return false;
      }
      return (
        !filterOperator.InputComponent || (item.value != null && item.value?.toString() !== '')
      );
    }),
);

export type GridFilterActiveItemsLookup = { [field: string]: GridFilterItem[] };

/**
 * @category Filtering
 * @ignore - do not document.
 */
export const gridFilterActiveItemsLookupSelector = createSelector(
  gridFilterActiveItemsSelector,
  (activeFilters) => {
    const result: GridFilterActiveItemsLookup = activeFilters.reduce<GridFilterActiveItemsLookup>(
      (res, filterItem) => {
        if (!res[filterItem.field!]) {
          res[filterItem.field!] = [filterItem];
        } else {
          res[filterItem.field!].push(filterItem);
        }
        return res;
      },
      {},
    );

    return result;
  },
);
