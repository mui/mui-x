import {
  GridInitialState as GridInitialStatePro,
  GridState as GridStatePro,
} from '@mui/x-data-grid-pro';
import type {
  GridRowGroupingState,
  GridRowGroupingInitialState,
  GridAggregationState,
  GridAggregationInitialState,
} from '../hooks';

/**
 * The state of `DataGridPremium`.
 */
export interface GridStatePremium extends GridStatePro {
  rowGrouping: GridRowGroupingState;
  private_aggregation: GridAggregationState;
}

/**
 * The initial state of `DataGridPremium`.
 */
export interface GridInitialStatePremium extends GridInitialStatePro {
  rowGrouping?: GridRowGroupingInitialState;
  private_aggregation?: GridAggregationInitialState;
}
