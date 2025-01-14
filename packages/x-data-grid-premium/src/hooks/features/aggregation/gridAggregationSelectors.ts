import { createSelector } from '@mui/x-data-grid-pro/internals';
import { GridApiPremium } from '../../../models/gridApiPremium';

export const gridAggregationStateSelector = (apiRef: React.RefObject<GridApiPremium>) =>
  apiRef.current.state.aggregation;

/**
 * Get the aggregation model, containing the aggregation function of each column.
 * If a column is not in the model, it is not aggregated.
 * @category Aggregation
 */
export const gridAggregationModelSelector = createSelector(
  gridAggregationStateSelector,
  (aggregationState) => aggregationState.model,
);

/**
 * Get the aggregation results as a lookup.
 * @category Aggregation
 */
export const gridAggregationLookupSelector = createSelector(
  gridAggregationStateSelector,
  (aggregationState) => aggregationState.lookup,
);
