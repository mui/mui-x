import { createSelector } from '@base-ui/utils/store';
import type { FilteringSelectors, FilteringState } from './types';

export const selectFilterModel = createSelector((state: FilteringState) => state.filtering.model);

export const selectFilteredRowIds = createSelector(
  (state: FilteringState) => state.filtering.filteredRowIds,
);

const EMPTY_QUICK_FILTER_VALUES: any[] = [];

export const selectQuickFilterValues = createSelector(
  selectFilterModel,
  (model) => model.quickFilterValues ?? EMPTY_QUICK_FILTER_VALUES,
);

export const filteringSelectors: FilteringSelectors = {
  model: selectFilterModel,
  filteredRowIds: selectFilteredRowIds,
  quickFilterValues: selectQuickFilterValues,
};
