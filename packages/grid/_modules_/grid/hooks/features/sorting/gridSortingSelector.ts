import { createSelector } from 'reselect';
import { GridRowId, GridRowModel } from '../../../models/gridRows';
import { GridSortDirection, GridSortModel } from '../../../models/gridSortModel';
import { GridState } from '../core/gridState';
import {
  GridRowsLookup,
  gridRowsLookupSelector,
  unorderedGridRowIdsSelector,
  unorderedGridRowModelsSelector,
} from '../rows/gridRowsSelector';
import { GridSortingState } from './gridSortingState';

const sortingGridStateSelector = (state: GridState) => state.sorting;
export const sortedGridRowIdsSelector = createSelector<
  GridState,
  GridSortingState,
  GridRowId[],
  GridRowId[]
>(
  sortingGridStateSelector,
  unorderedGridRowIdsSelector,
  (sortingState: GridSortingState, allRows: GridRowId[]) => {
    return sortingState.sortedRows.length ? sortingState.sortedRows : allRows;
  },
);
export const sortedGridRowsSelector = createSelector<
  GridState,
  GridRowId[],
  GridRowsLookup,
  GridRowModel[],
  GridRowModel[]
>(
  sortedGridRowIdsSelector,
  gridRowsLookupSelector,
  unorderedGridRowModelsSelector,
  (sortedIds: GridRowId[], idRowsLookup, unordered) => {
    return sortedIds.length > 0 ? sortedIds.map((id) => idRowsLookup[id]) : unordered;
  },
);
export const gridSortModelSelector = createSelector<GridState, GridSortingState, GridSortModel>(
  sortingGridStateSelector,
  (sorting) => sorting.sortModel,
);

export type GridSortColumnLookup = Record<
  string,
  { sortDirection: GridSortDirection; sortIndex?: number }
>;
export const gridSortColumnLookupSelector = createSelector<
  GridState,
  GridSortModel,
  GridSortColumnLookup
>(gridSortModelSelector, (sortModel: GridSortModel) => {
  const result: GridSortColumnLookup = sortModel.reduce((res, sortItem, index) => {
    res[sortItem.field] = {
      sortDirection: sortItem.sort,
      sortIndex: sortModel.length > 1 ? index + 1 : undefined,
    };
    return res;
  }, {});
  return result;
});
