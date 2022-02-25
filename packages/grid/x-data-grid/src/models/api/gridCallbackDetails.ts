import type { GridApiCommon } from './gridApiCommon';
import type { GridApiCommunity } from './gridApiCommunity';

/**
 * Additional details passed to the callbacks
 */
export interface GridCallbackDetails<Api extends GridApiCommon = GridApiCommunity> {
  /**
   * Provided only if `DataGridPro` is being used.
   */
  api?: Api;
}
