import type { DayGridEvent } from '../day-grid/event';
import type { DayGridEventResizeHandler } from '../day-grid/event-resize-handler';
import type { TimeGridEvent } from '../time-grid/event';
import type { TimeGridEventResizeHandler } from '../time-grid/event-resize-handler';

export const EVENT_DRAG_PRECISION_MINUTE = 15;
export const EVENT_DRAG_PRECISION_MS = EVENT_DRAG_PRECISION_MINUTE * 60 * 1000;

interface EventDropDataLookup {
  TimeGridEvent: TimeGridEvent.DragData;
  TimeGridEventResizeHandler: TimeGridEventResizeHandler.DragData;
  DayGridEvent: DayGridEvent.DragData;
  DayGridEventResizeHandler: DayGridEventResizeHandler.DragData;
}

export function buildIsValidDropTarget<Targets extends keyof EventDropDataLookup>(
  targets: Targets[],
) {
  const targetsSet = new Set(targets);
  return (data: any): data is EventDropDataLookup[Targets] => targetsSet.has(data.source);
}
