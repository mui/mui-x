import { createSelector } from '@base-ui/utils/store';
import type { FilteringState } from './types';

export const selectFilterModel = createSelector((state: FilteringState) => state.filtering.model);

export const filteringSelectors = {
  model: selectFilterModel,
};
