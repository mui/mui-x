import { createSelector } from '@mui/x-data-grid-pro/internals';
import { GridStatePremium } from '../../../models/gridStatePremium';

export const gridAggregationStateSelector = (state: GridStatePremium) => state.aggregation;

export const gridAggregationModelSelector = createSelector(
  gridAggregationStateSelector,
  (aggregationState) => aggregationState.model,
);

export const gridAggregationLookupSelector = createSelector(
  gridAggregationStateSelector,
  (aggregationState) => aggregationState.lookup,
);
