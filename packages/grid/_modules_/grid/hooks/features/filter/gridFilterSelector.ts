import { createSelector } from 'reselect';
import { GridFilterItem } from '../../../models/gridFilterItem';
import { GridRowModel } from '../../../models/gridRows';
import { GridState } from '../core/gridState';
import { gridRowCountSelector } from '../rows/gridRowsSelector';
import { sortedGridRowsSelector } from '../sorting/gridSortingSelector';
import { GridFilterModelState } from './gridFilterModelState';
import { VisibleGridRowsState } from './visibleGridRowsState';

export const visibleGridRowsStateSelector = (state: GridState) => state.visibleRows;

export const visibleSortedGridRowsSelector = createSelector<
  GridState,
  VisibleGridRowsState,
  GridRowModel[],
  GridRowModel[]
>(
  visibleGridRowsStateSelector,
  sortedGridRowsSelector,
  (visibleRowsState, sortedRows: GridRowModel[]) => {
    return [...sortedRows].filter((row) => visibleRowsState.visibleRowsLookup[row.id] !== false);
  },
);

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

export const filterGridStateSelector: (state: GridState) => GridFilterModelState = (state) =>
  state.filter;

export const activeGridFilterItemsSelector = createSelector<
  GridState,
  GridFilterModelState,
  GridFilterItem[]
>(
  filterGridStateSelector,
  (filterModel) =>
    filterModel.items?.filter((item) => item.value != null && item.value?.toString() !== ''), // allows to count false or 0
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
