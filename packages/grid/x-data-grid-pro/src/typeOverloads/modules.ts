import { GridKeyValue, GridRowId, GridValidRowModel } from '@mui/x-data-grid';
import type { GridRowScrollEndParams, GridRowOrderChangeParams } from '../models';
import type { GridPinnedColumns } from '../hooks';
import type { GridCanBeReorderedPreProcessingContext } from '../hooks/features/columnReorder/columnReorderInterfaces';
import { GridGroupingValueGetterParams } from '../models/gridGroupingValueGetterParams';
import { GridRowGroupingModel } from '../hooks/features/rowGrouping';

export interface GridControlledStateEventLookupPro {
  /**
   * Fired when the open detail panels are changed.
   * @ignore - do not document.
   */
  detailPanelsExpandedRowIdsChange: { params: GridRowId[] };
  /**
   * Fired when the pinned columns is changed.
   * @ignore - do not document.
   */
  pinnedColumnsChange: { params: GridPinnedColumns };
  /**
   * Fired when the row grouping model changes.
   * TODO: Add back on premium when removing it from pro
   */
  rowGroupingModelChange: { params: GridRowGroupingModel };
}

// TODO: Add back on premium when removing it from pro
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

export interface GridEventLookupPro {
  /**
   * Fired when scrolling to the bottom of the grid viewport.
   */
  rowsScrollEnd: { params: GridRowScrollEndParams };
  /**
   * Fired when the user ends reordering a row.
   */
  rowOrderChange: { params: GridRowOrderChangeParams };
}

export interface GridPipeProcessingLookupPro {
  canBeReordered: {
    value: boolean;
    context: GridCanBeReorderedPreProcessingContext;
  };
}

declare module '@mui/x-data-grid' {
  interface GridEventLookup extends GridEventLookupPro {}

  export interface GridColDef<R extends GridValidRowModel = any, V = any, F = V>
    extends GridColDefPro<R, V, F> {}

  interface GridControlledStateEventLookup extends GridControlledStateEventLookupPro {}

  interface GridPipeProcessingLookup extends GridPipeProcessingLookupPro {}
}
