import type { GridApiCommunity } from './gridApi';

/**
 * Additional details passed to the callbacks
 */
export interface GridCallbackDetails<GridApi extends GridApiCommunity = GridApiCommunity> {
  /**
   * Provided only if `DataGridPro` is being used.
   */
  api?: GridApi;
}
