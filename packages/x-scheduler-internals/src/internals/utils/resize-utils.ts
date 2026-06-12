import type { Adapter } from '../../use-adapter/useAdapter.types';
import { SchedulerEventSide, TemporalSupportedObject } from '../../models';

/**
 * Whether a resize handler for the given side may run, i.e. the edge it moves is actually inside
 * the collection (an event clipped at the collection start can't have its start resized, etc.).
 *
 * This is the shared gate so `useEventResizeHandler` (native) and `useEventPointerResizeHandler`
 * (pointer) stay independent of each other: the component computes it once and passes it to
 * whichever handler is active, rather than one hook reading the other's output.
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
 * Clamps the moving edge of a resize gesture so the event keeps at least `precisionMinute`
 * minutes of duration, leaving the opposite (fixed) edge untouched.
 *
 * This is the single source of truth for the minimum-duration rule, shared by the native
 * drag-and-drop resize (`useTimeDropTarget`) and the pointer-based resize
 * (`useEventPointerResizeHandler`) so both paths stay in sync.
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
    // Keep at least one precision step between the new start and the fixed end.
    const maxStartDate = adapter.addMinutes(end, -precisionMinute);
    const newStart = adapter.isBefore(cursorDate, maxStartDate) ? cursorDate : maxStartDate;
    return { start: newStart, end };
  }

  // Keep at least one precision step between the fixed start and the new end.
  const minEndDate = adapter.addMinutes(start, precisionMinute);
  const newEnd = adapter.isAfter(cursorDate, minEndDate) ? cursorDate : minEndDate;
  return { start, end: newEnd };
}
