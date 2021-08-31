import type { GridApi } from './gridApi';

/**
 * Additional details passed to the callbacks
 * It contains the api for the DataGridPro
 */
export type GridApiDetails<AdditionalDetails extends {} = {}> = AdditionalDetails & {
  api?: GridApi;
};
