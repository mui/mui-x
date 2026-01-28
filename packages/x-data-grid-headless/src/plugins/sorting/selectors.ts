import { createSelector, createSelectorMemoized } from '@base-ui/utils/store';
import type { SortingState } from './types';

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
  isSorted: selectIsSorted,
};
