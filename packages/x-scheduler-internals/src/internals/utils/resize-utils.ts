import { EVENT_DRAG_PRECISION_MINUTE } from '../../constants';
import type { Adapter } from '../../use-adapter/useAdapter.types';
import type { SchedulerEventSide, TemporalSupportedObject } from '../../models';

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
 * Clamps the moving edge so the event keeps at least one drag precision step of duration, leaving
 * the fixed edge untouched. Shared by the time grid and timeline drop targets.
 *
 * The snap step is reused as the minimum duration — intentionally the same value.
 */
export function clampResizedEventEdge(parameters: {
  adapter: Adapter;
  side: SchedulerEventSide;
  /**
   * The current start of the event being resized (the fixed edge when `side` is `'end'`).
   */
  start: TemporalSupportedObject;
  /**
   * The current end of the event being resized (the fixed edge when `side` is `'start'`).
   */
  end: TemporalSupportedObject;
  /**
   * The candidate date under the pointer for the moving edge.
   */
  cursorDate: TemporalSupportedObject;
}): { start: TemporalSupportedObject; end: TemporalSupportedObject } {
  const { adapter, side, start, end, cursorDate } = parameters;

  if (side === 'start') {
    // Keep one precision step between the new start and the fixed end.
    const maxStartDate = adapter.addMinutes(end, -EVENT_DRAG_PRECISION_MINUTE);
    const newStart = adapter.isBefore(cursorDate, maxStartDate) ? cursorDate : maxStartDate;
    return { start: newStart, end };
  }

  // Keep one precision step between the fixed start and the new end.
  const minEndDate = adapter.addMinutes(start, EVENT_DRAG_PRECISION_MINUTE);
  const newEnd = adapter.isAfter(cursorDate, minEndDate) ? cursorDate : minEndDate;
  return { start, end: newEnd };
}
