import { createSelector } from 'reselect';
import { GridRowId } from '../../../models/gridRows';
import { GridSortDirection, GridSortModel } from '../../../models/gridSortModel';
import { GridState } from '../../../models/gridState';
import { gridRowsLookupSelector, gridRowIdsSelector } from '../rows/gridRowsSelector';
import { GridSortingState } from './gridSortingState';

const gridSortingStateSelector = (state: GridState) => state.sorting;

export const gridSortedRowIdsSelector = createSelector(
  gridSortingStateSelector,
  gridRowIdsSelector,
  (sortingState: GridSortingState, allRows: GridRowId[]) =>
    sortingState.sortedRows.length ? sortingState.sortedRows : allRows,
);

export const gridSortedRowEntriesSelector = createSelector(
  gridSortedRowIdsSelector,
  gridRowsLookupSelector,
  (sortedIds, idRowsLookup) => sortedIds.map((id) => ({ id, model: idRowsLookup[id] })),
);

export const gridSortModelSelector = createSelector(
  gridSortingStateSelector,
  (sorting) => sorting.sortModel,
);

export type GridSortColumnLookup = Record<
  string,
  { sortDirection: GridSortDirection; sortIndex?: number }
>;

export const gridSortColumnLookupSelector = createSelector(
  gridSortModelSelector,
  (sortModel: GridSortModel) => {
    const result: GridSortColumnLookup = sortModel.reduce((res, sortItem, index) => {
      res[sortItem.field] = {
        sortDirection: sortItem.sort,
        sortIndex: sortModel.length > 1 ? index + 1 : undefined,
      };
      return res;
    }, {});
    return result;
  },
);
