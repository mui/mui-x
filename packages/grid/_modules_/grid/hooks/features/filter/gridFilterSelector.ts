import { createSelector } from 'reselect';
import { GridFilterItem } from '../../../models/gridFilterItem';
import { GridState } from '../../../models/gridState';
import { gridSortedRowEntriesSelector } from '../sorting/gridSortingSelector';
import { gridColumnLookupSelector } from '../columns/gridColumnsSelector';
import { gridRowTreeDepthSelector, gridRowTreeSelector } from '../rows';

export const gridFilterStateSelector = (state: GridState) => state.filter;

export const gridFilterModelSelector = createSelector(
  gridFilterStateSelector,
  (filterState) => filterState.filterModel,
);

export const gridVisibleRowsSelector = createSelector(
  gridFilterStateSelector,
  (filterState) => filterState.visibleRows,
);

export const gridVisibleRowsLookupSelector = createSelector(
  gridFilterStateSelector,
  (filterState) => filterState.visibleRowsLookup,
);

export const gridVisibleDescendantCountLookupSelector = createSelector(
  gridFilterStateSelector,
  (filterState) => filterState.visibleDescendantsCountLookup,
);

export const gridVisibleSortedRowEntriesSelector = createSelector(
  gridVisibleRowsLookupSelector,
  gridSortedRowEntriesSelector,
  (visibleRowsLookup, sortedRows) =>
    sortedRows.filter((row) => visibleRowsLookup[row.id] !== false),
);

export const gridVisibleSortedRowIdsSelector = createSelector(
  gridVisibleSortedRowEntriesSelector,
  (visibleSortedRowEntries) => visibleSortedRowEntries.map((row) => row.id),
);

export const gridVisibleSortedTopLevelRowEntriesSelector = createSelector(
  gridVisibleSortedRowEntriesSelector,
  gridRowTreeSelector,
  gridRowTreeDepthSelector,
  (sortedVisibleRows, rowTree, rowTreeDepth) => {
    if (rowTreeDepth < 2) {
      return sortedVisibleRows;
    }

    return sortedVisibleRows.filter((row) => rowTree[row.id]?.depth === 0);
  },
);

export const gridVisibleRowCountSelector = createSelector(
  gridVisibleSortedRowEntriesSelector,
  (sortedVisibleRows) => sortedVisibleRows.length,
);

export const gridVisibleTopLevelRowCountSelector = createSelector(
  gridVisibleSortedTopLevelRowEntriesSelector,
  (sortedVisibleTopLevelRows) => sortedVisibleTopLevelRows.length,
);

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
