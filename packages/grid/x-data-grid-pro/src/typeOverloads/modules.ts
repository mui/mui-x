import { GridKeyValue, GridValidRowModel } from '@mui/x-data-grid';
import type { GridRowScrollEndParams, GridGroupingValueGetterParams } from '../models';
import type {
  GridPinnedColumns,
  GridRowGroupingModel,
  GridAggregationModel,
  GridAggregationCellMeta,
} from '../hooks';
import type { GridCanBeReorderedPreProcessingContext } from '../hooks/features/columnReorder/columnReorderInterfaces';

export interface GridControlledStateEventLookupPro {
  rowGroupingModelChange: { params: GridRowGroupingModel };
  aggregationModelChange: { params: GridAggregationModel };
  pinnedColumnsChange: { params: GridPinnedColumns };
}

export interface GridEventLookupPro {
  rowsScrollEnd: { params: GridRowScrollEndParams };
}

export interface GridPipeProcessingLookupPro {
  canBeReordered: {
    value: boolean;
    context: GridCanBeReorderedPreProcessingContext;
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface GridColDefPro<R extends GridValidRowModel = any, V = any, F = V> {
  /**
   * Function that transforms a complex cell value into a key that be used for grouping the rows.
   * TODO: Move to `x-data-grid-premium`
   * @param {GridGroupingValueGetterParams} params Object containing parameters for the getter.
   * @returns {GridKeyValue | null | undefined} The cell key.
   */
  groupingValueGetter?: (
    params: GridGroupingValueGetterParams<V, R>,
  ) => GridKeyValue | null | undefined;

  /**
   * TODO: Move to `x-data-grid-premium
   */
  aggregable?: boolean;

  /**
   * TODO: Move to `x-data-grid-premium
   */
  availableAggregationFunctions?: string[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface GridRenderCellParamsPro<V = any, R = any, F = V> {
  /**
   * TODO: Move to `x-data-grid-premium
   */
  aggregation?: GridAggregationCellMeta;
}

export interface GridCachesPro {
  aggregation: {
    sanitizedModelOnLastHydration: GridAggregationModel;
  };
}

declare module '@mui/x-data-grid' {
  export interface GridColDef<R extends GridValidRowModel = any, V = any, F = V>
    extends GridColDefPro<R, V, F> {}

  interface GridEventLookup extends GridEventLookupPro {}

  interface GridControlledStateEventLookup extends GridControlledStateEventLookupPro {}

  interface GridPipeProcessingLookup extends GridPipeProcessingLookupPro {}

  interface GridRenderCellParams<V = any, R = any, F = V>
    extends GridRenderCellParamsPro<V, R, F> {}
}

declare module '@mui/x-data-grid/internals' {
  interface GridCaches extends GridCachesPro {}
}
