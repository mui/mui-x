import { createSelector } from 'reselect';
import { RowId, RowModel } from '../../../models/rows';
import { SortDirection, SortModel } from '../../../models/sortModel';
import { GridState } from '../core/gridState';
import { RowsLookup, rowsLookupSelector, unorderedRowModelsSelector } from '../rows/rowsSelector';
import { SortingState } from './sortingState';

const sortingStateSelector = (state: GridState) => state.sorting;
export const sortedRowIdsSelector = createSelector<GridState, SortingState, RowId[]>(
  sortingStateSelector,
  (sortingState: SortingState) => {
    return sortingState.sortedRows;
  },
);
export const sortedRowsSelector = createSelector<
  GridState,
  RowId[],
  RowsLookup,
  RowModel[],
  RowModel[]
>(
  sortedRowIdsSelector,
  rowsLookupSelector,
  unorderedRowModelsSelector,
  (sortedIds: RowId[], idRowsLookup, unordered) => {
    return sortedIds.length > 0 ? sortedIds.map((id) => idRowsLookup[id]) : unordered;
  },
);
export const sortModelSelector = createSelector<GridState, SortingState, SortModel>(
  sortingStateSelector,
  (sorting) => sorting.sortModel,
);

export type SortColumnLookup = Record<string, { sortDirection: SortDirection; sortIndex?: number }>;
export const sortColumnLookupSelector = createSelector<
  GridState,
  SortingState,
  SortModel,
  SortColumnLookup
>(sortingStateSelector, sortModelSelector, (state, sortModel: SortModel) => {
  const result: SortColumnLookup = sortModel.reduce((res, sortItem, index) => {
    res[sortItem.field] = {
      sortDirection: sortItem.sort,
      sortIndex: sortModel.length > 1 ? index + 1 : undefined,
    };
    return res;
  }, {});
  return result;
});
