import { createSelector } from '@mui/x-data-grid-pro/internals';
import { GridStatePremium } from '../../../models/gridStatePremium';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const private_gridAggregationStateSelector = (state: GridStatePremium) =>
  state.private_aggregation;

export const gridAggregationModelSelector = createSelector(
  private_gridAggregationStateSelector,
  (aggregationState) => aggregationState.model,
);

export const gridAggregationLookupSelector = createSelector(
  private_gridAggregationStateSelector,
  (aggregationState) => aggregationState.lookup,
);
