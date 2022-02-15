import { GridKeyValue } from '@mui/x-data-grid';
import {
  GridPinnedColumns,
  GridRowGroupingModel,
  GridRowScrollEndParams,
  GridGroupingValueGetterParams,
} from './internals';
import { GridCanBeReorderedPreProcessingContext } from './internals/hooks/features/columnReorder/columnReorderInterfaces';

export interface GridControlledStateEventLookupPro {
  rowGroupingModelChange: { params: GridRowGroupingModel };
  pinnedColumnsChange: { params: GridPinnedColumns };
}

export interface GridEventLookupPro {
  rowsScrollEnd: { params: GridRowScrollEndParams };
}

export interface GridPreProcessingGroupLookupPro {
  canBeReordered: {
    value: boolean;
    context: GridCanBeReorderedPreProcessingContext;
  };
}

export interface GridColDefPro {
  /**
   * Function that transforms a complex cell value into a key that be used for grouping the rows.
   * @param {GridGroupingValueGetterParams} params Object containing parameters for the getter.
   * @returns {GridKeyValue | null | undefined} The cell key.
   */
  groupingValueGetter?: (params: GridGroupingValueGetterParams) => GridKeyValue | null | undefined;
}

declare module '@mui/x-data-grid' {
  interface GridEventLookup extends GridEventLookupPro {}

  interface GridControlledStateEventLookup extends GridControlledStateEventLookupPro {}

  interface GridPreProcessingGroupLookup extends GridPreProcessingGroupLookupPro {}

  export interface GridColDef extends GridColDefPro {}
}
