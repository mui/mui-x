/**
 * Per-grid cache for multiSelect drag-resize broadcast.
 * Cells subscribe via `subscribeDrag(field, cb)` to receive throttled width updates
 * without each adding their own `columnResize` listener.
 */
export interface GridMultiSelectInternalCache {
  subscribeDrag: (field: string, callback: (width: number) => void) => () => void;
}
