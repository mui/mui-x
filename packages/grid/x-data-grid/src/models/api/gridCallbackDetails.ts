import { GridControlledStateReasonLookup } from '../events/gridEventLookup';

/**
 * Additional details passed to the callbacks
 */
export interface GridCallbackDetails<K extends keyof GridControlledStateReasonLookup = any> {
  /**
   * Provided only if `DataGridPro` is being used.
   * @deprecated Use the `apiRef` returned by `useGridApiContext` or `useGridApiRef` (only available in `@mui/x-data-grid-pro`)
   */
  api?: any;
  /**
   * The reason for this callback to have been called.
   */
  reason?: GridControlledStateReasonLookup[K];
}
