import { createSelector } from 'reselect';
import { GridFilterItem } from '../../../models/gridFilterItem';
import { GridRowId, GridRowModel } from '../../../models/gridRows';
import { GridState } from '../core/gridState';
import { gridRowCountSelector } from '../rows/gridRowsSelector';
import { sortedGridRowsSelector } from '../sorting/gridSortingSelector';
import { gridColumnLookupSelector } from '../columns/gridColumnsSelector';

export const visibleGridRowsStateSelector = (state: GridState) => state.visibleRows;

export const visibleSortedGridRowsSelector = createSelector(
  visibleGridRowsStateSelector,
  sortedGridRowsSelector,
  (visibleRowsState, sortedRows) => {
    const map = new Map<GridRowId, GridRowModel>();
    sortedRows.forEach((row, id) => {
      if (visibleRowsState.visibleRowsLookup[id] !== false) {
        map.set(id, row);
      }
    });
    return map;
  },
);

export const visibleSortedGridRowsAsArraySelector = createSelector(
  visibleSortedGridRowsSelector,
  (visibleSortedRows) => [...visibleSortedRows.entries()],
);

export const visibleSortedGridRowIdsSelector = createSelector(
  visibleSortedGridRowsSelector,
  (visibleSortedRows) => [...visibleSortedRows.keys()],
);

export const visibleGridRowCountSelector = createSelector(
  visibleGridRowsStateSelector,
  gridRowCountSelector,
  (visibleRowsState, totalRowsCount) => {
    if (visibleRowsState.visibleRows == null) {
      return totalRowsCount;
    }
    return visibleRowsState.visibleRows.length;
  },
);

export const filterGridStateSelector = (state: GridState) => state.filter;

export const activeGridFilterItemsSelector = createSelector(
  filterGridStateSelector,
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
