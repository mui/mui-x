import { createSelector } from 'reselect';
import { GridSortDirection, GridSortModel } from '../../../models/gridSortModel';
import { GridState } from '../../../models/gridState';
import { gridRowsLookupSelector } from '../rows/gridRowsSelector';

/**
 * @category Sorting
 * @ignore - do not document.
 */
const gridSortingStateSelector = (state: GridState) => state.sorting;

/**
 * Get the id of the rows after the sorting process.
 * @category Sorting
 */
export const gridSortedRowIdsSelector = createSelector(
  gridSortingStateSelector,
  (sortingState) => sortingState.sortedRows,
);

/**
 * Get the id and the model of the rows after the sorting process.
 * @category Sorting
 */
export const gridSortedRowEntriesSelector = createSelector(
  gridSortedRowIdsSelector,
  gridRowsLookupSelector,
  (sortedIds, idRowsLookup) => sortedIds.map((id) => ({ id, model: idRowsLookup[id] })),
);

/**
 * Get the current sorting model.
 * @category Sorting
 */
export const gridSortModelSelector = createSelector(
  gridSortingStateSelector,
  (sorting) => sorting.sortModel,
);

export type GridSortColumnLookup = Record<
  string,
  { sortDirection: GridSortDirection; sortIndex?: number }
>;

/**
 * @category Sorting
 * @ignore - do not document.
 */
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
