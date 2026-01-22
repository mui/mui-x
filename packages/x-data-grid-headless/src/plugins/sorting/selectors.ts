import { createSelector, createSelectorMemoized } from '@base-ui/utils/store';
import type { SortingState, SortColumnLookup } from './types';

/**
 * Selector for the current sort model.
 */
export const selectSortModel = createSelector((state: SortingState) => state.sorting.sortModel);

/**
 * Selector for the sorted row IDs.
 */
export const selectSortedRowIds = createSelector(
  (state: SortingState) => state.sorting.sortedRowIds,
);

/**
 * Selector for the sort column lookup.
 * Returns a map of field to sort information (direction and index).
 */
export const selectSortColumnLookup = createSelectorMemoized(
  selectSortModel,
  (sortModel): SortColumnLookup => {
    const lookup: SortColumnLookup = {};
    sortModel.forEach((item, index) => {
      lookup[item.field] = {
        sortDirection: item.sort,
        sortIndex: index,
      };
    });
    return lookup;
  },
);

/**
 * Selector for whether any sorting is active.
 */
export const selectIsSorted = createSelectorMemoized(selectSortModel, (sortModel) => {
  return sortModel.length > 0 && sortModel.some((item) => item.sort !== null);
});

/**
 * All sorting selectors bundled together.
 */
export const sortingSelectors = {
  sortModel: selectSortModel,
  sortedRowIds: selectSortedRowIds,
  sortColumnLookup: selectSortColumnLookup,
  isSorted: selectIsSorted,
};
