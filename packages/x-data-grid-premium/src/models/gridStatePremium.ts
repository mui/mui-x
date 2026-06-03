import {
  type GridInitialState as GridInitialStatePro,
  type GridState as GridStatePro,
} from '@mui/x-data-grid-pro';
import {
  type GridRowGroupingState,
  type GridRowGroupingInitialState,
  type GridAggregationState,
  type GridAggregationInitialState,
  type GridCellSelectionModel,
} from '../hooks';
import {
  type GridPivotingInitialState,
  type GridPivotingState,
} from '../hooks/features/pivoting/gridPivotingInterfaces';
import {
  type GridAiAssistantInitialState,
  type GridAiAssistantState,
} from '../hooks/features/aiAssistant/gridAiAssistantInterfaces';
import {
  type GridSidebarInitialState,
  type GridSidebarState,
} from '../hooks/features/sidebar/gridSidebarState';
import {
  type GridChartsIntegrationState,
  type GridChartsIntegrationInitialState,
} from '../hooks/features/chartsIntegration/gridChartsIntegrationInterfaces';
import { type GridHistoryState } from '../hooks/features/history/gridHistoryInterfaces';

/**
 * The state of Data Grid Premium.
 */
export interface GridStatePremium extends GridStatePro {
  rowGrouping: GridRowGroupingState;
  aggregation: GridAggregationState;
  cellSelection: GridCellSelectionModel;
  pivoting: GridPivotingState;
  aiAssistant: GridAiAssistantState;
  sidebar: GridSidebarState;
  chartsIntegration: GridChartsIntegrationState;
  history: GridHistoryState;
}

/**
 * The initial state of Data Grid Premium.
 */
export interface GridInitialStatePremium extends GridInitialStatePro {
  rowGrouping?: GridRowGroupingInitialState;
  aggregation?: GridAggregationInitialState;
  cellSelection?: GridCellSelectionModel;
  pivoting?: GridPivotingInitialState;
  aiAssistant?: GridAiAssistantInitialState;
  sidebar?: GridSidebarInitialState;
  chartsIntegration?: GridChartsIntegrationInitialState;
}
