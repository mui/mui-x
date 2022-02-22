import type {
  GridInitialStateCommunity,
  GridStateCommunity,
} from '@mui/x-data-grid/internals/models/gridStateCommunity';
import type {
  GridRowGroupingState,
  GridDetailPanelState,
  GridDetailPanelInitialState,
  GridColumnReorderState,
  GridColumnResizeState,
  GridColumnPinningState,
  GridRowGroupingInitialState,
} from '../hooks';

/**
 * The state of `DataGridPro`.
 */
export interface GridStatePro extends GridStateCommunity {
  columnReorder: GridColumnReorderState;
  columnResize: GridColumnResizeState;
  pinnedColumns: GridColumnPinningState;
  rowGrouping: GridRowGroupingState;
  detailPanel: GridDetailPanelState;
}

/**
 * The initial state of `DataGridPro`.
 */
export interface GridInitialStatePro extends GridInitialStateCommunity {
  rowGrouping?: GridRowGroupingInitialState;
  pinnedColumns?: GridColumnPinningState;
  detailPanel?: GridDetailPanelInitialState;
}
