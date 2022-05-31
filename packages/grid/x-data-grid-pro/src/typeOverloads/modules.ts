import { GridRowId } from '@mui/x-data-grid';
import type { GridRowScrollEndParams, GridRowOrderChangeParams } from '../models';
import type {
  GridColumnPinningInternalCache,
  GridPinnedColumns,
} from '../hooks/features/columnPinning/gridColumnPinningInterface';
import type { GridCanBeReorderedPreProcessingContext } from '../hooks/features/columnReorder/columnReorderInterfaces';

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

export interface GridApiCachesPro {
  columnPinning: GridColumnPinningInternalCache;
}

declare module '@mui/x-data-grid' {
  interface GridEventLookup extends GridEventLookupPro {}

  interface GridControlledStateEventLookup extends GridControlledStateEventLookupPro {}

  interface GridPipeProcessingLookup extends GridPipeProcessingLookupPro {}
}

declare module '@mui/x-data-grid/internals' {
  interface GridApiCaches extends GridApiCachesPro {}
}
