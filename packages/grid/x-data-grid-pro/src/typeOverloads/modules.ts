import { GridKeyValue, GridValidRowModel } from '@mui/x-data-grid';
import type { GridRowScrollEndParams, GridGroupingValueGetterParams } from '../models';
import type { GridPinnedColumns, GridRowGroupingModel } from '../hooks';
import type { GridCanBeReorderedPreProcessingContext } from '../hooks/features/columnReorder/columnReorderInterfaces';

export interface GridControlledStateEventLookupPro {
  rowGroupingModelChange: { params: GridRowGroupingModel };
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
   * @param {GridGroupingValueGetterParams} params Object containing parameters for the getter.
   * @returns {GridKeyValue | null | undefined} The cell key.
   */
  groupingValueGetter?: (
    params: GridGroupingValueGetterParams<V, R>,
  ) => GridKeyValue | null | undefined;
}

declare module '@mui/x-data-grid' {
  export interface GridColDef<R extends GridValidRowModel = any, V = any, F = V>
    extends GridColDefPro<R, V, F> {}

  interface GridEventLookup extends GridEventLookupPro {}

  interface GridControlledStateEventLookup extends GridControlledStateEventLookupPro {}

  interface GridPipeProcessingLookup extends GridPipeProcessingLookupPro {}
}
