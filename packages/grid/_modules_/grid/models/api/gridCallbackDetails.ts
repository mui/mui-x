import type { GridApi } from './gridApi';

/**
 * Additional details passed to the callbacks
 */
export type GridCallbackDetails<AdditionalDetails extends {} = {}> = AdditionalDetails & {
  /**
   * Provided only if `DataGridPro` is being used.
   */
  api?: GridApi;
};
