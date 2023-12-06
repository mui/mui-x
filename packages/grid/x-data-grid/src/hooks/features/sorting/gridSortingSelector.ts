import { createSelector, createSelectorMemoized } from '../../../utils/createSelector';
import { GridSortDirection, GridSortModel } from '../../../models/gridSortModel';
import { GridStateCommunity } from '../../../models/gridStateCommunity';
import { gridRowsLookupSelector } from '../rows/gridRowsSelector';

/**
 * @category Sorting
 * @ignore - do not document.
 */
const gridSortingStateSelector = (state: GridStateCommunity) => state.sorting;

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
export const gridSortedRowEntriesSelector = createSelectorMemoized(
  gridSortedRowIdsSelector,
  gridRowsLookupSelector,
  // TODO rows v6: Is this the best approach ?
  (sortedIds, idRowsLookup) => sortedIds.map((id) => ({ id, model: idRowsLookup[id] ?? {} })),
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
export const gridSortColumnLookupSelector = createSelectorMemoized(
  gridSortModelSelector,
  (sortModel: GridSortModel) => {
    const result = sortModel.reduce<GridSortColumnLookup>((res, sortItem, index) => {
      res[sortItem.field] = {
        sortDirection: sortItem.sort,
        sortIndex: sortModel.length > 1 ? index + 1 : undefined,
      };
      return res;
    }, {});
    return result;
  },
);
