import type {
  GridColumnPinningState,
  GridColumnReorderState,
  GridColumnResizeState,
  GridRowGroupingInitialState,
  GridRowGroupingState,
} from '../hooks';
import type { GridStateCommunity, GridInitialStateCommunity } from './gridStateCommunity';

/**
 * The state of `DataGridPro`.
 * TODO: Move to `x-data-grid-pro` folder
 */
export interface GridStatePro extends GridStateCommunity {
  columnReorder: GridColumnReorderState;
  columnResize: GridColumnResizeState;
  pinnedColumns: GridColumnPinningState;
  rowGrouping: GridRowGroupingState;
}

/**
 * The initial state of `DataGridPro`.
 * TODO: Move to `x-data-grid-pro` folder
 */
export interface GridInitialStatePro extends GridInitialStateCommunity {
  rowGrouping?: GridRowGroupingInitialState;
  pinnedColumns?: GridColumnPinningState;
}
