/**
 * Ephemeral Focus view state — zoom window + series highlight.
 *
 * Unlike the chart-spec document, focus is NOT serialized and NOT part of the
 * undo history: it is transient view navigation (PRD "Focus"), surfaced through
 * a breadcrumb with its own reset. The copilot drives it via `runCommands`
 * (`focus.zoom` / `focus.highlight` / `focus.reset`), never `updateChart`.
 */
export interface ChartFocusState {
  /** Zoom window, expressed in category values (or indices) on the x-axis. */
  zoom?: { from: string | number; to: string | number };
  /** The single series to emphasize; all others fade. */
  highlight?: { seriesId: string };
}

export const EMPTY_FOCUS: ChartFocusState = {};

/** A controlled `zoomData` entry for the Pro charts. */
export interface ResolvedZoomData {
  axisId: string;
  start: number;
  end: number;
}

function indexOf(value: string | number, categories: (string | number | Date | null)[]): number {
  const byValue = categories.findIndex((category) => String(category) === String(value));
  if (byValue >= 0) {
    return byValue;
  }
  const asIndex = Number(value);
  return Number.isInteger(asIndex) && asIndex >= 0 && asIndex < categories.length ? asIndex : -1;
}

/**
 * Maps a focus zoom window (category values or indices) to the percentage-based
 * `zoomData` the Pro charts expect. Returns `undefined` when the window cannot
 * be resolved (too few categories, or unknown from/to).
 *
 * @param zoom The zoom window from the focus state.
 * @param categories The resolved x-axis categories.
 * @param axisId The id of the zoomable x-axis.
 */
export function resolveZoomData(
  zoom: ChartFocusState['zoom'],
  categories: (string | number | Date | null)[],
  axisId: string,
): ResolvedZoomData[] | undefined {
  if (!zoom || categories.length < 2) {
    return undefined;
  }
  const fromIndex = indexOf(zoom.from, categories);
  const toIndex = indexOf(zoom.to, categories);
  if (fromIndex < 0 || toIndex < 0) {
    return undefined;
  }
  const lo = Math.min(fromIndex, toIndex);
  const hi = Math.max(fromIndex, toIndex);
  const max = categories.length - 1;
  return [{ axisId, start: (lo / max) * 100, end: (hi / max) * 100 }];
}
