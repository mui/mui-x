import { createSelector } from '@base-ui/utils/store';
import type { FilteringSelectors, FilteringState, FilterModel } from './types';
import type { GridRowId } from '../internal/rows/rowUtils';

export const selectFilterModel = createSelector(
  (state: FilteringState) => state.filtering.model,
);

export const selectFilteredRowIds = createSelector(
  (state: FilteringState) => state.filtering.filteredRowIds,
);

export const filteringSelectors: FilteringSelectors = {
  model: selectFilterModel as (state: FilteringState) => FilterModel,
  filteredRowIds: selectFilteredRowIds as (state: FilteringState) => GridRowId[],
};
