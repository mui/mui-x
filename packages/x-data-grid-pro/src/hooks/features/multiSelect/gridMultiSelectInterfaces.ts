/**
 * Per-column metrics measured from a hidden sample chip rendered by `GridMultiSelectMeasurer`.
 * Used by chip cells to size the `+N` overflow chip without hardcoding font/style assumptions.
 */
export interface GridMultiSelectOverflowMetrics {
  /**
   * Width (in CSS pixels) of the `+N` overflow chip, indexed by digit count.
   * `overflowChipWidths[0]` = width for 1-digit "+9", `[1]` = "+99", `[2]` = "+999".
   * For `hiddenCount` ≥ 10⁴, the last entry is reused.
   */
  overflowChipWidths: number[];
  /** Gap between sibling chips, read from the chip row's computed style. */
  gap: number;
}

/**
 * Per-grid cache for multiSelect runtime data.
 * - `subscribeDrag` / `broadcast`: throttled drag-resize broadcaster, so each cell does not
 *   register its own `columnResize` listener (keeps EventManager listener count O(1)).
 * - `getOverflowMetrics` / `setOverflowMetrics` / `subscribeOverflowMetrics`: per-field
 *   overflow chip metrics produced by the per-column measurer mounted in each multiSelect
 *   column header, consumed by every chip cell of that column.
 */
export interface GridMultiSelectInternalCache {
  subscribeDrag: (field: string, callback: (width: number) => void) => () => void;
  broadcast: (field: string, width: number) => void;
  getOverflowMetrics: (field: string) => GridMultiSelectOverflowMetrics | null;
  setOverflowMetrics: (field: string, metrics: GridMultiSelectOverflowMetrics) => void;
  deleteOverflowMetrics: (field: string) => void;
  subscribeOverflowMetrics: (
    field: string,
    callback: (metrics: GridMultiSelectOverflowMetrics | null) => void,
  ) => () => void;
  teardown: () => void;
}
