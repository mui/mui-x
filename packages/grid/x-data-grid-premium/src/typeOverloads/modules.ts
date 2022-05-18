// import { GridKeyValue, GridValidRowModel } from '@mui/x-data-grid-pro';
// import type { GridControlledStateEventLookupPro } from '@mui/x-data-grid-pro/typeOverloads';
// import type { GridGroupingValueGetterParams } from '../models';
// import type { GridRowGroupingModel } from '../hooks';
//
// export interface GridControlledStateEventLookupPremium {
//   /**
//    * Fired when the row grouping model changes.
//    */
//   rowGroupingModelChange: { params: GridRowGroupingModel };
// }
//
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// export interface GridColDefPremium<R extends GridValidRowModel = any, V = any, F = V> {
//   /**
//    * Function that transforms a complex cell value into a key that be used for grouping the rows.
//    * @param {GridGroupingValueGetterParams} params Object containing parameters for the getter.
//    * @returns {GridKeyValue | null | undefined} The cell key.
//    */
//   groupingValueGetter?: (
//     params: GridGroupingValueGetterParams<V, R>,
//   ) => GridKeyValue | null | undefined;
// }
//
// declare module '@mui/x-data-grid-pro' {
//   export interface GridColDef<R extends GridValidRowModel = any, V = any, F = V>
//     extends GridColDefPremium<R, V, F> {}
//
//   // TODO: Remove explicit augmentation of pro package
//   interface GridControlledStateEventLookup
//     extends GridControlledStateEventLookupPro,
//       GridControlledStateEventLookupPremium {}
// }
