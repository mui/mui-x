import type {
  GridInitialState as GridInitialStatePro,
  GridState as GridStatePro,
} from '@mui/x-data-grid-pro';
import type {
  GridRowGroupingState,
  GridRowGroupingInitialState,
  GridAggregationState,
  GridAggregationInitialState,
  GridCellSelectionModel,
} from '../hooks';
import type {
  GridPivotingInitialState,
  GridPivotingState,
} from '../hooks/features/pivoting/gridPivotingInterfaces';
import type {
  GridAiAssistantInitialState,
  GridAiAssistantState,
} from '../hooks/features/aiAssistant/gridAiAssistantInterfaces';
import type {
  GridSidebarInitialState,
  GridSidebarState,
} from '../hooks/features/sidebar/gridSidebarState';
import type {
  GridChartsIntegrationState,
  GridChartsIntegrationInitialState,
} from '../hooks/features/chartsIntegration/gridChartsIntegrationInterfaces';
import type { GridHistoryState } from '../hooks/features/history/gridHistoryInterfaces';
import type { GridFormulaState } from '../hooks/features/formula/gridFormulaInterfaces';
import type {
  GridComputedColumnsInitialState,
  GridComputedColumnsState,
} from '../hooks/features/computedColumns/gridComputedColumnsInterfaces';

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
  formula: GridFormulaState;
  computedColumns: GridComputedColumnsState;
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
  computedColumns?: GridComputedColumnsInitialState;
}
