import { GridKeyValue } from '@mui/x-data-grid-pro';
import type { GridControlledStateEventLookupPro } from '@mui/x-data-grid-pro/typeOverloads/modules';
import type { GridGroupingValueGetterParams } from '../models';
import type { GridRowGroupingModel } from '../hooks';

export interface GridControlledStateEventLookupPremium {
  rowGroupingModelChange: { params: GridRowGroupingModel };
}

export interface GridColDefPremium {
  /**
   * Function that transforms a complex cell value into a key that be used for grouping the rows.
   * @param {GridGroupingValueGetterParams} params Object containing parameters for the getter.
   * @returns {GridKeyValue | null | undefined} The cell key.
   */
  groupingValueGetter?: (params: GridGroupingValueGetterParams) => GridKeyValue | null | undefined;
}

declare module '@mui/x-data-grid-pro' {
  export interface GridColDef extends GridColDefPremium {}

  // TODO: Remove explicit augmentation of pro package
  interface GridControlledStateEventLookup
    extends GridControlledStateEventLookupPro,
      GridControlledStateEventLookupPremium {}
}
