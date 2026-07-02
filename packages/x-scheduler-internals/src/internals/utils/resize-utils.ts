import type { Adapter } from '../../use-adapter/useAdapter.types';
import type { SchedulerEventSide, TemporalSupportedObject } from '../../models';

/**
 * Whether a resize handler for the given side may run: its edge must be inside the collection
 * (an event clipped at the collection start can't have its start resized).
 */
export function isResizeHandlerEnabled(parameters: {
  side: SchedulerEventSide;
  doesEventStartBeforeCollectionStart: boolean;
  doesEventEndAfterCollectionEnd: boolean;
}): boolean {
  const { side, doesEventStartBeforeCollectionStart, doesEventEndAfterCollectionEnd } = parameters;
  return (
    (side === 'start' && !doesEventStartBeforeCollectionStart) ||
    (side === 'end' && !doesEventEndAfterCollectionEnd)
  );
}

/**
 * Clamps the moving edge so the event keeps at least `precisionMinute` of duration, leaving the
 * fixed edge untouched. Shared by the native and pointer resize paths.
 *
 * `precisionMinute` is the snap step reused as the minimum duration — intentionally the same value.
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
  /**
   * The minimum duration, in minutes, the event must keep.
   */
  precisionMinute: number;
}): { start: TemporalSupportedObject; end: TemporalSupportedObject } {
  const { adapter, side, start, end, cursorDate, precisionMinute } = parameters;

  if (side === 'start') {
    // Keep one precision step between the new start and the fixed end.
    const maxStartDate = adapter.addMinutes(end, -precisionMinute);
    const newStart = adapter.isBefore(cursorDate, maxStartDate) ? cursorDate : maxStartDate;
    return { start: newStart, end };
  }

  // Keep one precision step between the fixed start and the new end.
  const minEndDate = adapter.addMinutes(start, precisionMinute);
  const newEnd = adapter.isAfter(cursorDate, minEndDate) ? cursorDate : minEndDate;
  return { start, end: newEnd };
}
