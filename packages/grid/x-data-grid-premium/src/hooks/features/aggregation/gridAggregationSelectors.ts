import { gridColumnLookupSelector } from '@mui/x-data-grid-pro';
import { createSelector } from '@mui/x-data-grid-pro/internals';
import { GridStatePremium } from '../../../models/gridStatePremium';
import { sanitizeAggregationModel } from './gridAggregationUtils';

export const gridAggregationStateSelector = (state: GridStatePremium) => state.aggregation;

export const gridAggregationModelSelector = createSelector(
  gridAggregationStateSelector,
  (aggregationState) => aggregationState.model,
);

export const gridAggregationSanitizedModelSelector = createSelector(
  gridAggregationModelSelector,
  gridColumnLookupSelector,
  (model, columnsLookup) => sanitizeAggregationModel(model, columnsLookup),
);

export const gridAggregationLookupSelector = createSelector(
  gridAggregationStateSelector,
  (aggregationState) => aggregationState.lookup,
);
