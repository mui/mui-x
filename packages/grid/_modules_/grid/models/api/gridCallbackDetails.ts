import type { GridApiCommon } from './gridApi';

/**
 * Additional details passed to the callbacks
 */
export interface GridCallbackDetails<GridApi extends GridApiCommon = any> {
  /**
   * Provided only if `DataGridPro` is being used.
   */
  api?: GridApi;
}
