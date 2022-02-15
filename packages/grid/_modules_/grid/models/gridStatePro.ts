import type {
  GridColumnPinningState,
  GridColumnReorderState,
  GridColumnResizeState,
  GridRowGroupingInitialState,
  GridRowGroupingState,
  GridDetailPanelState,
  GridDetailPanelInitialState,
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
  detailPanel: GridDetailPanelState;
}

/**
 * The initial state of `DataGridPro`.
 * TODO: Move to `x-data-grid-pro` folder
 */
export interface GridInitialStatePro extends GridInitialStateCommunity {
  rowGrouping?: GridRowGroupingInitialState;
  pinnedColumns?: GridColumnPinningState;
  detailPanel?: GridDetailPanelInitialState;
}
