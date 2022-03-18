import { GridKeyValue, GridRowParams } from '@mui/x-data-grid';
import type {
  GridRowScrollEndParams,
  GridGroupingValueGetterParams,
  GridRowOrderChangeParams,
} from '../models';
import type { GridPinnedColumns, GridRowGroupingModel } from '../hooks';
import type { GridCanBeReorderedPreProcessingContext } from '../hooks/features/columnReorder/columnReorderInterfaces';

export interface GridControlledStateEventLookupPro {
  rowGroupingModelChange: { params: GridRowGroupingModel };
  pinnedColumnsChange: { params: GridPinnedColumns };
}

export interface GridEventLookupPro {
  rowsScrollEnd: { params: GridRowScrollEndParams };
  rowOrderChange: { params: GridRowOrderChangeParams };
  rowDragStart: {
    params: GridRowParams;
    event: React.DragEvent<HTMLElement>;
  };
  rowDragEnter: {
    params: GridRowParams;
    event: React.DragEvent<HTMLElement>;
  };
  rowDragOver: {
    params: GridRowParams;
    event: React.DragEvent<HTMLElement>;
  };
  rowDragEnd: {
    params: GridRowParams;
    event: React.DragEvent<HTMLElement>;
  };
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
  export interface GridColDef extends GridColDefPro {}

  interface GridEventLookup extends GridEventLookupPro {}

  interface GridControlledStateEventLookup extends GridControlledStateEventLookupPro {}

  interface GridPreProcessingGroupLookup extends GridPreProcessingGroupLookupPro {}
}
