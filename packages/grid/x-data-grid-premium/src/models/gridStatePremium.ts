import {
  GridInitialState as GridInitialStatePro,
  GridState as GridStatePro,
} from '@mui/x-data-grid-pro';
import type { GridRowGroupingState, GridRowGroupingInitialState } from '../hooks';

/**
 * The state of `DataGridPro`.
 */
export interface GridStatePremium extends GridStatePro {
  rowGrouping: GridRowGroupingState;
}

/**
 * The initial state of `DataGridPro`.
 */
export interface GridInitialStatePremium extends GridInitialStatePro {
  rowGrouping?: GridRowGroupingInitialState;
}
