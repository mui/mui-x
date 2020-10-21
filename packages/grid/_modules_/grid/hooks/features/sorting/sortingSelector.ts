import { createSelector } from 'reselect';
import { RowId, RowModel } from '../../../models/rows';
import { SortModel } from '../../../models/sortModel';
import { GridState } from '../core/gridState';
import { rowsLookupSelector, unorderedRowModelsSelector } from '../rows/rowsSelector';
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
  Record<RowId, RowModel>,
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
// export const isSorted
