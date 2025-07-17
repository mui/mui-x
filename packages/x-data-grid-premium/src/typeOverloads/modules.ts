import { GridExportDisplayOptions, GridValidRowModel } from '@mui/x-data-grid-pro';
import type {
  GridControlledStateEventLookupPro,
  GridApiCachesPro,
  GridEventLookupPro,
} from '@mui/x-data-grid-pro/typeOverloads';
import type { GridGroupingValueGetter, GridPastedValueParser } from '../models';
import type {
  GridRowGroupingModel,
  GridAggregationModel,
  GridAggregationCellMeta,
  GridAggregationHeaderMeta,
  GridCellSelectionModel,
  Conversation,
} from '../hooks';
import { GridRowGroupingInternalCache } from '../hooks/features/rowGrouping/gridRowGroupingInterfaces';
import { GridAggregationInternalCache } from '../hooks/features/aggregation/gridAggregationInterfaces';
import type { GridExcelExportOptions } from '../hooks/features/export/gridExcelExportInterface';
import type {
  GridPivotingInternalCache,
  GridPivotModel,
} from '../hooks/features/pivoting/gridPivotingInterfaces';

export interface GridControlledStateEventLookupPremium {
  /**
   * Fired when the aggregation model changes.
   */
  aggregationModelChange: { params: GridAggregationModel };
  /**
   * Fired when the row grouping model changes.
   */
  rowGroupingModelChange: { params: GridRowGroupingModel };
  /**
   * Fired when the selection state of one or multiple cells change.
   */
  cellSelectionChange: { params: GridCellSelectionModel };
  /**
   * Fired when the state of the Excel export task changes
   */
  excelExportStateChange: { params: 'pending' | 'finished' };
  /**
   * Fired when the pivot model changes.
   */
  pivotModelChange: { params: GridPivotModel };
  pivotModeChange: { params: boolean };
  pivotPanelOpenChange: { params: boolean };
  /**
   * Fired when the AI Assistant conversation state changes.
   */
  aiAssistantConversationsChange: { params: Conversation[] };
  /**
   * Fired when the AI Assistant active conversation index changes.
   */
  aiAssistantActiveConversationIndexChange: { params: number };
}

interface GridEventLookupPremium extends GridEventLookupPro {
  /**
   * Fired when the clipboard paste operation starts.
   */
  clipboardPasteStart: { params: { data: string[][] } };
  /**
   * Fired when the clipboard paste operation ends.
   */
  clipboardPasteEnd: {};
}

export interface GridColDefPremium<R extends GridValidRowModel = any, V = any, F = V> {
  /**
   * If `true`, the cells of the column can be aggregated based.
   * @default true
   */
  aggregable?: boolean;
  /**
   * Limit the aggregation function usable on this column.
   * By default, the column will have all the aggregation functions that are compatible with its type.
   */
  availableAggregationFunctions?: string[];
  /**
   * Function that transforms a complex cell value into a key that be used for grouping the rows.
   * Not supported with the server-side row grouping. Use `dataSource.getGroupKey()` instead.
   * @returns {GridKeyValue | null | undefined} The cell key.
   */
  groupingValueGetter?: GridGroupingValueGetter<R>;
  /**
   * Function that takes the clipboard-pasted value and converts it to a value used internally.
   * @returns {V} The converted value.
   */
  pastedValueParser?: GridPastedValueParser<R, V, F>;
  /**
   * If `false`, the column will not be available for pivoting in the pivot panel.
   * @default true
   */
  pivotable?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface GridRenderCellParamsPremium<R extends GridValidRowModel = any, V = any, F = V> {
  aggregation?: GridAggregationCellMeta;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface GridColumnHeaderParamsPremium<R extends GridValidRowModel = any, V = any, F = V> {
  aggregation?: GridAggregationHeaderMeta;
}

export interface GridApiCachesPremium extends GridApiCachesPro {
  pivoting: GridPivotingInternalCache;
  rowGrouping: GridRowGroupingInternalCache;
  aggregation: GridAggregationInternalCache;
}

declare module '@mui/x-data-grid-pro' {
  interface GridEventLookup extends GridEventLookupPremium {}

  interface GridControlledStateEventLookup
    extends GridControlledStateEventLookupPro,
      GridControlledStateEventLookupPremium {}

  interface GridRenderCellParams<R, V, F> extends GridRenderCellParamsPremium<R, V, F> {}

  interface GridColumnHeaderParams<R, V, F> extends GridColumnHeaderParamsPremium<R, V, F> {}

  interface GridApiCaches extends GridApiCachesPremium {}

  interface GridToolbarExportProps {
    excelOptions?: GridExcelExportOptions & GridExportDisplayOptions;
  }

  interface GridToolbarProps {
    excelOptions?: GridExcelExportOptions & GridExportDisplayOptions;
  }
}

declare module '@mui/x-data-grid-pro/internals' {
  interface GridApiCaches extends GridApiCachesPremium {}

  interface GridBaseColDef<R, V, F> extends GridColDefPremium<R, V, F> {}
}
