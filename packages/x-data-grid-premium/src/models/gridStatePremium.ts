import {
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
import {
  GridAiAssistantInitialState,
  GridAiAssistantState,
} from '../hooks/features/aiAssistant/gridAiAssistantInterfaces';

/**
 * The state of Data Grid Premium.
 */
export interface GridStatePremium extends GridStatePro {
  rowGrouping: GridRowGroupingState;
  aggregation: GridAggregationState;
  cellSelection: GridCellSelectionModel;
  pivoting: GridPivotingState;
  aiAssistant: GridAiAssistantState;
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
}
