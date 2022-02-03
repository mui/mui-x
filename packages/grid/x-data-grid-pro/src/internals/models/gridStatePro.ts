import {
  GridInitialState as GridInitialStateCommunity,
  GridState as GridStateCommunity,
} from '@mui/x-data-grid';
import type {
  GridRowGroupingState,
  GridRowGroupingInitialState,
} from '../hooks/features/rowGrouping';
import type { GridColumnPinningState } from '../hooks/features/columnPinning';
import type { GridColumnReorderState } from '../hooks/features/columnReorder';
import type { GridColumnResizeState } from '../hooks/features/columnResize';

/**
 * The state of `DataGridPro`.
 */
export interface GridStatePro extends GridStateCommunity {
  columnReorder: GridColumnReorderState;
  columnResize: GridColumnResizeState;
  pinnedColumns: GridColumnPinningState;
  rowGrouping: GridRowGroupingState;
}

/**
 * The initial state of `DataGridPro`.
 */
export interface GridInitialStatePro extends GridInitialStateCommunity {
  rowGrouping?: GridRowGroupingInitialState;
  pinnedColumns?: GridColumnPinningState;
}
