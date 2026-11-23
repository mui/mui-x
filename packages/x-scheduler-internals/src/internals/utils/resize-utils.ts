import type { SchedulerEventSide } from '../../models';

/**
 * Whether a resize handler for the given side may run: its edge must render at its real position
 * (an event clipped at the collection start can't have its start resized).
 */
export function isResizeHandlerEnabled(parameters: {
  side: SchedulerEventSide;
  isEventStartClipped: boolean;
  isEventEndClipped: boolean;
}): boolean {
  const { side, isEventStartClipped, isEventEndClipped } = parameters;
  return (side === 'start' && !isEventStartClipped) || (side === 'end' && !isEventEndClipped);
}

/**
 * Clamps the moving edge so the event keeps at least `precisionMinute` of duration, leaving the
 * fixed edge untouched. Shared by the native and pointer resize paths.
 *
 * `precisionMinute` is the snap step reused as the minimum duration — intentionally the same value.
 */
export function clampResizedEventEdge(parameters: {
  side: SchedulerEventSide;
  /**
   * The current start of the event being resized, as a timestamp (the fixed edge when `side` is
   * `'end'`).
   */
  start: number;
  /**
   * The current end of the event being resized, as a timestamp (the fixed edge when `side` is
   * `'start'`).
   */
  end: number;
  /**
   * The candidate timestamp under the pointer for the moving edge.
   */
  cursorTimestamp: number;
  /**
   * The minimum duration, in minutes, the event must keep.
   */
  precisionMinute: number;
}): { start: number; end: number } {
  const { side, start, end, cursorTimestamp, precisionMinute } = parameters;
  const precisionMs = precisionMinute * 60_000;

  if (side === 'start') {
    // Keep one precision step between the new start and the fixed end.
    return { start: Math.min(cursorTimestamp, end - precisionMs), end };
  }

  // Keep one precision step between the fixed start and the new end.
  return { start, end: Math.max(cursorTimestamp, start + precisionMs) };
}
