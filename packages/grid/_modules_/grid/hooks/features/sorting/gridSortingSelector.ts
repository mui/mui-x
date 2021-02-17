import { createSelector } from 'reselect';
import { RowId, RowModel } from '../../../models/rows';
import { SortDirection, SortModel } from '../../../models/sortModel';
import { GridState } from '../core/gridState';
import {
  GridRowsLookup,
  gridRowsLookupSelector,
  unorderedGridRowModelsSelector,
} from '../rows/gridRowsSelector';
import { GridSortingState } from './gridSortingState';

const sortingGridStateSelector = (state: GridState) => state.sorting;
export const sortedGridRowIdsSelector = createSelector<GridState, GridSortingState, RowId[]>(
  sortingGridStateSelector,
  (sortingState: GridSortingState) => {
    return sortingState.sortedRows;
  },
);
export const sortedGridRowsSelector = createSelector<
  GridState,
  RowId[],
  GridRowsLookup,
  RowModel[],
  RowModel[]
>(
  sortedGridRowIdsSelector,
  gridRowsLookupSelector,
  unorderedGridRowModelsSelector,
  (sortedIds: RowId[], idRowsLookup, unordered) => {
    return sortedIds.length > 0 ? sortedIds.map((id) => idRowsLookup[id]) : unordered;
  },
);
export const gridSortModelSelector = createSelector<GridState, GridSortingState, SortModel>(
  sortingGridStateSelector,
  (sorting) => sorting.sortModel,
);

export type GridSortColumnLookup = Record<
  string,
  { sortDirection: SortDirection; sortIndex?: number }
>;
export const gridSortColumnLookupSelector = createSelector<
  GridState,
  SortModel,
  GridSortColumnLookup
>(gridSortModelSelector, (sortModel: SortModel) => {
  const result: GridSortColumnLookup = sortModel.reduce((res, sortItem, index) => {
    res[sortItem.field] = {
      sortDirection: sortItem.sort,
      sortIndex: sortModel.length > 1 ? index + 1 : undefined,
    };
    return res;
  }, {});
  return result;
});
