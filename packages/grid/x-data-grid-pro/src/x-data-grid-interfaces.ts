import { GridStateCommunity } from '@mui/x-data-grid';
import {
  GridPinnedColumns,
  GridRowGroupingModel,
  GridRowScrollEndParams,
  GridStatePro,
} from './internals';
import { GridCanBeReorderedPreProcessingContext } from './internals/hooks/features/columnReorder/columnReorderInterfaces';

export interface GridControlledStateEventLookupPro {
  rowGroupingModelChange: { params: GridRowGroupingModel };
  pinnedColumnsChange: { params: GridPinnedColumns };
}

export interface GridEventLookupPro {
  rowsScrollEnd: { params: GridRowScrollEndParams };
  stateChange: { params: GridStatePro | GridStateCommunity };
}

export interface GridPreProcessingGroupLookupPro {
  canBeReordered: {
    value: boolean;
    context: GridCanBeReorderedPreProcessingContext;
  };
}

declare module '@mui/x-data-grid' {
  interface GridEventLookup extends GridEventLookupPro {}

  interface GridControlledStateEventLookup extends GridControlledStateEventLookupPro {}

  interface GridPreProcessingGroupLookup extends GridPreProcessingGroupLookupPro {}
}
