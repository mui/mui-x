import {
  GridInitialState as GridInitialStateCommunity,
  GridState as GridStateCommunity,
  GridColumnPinningState,
  GridPinnedColumnFields,
} from '@mui/x-data-grid';
import type {
  GridDetailPanelState,
  GridDetailPanelInitialState,
  GridColumnReorderState,
} from '../hooks';
import type { GridServerSideDataState } from '../hooks/features/serverSideData/interfaces';

/**
 * The state of `DataGridPro`.
 */
export interface GridStatePro extends GridStateCommunity {
  columnReorder: GridColumnReorderState;
  pinnedColumns: GridColumnPinningState;
  detailPanel: GridDetailPanelState;
  serverSideData: GridServerSideDataState;
}

/**
 * The initial state of `DataGridPro`.
 */
export interface GridInitialStatePro extends GridInitialStateCommunity {
  pinnedColumns?: GridPinnedColumnFields;
  detailPanel?: GridDetailPanelInitialState;
}
