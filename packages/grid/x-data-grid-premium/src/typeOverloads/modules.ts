import { GridValidRowModel } from '@mui/x-data-grid-pro';
import type {
  GridControlledStateEventLookupPro,
  GridColDefPro,
} from '@mui/x-data-grid-pro/typeOverloads';
import type { GridAggregationModel, GridAggregationCellMeta, GridAggregationRules } from '../hooks';

export interface GridControlledStateEventLookupPremium {
  /**
   * Fired when the aggregation model changes.
   */
  aggregationModelChange: { params: GridAggregationModel };
  // /**
  //  * Fired when the row grouping model changes.
  //  */
  // rowGroupingModelChange: { params: GridRowGroupingModel };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface GridColDefPremium<R extends GridValidRowModel = any, V = any, F = V> {
  aggregable?: boolean;
  availableAggregationFunctions?: string[];
  // /**
  //  * Function that transforms a complex cell value into a key that be used for grouping the rows.
  //  * @param {GridGroupingValueGetterParams} params Object containing parameters for the getter.
  //  * @returns {GridKeyValue | null | undefined} The cell key.
  //  */
  // groupingValueGetter?: (
  //     params: GridGroupingValueGetterParams<V, R>,
  // ) => GridKeyValue | null | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface GridRenderCellParamsPremium<V = any, R extends GridValidRowModel = any, F = V> {
  aggregation?: GridAggregationCellMeta;
}

export interface GridApiCachesPremium {
  aggregation?: {
    aggregationRulesOnLastColumnHydration?: GridAggregationRules;
    aggregationRulesOnLastRowHydration?: GridAggregationRules;
  };
}
declare module '@mui/x-data-grid-pro' {
  interface GridColDef<R, V, F> extends GridColDefPro<R, V, F>, GridColDefPremium<R, V, F> {}

  interface GridControlledStateEventLookup
    extends GridControlledStateEventLookupPro,
      GridControlledStateEventLookupPremium {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface GridRenderCellParams<V, R, F> extends GridRenderCellParamsPremium {}

  interface GridApiCaches extends GridApiCachesPremium {}
}
