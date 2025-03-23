import type { GridControlledStateReasonLookup } from '../events/gridEventLookup';
import type { GridApiCommon } from './gridApiCommon';

/**
 * Additional details passed to the callbacks
 */
export interface GridCallbackDetails<K extends keyof GridControlledStateReasonLookup = any> {
  /**
   * The reason for this callback to have been called.
   */
  reason?: GridControlledStateReasonLookup[K];
  /**
   * GridApi that let you manipulate the grid.
   */
  api: GridApiCommon;
}
