import {
  type GridInitialState as GridInitialStateCommunity,
  type GridState as GridStateCommunity,
  type GridColumnPinningState,
  type GridPinnedColumnFields,
} from '@mui/x-data-grid';
import {
  type GridDetailPanelState,
  type GridDetailPanelInitialState,
  type GridColumnReorderState,
} from '../hooks';
import { type GridDataSourceState } from '../hooks/features/dataSource/models';

/**
 * The state of Data Grid Pro.
 */
export interface GridStatePro extends GridStateCommunity {
  columnReorder: GridColumnReorderState;
  pinnedColumns: GridColumnPinningState;
  detailPanel: GridDetailPanelState;
  dataSource: GridDataSourceState;
}

/**
 * The initial state of Data Grid Pro.
 */
export interface GridInitialStatePro extends GridInitialStateCommunity {
  pinnedColumns?: GridPinnedColumnFields;
  detailPanel?: GridDetailPanelInitialState;
}
