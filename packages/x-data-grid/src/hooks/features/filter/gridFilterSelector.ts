import { createSelector, createSelectorMemoized } from '../../../utils/createSelector';
import { GridRowId } from '../../../models/gridRows';
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
 * @category Visible rows
 * @ignore - do not document.
 */
export const gridVisibleRowsLookupSelector = (state: GridStateCommunity) => state.visibleRowsLookup;

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
export const gridFilteredChildrenCountLookupSelector = createSelector(
  gridFilterStateSelector,
  (filterState) => filterState.filteredChildrenCountLookup,
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
export const gridExpandedSortedRowEntriesSelector = createSelectorMemoized(
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
export const gridExpandedSortedRowIdsSelector = createSelectorMemoized(
  gridExpandedSortedRowEntriesSelector,
  (visibleSortedRowEntries) => visibleSortedRowEntries.map((row) => row.id),
);

/**
 * Get the id and the model of the rows accessible after the filtering process.
 * Contains the collapsed children.
 * @category Filtering
 */
export const gridFilteredSortedRowEntriesSelector = createSelectorMemoized(
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
export const gridFilteredSortedRowIdsSelector = createSelectorMemoized(
  gridFilteredSortedRowEntriesSelector,
  (filteredSortedRowEntries) => filteredSortedRowEntries.map((row) => row.id),
);

/**
 * Get the ids to position in the current tree level lookup of the rows accessible after the filtering process.
 * Does not contain the collapsed children.
 * @category Filtering
 * @ignore - do not document.
 */
export const gridExpandedSortedRowTreeLevelPositionLookupSelector = createSelectorMemoized(
  gridExpandedSortedRowIdsSelector,
  gridRowTreeSelector,
  (visibleSortedRowIds, rowTree) => {
    const depthPositionCounter: Record<number, number> = {};
    let lastDepth = 0;

    return visibleSortedRowIds.reduce((acc: Record<GridRowId, number>, rowId) => {
      const rowNode = rowTree[rowId];

      if (!depthPositionCounter[rowNode.depth]) {
        depthPositionCounter[rowNode.depth] = 0;
      }

      // going deeper in the tree should reset the counter
      // since it might have been used in some other branch at the same level, up in the tree
      // going back up should keep the counter and continue where it left off
      if (rowNode.depth > lastDepth) {
        depthPositionCounter[rowNode.depth] = 0;
      }

      lastDepth = rowNode.depth;
      depthPositionCounter[rowNode.depth] += 1;
      acc[rowId] = depthPositionCounter[rowNode.depth];
      return acc;
    }, {});
  },
);

/**
 * Get the id and the model of the top level rows accessible after the filtering process.
 * @category Filtering
 */
export const gridFilteredSortedTopLevelRowEntriesSelector = createSelectorMemoized(
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
 * Get the amount of rows accessible after the filtering process.
 * Includes top level and descendant rows.
 * @category Filtering
 */
export const gridFilteredRowCountSelector = createSelector(
  gridFilteredSortedRowEntriesSelector,
  (filteredSortedRowEntries) => filteredSortedRowEntries.length,
);

/**
 * Get the amount of descendant rows accessible after the filtering process.
 * @category Filtering
 */
export const gridFilteredDescendantRowCountSelector = createSelector(
  gridFilteredRowCountSelector,
  gridFilteredTopLevelRowCountSelector,
  (totalRowCount, topLevelRowCount) => totalRowCount - topLevelRowCount,
);

/**
 * @category Filtering
 * @ignore - do not document.
 */
export const gridFilterActiveItemsSelector = createSelectorMemoized(
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
export const gridFilterActiveItemsLookupSelector = createSelectorMemoized(
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
