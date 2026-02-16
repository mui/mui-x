import { createSelector } from '@base-ui/utils/store';
import type { FilteringState } from './types';

export const selectFilterModel = createSelector((state: FilteringState) => state.filtering.model);

const EMPTY_QUICK_FILTER_VALUES: any[] = [];

export const selectQuickFilterValues = createSelector(
  selectFilterModel,
  (model) => model.quickFilterValues ?? EMPTY_QUICK_FILTER_VALUES,
);

export const filteringSelectors = {
  model: selectFilterModel,
  quickFilterValues: selectQuickFilterValues,
};
