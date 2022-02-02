import type { GridApiCommon, GridApiCommunity } from './gridApi';

/**
 * Additional details passed to the callbacks
 */
export interface GridCallbackDetails<Api extends GridApiCommon = GridApiCommunity> {
  /**
   * Provided only if `DataGridPro` is being used.
   */
  api?: Api;
}
