import { createSelector } from '@base-ui/utils/store';
import type { SortingSelectors, SortingState } from './types';

export const selectSortModel = createSelector((state: SortingState) => state.sorting.model);

export const sortingSelectors: SortingSelectors = {
  model: selectSortModel,
};
