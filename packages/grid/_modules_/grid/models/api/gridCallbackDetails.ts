import type { GridApi } from './gridApi';

/**
 * Additional details passed to the callbacks
 */
export interface GridCallbackDetails {
  /**
   * Provided only if `DataGridPro` is being used.
   */
  api?: GridApi;
}
