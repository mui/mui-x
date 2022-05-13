import {
  GridInitialState as GridInitialStateCommunity,
  GridState as GridStateCommunity,
} from '@mui/x-data-grid';
import type {
  GridDetailPanelState,
  GridDetailPanelInitialState,
  GridColumnReorderState,
  GridColumnResizeState,
  GridColumnPinningState,
} from '../hooks';
import type {
  GridRowGroupingState,
  GridRowGroupingInitialState,
} from '../hooks/features/rowGrouping';

/**
 * The state of `DataGridPro`.
 */
export interface GridStatePro extends GridStateCommunity {
  columnReorder: GridColumnReorderState;
  columnResize: GridColumnResizeState;
  pinnedColumns: GridColumnPinningState;
  detailPanel: GridDetailPanelState;
  rowGrouping: GridRowGroupingState;
}

/**
 * The initial state of `DataGridPro`.
 */
export interface GridInitialStatePro extends GridInitialStateCommunity {
  pinnedColumns?: GridColumnPinningState;
  detailPanel?: GridDetailPanelInitialState;
  rowGrouping?: GridRowGroupingInitialState;
}
