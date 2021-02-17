import { createSelector } from 'reselect';
import { FilterItem } from '../../../models/filterItem';
import { RowModel } from '../../../models/rows';
import { GridState } from '../core/gridState';
import { gridRowCountSelector } from '../rows/gridRowsSelector';
import { sortedGridRowsSelector } from '../sorting/gridSortingSelector';
import { FilterModelState } from './FilterModelState';
import { VisibleGridRowsState } from './visibleGridRowsState';

export const visibleGridRowsStateSelector = (state: GridState) => state.visibleRows;

export const visibleSortedGridRowsSelector = createSelector<
  GridState,
  VisibleGridRowsState,
  RowModel[],
  RowModel[]
>(
  visibleGridRowsStateSelector,
  sortedGridRowsSelector,
  (visibleRowsState, sortedRows: RowModel[]) => {
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

export const filterGridStateSelector: (state: GridState) => FilterModelState = (state) =>
  state.filter;

export const activeGridFilterItemsSelector = createSelector<
  GridState,
  FilterModelState,
  FilterItem[]
>(
  filterGridStateSelector,
  (filterModel) =>
    filterModel.items?.filter((item) => item.value != null && item.value?.toString() !== ''), // allows to count false or 0
);

export const filterGridItemsCounterSelector = createSelector<GridState, FilterItem[], number>(
  activeGridFilterItemsSelector,
  (activeFilters) => activeFilters.length,
);

export type FilterColumnLookup = Record<string, FilterItem[]>;
export const filterGridColumnLookupSelector = createSelector<
  GridState,
  FilterItem[],
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
