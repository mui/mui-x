import { createSelector } from '../../../utils/createSelector';
import { GridFilterItem } from '../../../models/gridFilterItem';
import { GridState } from '../../../models/gridState';
import { gridSortedRowEntriesSelector } from '../sorting/gridSortingSelector';
import { gridColumnLookupSelector } from '../columns/gridColumnsSelector';
import { gridRowTreeDepthSelector, gridRowTreeSelector } from '../rows';

/**
 * @category Filtering
 */
export const gridFilterStateSelector = (state: GridState) => state.filter;

/**
 * Get the current filter model.
 * @category Filtering
 */
export const gridFilterModelSelector = createSelector(
  gridFilterStateSelector,
  (filterState) => filterState.filterModel,
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
export const gridVisibleSortedRowEntriesSelector = createSelector(
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
export const gridVisibleSortedRowIdsSelector = createSelector(
  gridVisibleSortedRowEntriesSelector,
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
 * @category Filtering
 * @deprecated Use `gridVisibleSortedRowIdsSelector` instead
 * @ignore - do not document.
 */
export const gridVisibleRowsSelector = gridVisibleSortedRowIdsSelector;

/**
 * Get the id and the model of the top level rows accessible after the filtering process.
 * @category Filtering
 */
export const gridVisibleSortedTopLevelRowEntriesSelector = createSelector(
  gridVisibleSortedRowEntriesSelector,
  gridRowTreeSelector,
  gridRowTreeDepthSelector,
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
export const gridVisibleRowCountSelector = createSelector(
  gridVisibleSortedRowEntriesSelector,
  (visibleSortedRows) => visibleSortedRows.length,
);

/**
 * Get the amount of top level rows accessible after the filtering process.
 * @category Filtering
 */
export const gridVisibleTopLevelRowCountSelector = createSelector(
  gridVisibleSortedTopLevelRowEntriesSelector,
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
      if (!item.columnField) {
        return false;
      }
      const column = columnLookup[item.columnField];
      if (!column?.filterOperators || column?.filterOperators?.length === 0) {
        return false;
      }
      const filterOperator = column.filterOperators.find(
        (operator) => operator.value === item.operatorValue,
      );
      if (!filterOperator) {
        return false;
      }
      return (
        !filterOperator.InputComponent || (item.value != null && item.value?.toString() !== '')
      );
    }),
);

export type GridFilterActiveItemsLookup = { [columnField: string]: GridFilterItem[] };

/**
 * @category Filtering
 * @ignore - do not document.
 */
export const gridFilterActiveItemsLookupSelector = createSelector(
  gridFilterActiveItemsSelector,
  (activeFilters) => {
    const result: GridFilterActiveItemsLookup = activeFilters.reduce((res, filterItem) => {
      if (!res[filterItem.columnField!]) {
        res[filterItem.columnField!] = [filterItem];
      } else {
        res[filterItem.columnField!].push(filterItem);
      }
      return res;
    }, {} as GridFilterActiveItemsLookup);

    return result;
  },
);
