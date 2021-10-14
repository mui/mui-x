import { createSelector } from 'reselect';
import { GridRowId, GridRowModel, GridRowsLookup } from '../../../models/gridRows';
import { GridSortDirection, GridSortModel } from '../../../models/gridSortModel';
import { GridState } from '../../../models/gridState';
import { gridRowsLookupSelector, unorderedGridRowIdsSelector } from '../rows/gridRowsSelector';
import { GridSortingState } from './gridSortingState';

const sortingGridStateSelector = (state: GridState) => state.sorting;

export const sortedGridRowIdsSelector = createSelector(
  sortingGridStateSelector,
  unorderedGridRowIdsSelector,
  (sortingState: GridSortingState, allRows: GridRowId[]) =>
    sortingState.sortedRows.length ? sortingState.sortedRows : allRows,
);

export const sortedGridRowsSelector = createSelector(
  sortedGridRowIdsSelector,
  gridRowsLookupSelector,
  (sortedIds: GridRowId[], idRowsLookup: GridRowsLookup) => {
    const map = new Map<GridRowId, GridRowModel>();
    sortedIds.forEach((id) => {
      map.set(id, idRowsLookup[id]);
    });
    return map;
  },
);

export const gridSortModelSelector = createSelector(
  sortingGridStateSelector,
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
