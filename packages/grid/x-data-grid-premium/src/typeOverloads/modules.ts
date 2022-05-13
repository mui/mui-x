import { GridValidRowModel } from '@mui/x-data-grid-pro';
import type { GridControlledStateEventLookupPro } from '@mui/x-data-grid-pro/typeOverloads';
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
  //   params: GridGroupingValueGetterParams<V, R>,
  // ) => GridKeyValue | null | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface GridRenderCellParamsPremium<V = any, R = any, F = V> {
  aggregation?: GridAggregationCellMeta;
}

export interface GridApiCachesPremium {
  aggregation?: {
    aggregationRulesOnLastColumnHydration?: GridAggregationRules;
    aggregationRulesOnLastRowHydration?: GridAggregationRules;
  };
}

declare module '@mui/x-data-grid-pro' {
  export interface GridColDef<R extends GridValidRowModel = any, V = any, F = V>
    extends GridColDefPremium<R, V, F> {}

  // TODO: Remove explicit augmentation of pro package
  interface GridControlledStateEventLookup
    extends GridControlledStateEventLookupPro,
      GridControlledStateEventLookupPremium {}

  interface GridRenderCellParams<V = any, R = any, F = V>
    extends GridRenderCellParamsPremium<V, R, F> {}

  interface GridApiCaches extends GridApiCachesPremium {}
}
