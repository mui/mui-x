import { createSelector } from '@base-ui/utils/store';
import type { SortingSelectors, SortingState } from './types';

export const selectSortModel = createSelector((state: SortingState) => state.sorting.model);

/**
 * Retrieve ordered row ids.
 */
export const selectSortedRowIds = createSelector(
  (state: SortingState) => state.sorting.sortedRowIds,
);

export const sortingSelectors: SortingSelectors = {
  model: selectSortModel,
  sortedRowIds: selectSortedRowIds,
};
