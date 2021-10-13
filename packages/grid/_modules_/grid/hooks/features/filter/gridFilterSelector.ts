import { createSelector } from 'reselect';
import { GridFilterItem } from '../../../models/gridFilterItem';
import { GridState } from '../../../models/gridState';
import { gridSortedRowEntriesSelector } from '../sorting/gridSortingSelector';
import { gridColumnLookupSelector } from '../columns/gridColumnsSelector';
import { gridRowTreeSelector } from '../rows';

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

export const gridSortedVisibleRowEntriesSelector = createSelector(
  gridVisibleRowsLookupSelector,
  gridSortedRowEntriesSelector,
  (visibleRowsLookup, sortedRows) =>
    sortedRows.filter((row) => visibleRowsLookup[row.id] !== false),
);

export const gridSortedVisibleTopLevelRowEntriesSelector = createSelector(
  gridSortedVisibleRowEntriesSelector,
  gridRowTreeSelector,
  (sortedVisibleRows, rowTree) => sortedVisibleRows.filter((row) => rowTree[row.id]?.depth === 0),
);

export const gridVisibleRowCountSelector = createSelector(
  gridSortedVisibleRowEntriesSelector,
  (sortedVisibleRows) => sortedVisibleRows.length,
);

export const gridVisibleTopLevelRowCountSelector = createSelector(
  gridSortedVisibleTopLevelRowEntriesSelector,
  (sortedVisibleTopLevelRows) => sortedVisibleTopLevelRows.length,
);

export const activeGridFilterItemsSelector = createSelector(
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

export const filterGridItemsCounterSelector = createSelector(
  activeGridFilterItemsSelector,
  (activeFilters) => activeFilters.length,
);

export type FilterColumnLookup = Record<string, GridFilterItem[]>;
export const filterGridColumnLookupSelector = createSelector(
  activeGridFilterItemsSelector,
  (activeFilters) => {
    const result: FilterColumnLookup = activeFilters.reduce((res, filterItem) => {
      if (!res[filterItem.columnField!]) {
        res[filterItem.columnField!] = [filterItem];
      } else {
        res[filterItem.columnField!].push(filterItem);
      }
      return res;
    }, {} as FilterColumnLookup);

    return result;
  },
);
