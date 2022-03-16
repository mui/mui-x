import { GridKeyValue } from '@mui/x-data-grid';
import type { GridRowScrollEndParams, GridGroupingValueGetterParams } from '../models';
import type { GridPinnedColumns, GridRowGroupingModel, GridAggregationModel } from '../hooks';
import type { GridCanBeReorderedPreProcessingContext } from '../hooks/features/columnReorder/columnReorderInterfaces';

export interface GridControlledStateEventLookupPro {
  rowGroupingModelChange: { params: GridRowGroupingModel };
  aggregationModelChange: { params: GridAggregationModel };
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
   * TODO: Move to `x-data-grid-premium`
   * @param {GridGroupingValueGetterParams} params Object containing parameters for the getter.
   * @returns {GridKeyValue | null | undefined} The cell key.
   */
  groupingValueGetter?: (params: GridGroupingValueGetterParams) => GridKeyValue | null | undefined;

  /**
   * TODO: Move to `x-data-grid-premium
   */
  aggregable?: boolean;

  /**
   * TODO: Move to `x-data-grid-premium
   */
  availableAggregationFunctions?: string[];
}

declare module '@mui/x-data-grid' {
  export interface GridColDef extends GridColDefPro {}

  interface GridEventLookup extends GridEventLookupPro {}

  interface GridControlledStateEventLookup extends GridControlledStateEventLookupPro {}

  interface GridPreProcessingGroupLookup extends GridPreProcessingGroupLookupPro {}
}
