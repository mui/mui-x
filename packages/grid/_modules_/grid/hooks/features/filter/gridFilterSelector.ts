import { createSelector } from 'reselect';
import { GridFilterItem } from '../../../models/gridFilterItem';
import { GridRowId, GridRowModel } from '../../../models/gridRows';
import { GridColumnLookup } from '../../../models/colDef/gridColDef';
import { GridState } from '../core/gridState';
import { gridRowCountSelector } from '../rows/gridRowsSelector';
import { sortedGridRowsSelector } from '../sorting/gridSortingSelector';
import { gridColumnLookupSelector } from '../columns/gridColumnsSelector';
import { GridFilterModel } from '../../../models/gridFilterModel';
import { VisibleGridRowsState } from './visibleGridRowsState';

export const visibleGridRowsStateSelector = (state: GridState) => state.visibleRows;

export const visibleSortedGridRowsSelector = createSelector<
  GridState,
  VisibleGridRowsState,
  Map<GridRowId, GridRowModel>,
  Map<GridRowId, GridRowModel>
>(visibleGridRowsStateSelector, sortedGridRowsSelector, (visibleRowsState, sortedRows) => {
  const map = new Map();
  sortedRows.forEach((row, id) => {
    if (visibleRowsState.visibleRowsLookup[id] !== false) {
      map.set(id, row);
    }
  });
  return map;
});

export const visibleSortedGridRowsAsArraySelector = createSelector<
  GridState,
  Map<GridRowId, GridRowModel>,
  [GridRowId, GridRowModel][]
>(visibleSortedGridRowsSelector, (visibleSortedRows) => {
  return [...visibleSortedRows.entries()];
});

export const visibleSortedGridRowIdsSelector = createSelector<
  GridState,
  Map<GridRowId, GridRowModel>,
  GridRowId[]
>(visibleSortedGridRowsSelector, (visibleSortedRows) => {
  return [...visibleSortedRows.keys()];
});

export const visibleGridRowCountSelector = createSelector<
  GridState,
  VisibleGridRowsState,
  number,
  number
>(visibleGridRowsStateSelector, gridRowCountSelector, (visibleRowsState, totalRowsCount) => {
  if (visibleRowsState.visibleRows == null) {
    return totalRowsCount;
  }
  return visibleRowsState.visibleRows.length;
});

export const filterGridStateSelector: (state: GridState) => GridFilterModel = (state) =>
  state.filter;

export const activeGridFilterItemsSelector = createSelector<
  GridState,
  GridFilterModel,
  GridColumnLookup,
  GridFilterItem[]
>(filterGridStateSelector, gridColumnLookupSelector, (filterModel, columnLookup) =>
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
    return !filterOperator.InputComponent || (item.value != null && item.value?.toString() !== '');
  }),
);

export const filterGridItemsCounterSelector = createSelector<GridState, GridFilterItem[], number>(
  activeGridFilterItemsSelector,
  (activeFilters) => activeFilters.length,
);

export type FilterColumnLookup = Record<string, GridFilterItem[]>;
export const filterGridColumnLookupSelector = createSelector<
  GridState,
  GridFilterItem[],
  FilterColumnLookup
>(activeGridFilterItemsSelector, (activeFilters) => {
  const result: FilterColumnLookup = activeFilters.reduce((res, filterItem) => {
    if (!res[filterItem.columnField!]) {
      res[filterItem.columnField!] = [filterItem];
    } else {
      res[filterItem.columnField!].push(filterItem);
    }
    return res;
  }, {} as FilterColumnLookup);

  return result;
});
