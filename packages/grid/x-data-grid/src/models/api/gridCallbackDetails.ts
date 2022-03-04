/**
 * Additional details passed to the callbacks
 */
export interface GridCallbackDetails {
  /**
   * Provided only if `DataGridPro` is being used.
   * @deprecated Use the `apiRef` returned by `useGridApiContext` or `useGridApiRef` (only available in `@mui/x-data-grid-pro`)
   */
  api?: any;
}
