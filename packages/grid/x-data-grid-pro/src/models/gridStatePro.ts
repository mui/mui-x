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

/**
 * The state of `DataGridPro`.
 */
export interface GridStatePro extends GridStateCommunity {
  columnReorder: GridColumnReorderState;
  columnResize: GridColumnResizeState;
  pinnedColumns: GridColumnPinningState;
  detailPanel: GridDetailPanelState;
}

/**
 * The initial state of `DataGridPro`.
 */
export interface GridInitialStatePro extends GridInitialStateCommunity {
  pinnedColumns?: GridColumnPinningState;
  detailPanel?: GridDetailPanelInitialState;
}
