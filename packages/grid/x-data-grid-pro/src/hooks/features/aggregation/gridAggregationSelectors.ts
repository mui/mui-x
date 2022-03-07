import { gridColumnLookupSelector } from '@mui/x-data-grid';
import { createSelector } from '@mui/x-data-grid/internals';
import { GridStatePro } from '../../../models/gridStatePro';
import { sanitizeAggregationModel } from './gridAggregationUtils';

export const gridAggregationStateSelector = (state: GridStatePro) => state.aggregation;

export const gridAggregationModelSelector = createSelector(
  gridAggregationStateSelector,
  (aggregationState) => aggregationState.model,
);

export const gridAggregationSanitizedModelSelector = createSelector(
  gridAggregationModelSelector,
  gridColumnLookupSelector,
  (model, columnsLookup) => sanitizeAggregationModel(model, columnsLookup),
);
