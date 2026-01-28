import { createSelector } from '@base-ui/utils/store';
import type { SortingState } from './types';

export const selectSortModel = createSelector((state: SortingState) => state.sorting.sortModel);

/**
 * Retreive ordered row ids.
 */
export const selectSortedRowIds = createSelector(
  (state: SortingState) => state.sorting.sortedRowIds,
);

export const sortingSelectors = {
  sortModel: selectSortModel,
  sortedRowIds: selectSortedRowIds,
};
