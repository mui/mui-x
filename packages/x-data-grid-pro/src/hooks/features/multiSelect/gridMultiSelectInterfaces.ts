/**
 * Grid-level metrics measured from a hidden sample chip rendered by `GridMultiSelectMeasurer`.
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
 * - `getOverflowMetrics` / `setOverflowMetrics` / `subscribeOverflowMetrics`: grid-level
 *   overflow chip metrics produced by the single `GridMultiSelectMeasurer` mounted in the grid
 *   root, consumed by every multiSelect chip cell (the metrics are identical across columns).
 */
export interface GridMultiSelectInternalCache {
  subscribeDrag: (field: string, callback: (width: number) => void) => () => void;
  broadcast: (field: string, width: number) => void;
  getOverflowMetrics: () => GridMultiSelectOverflowMetrics | null;
  setOverflowMetrics: (metrics: GridMultiSelectOverflowMetrics) => void;
  subscribeOverflowMetrics: (
    callback: (metrics: GridMultiSelectOverflowMetrics | null) => void,
  ) => () => void;
  teardown: () => void;
}
