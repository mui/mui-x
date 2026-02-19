import { createSelector } from '@base-ui/utils/store';
import type { SortingState } from './types';

export const selectSortModel = createSelector((state: SortingState) => state.sorting.model);

export const sortingSelectors = {
  model: selectSortModel,
};
