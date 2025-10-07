import type { CalendarGridDayEvent } from '../calendar-grid/day-event/CalendarGridDayEvent';
import type { CalendarGridDayEventResizeHandler } from '../calendar-grid/day-event-resize-handler/CalendarGridDayEventResizeHandler';
import type { CalendarGridTimeEvent } from '../calendar-grid/time-event/CalendarGridTimeEvent';
import type { CalendarGridTimeEventResizeHandler } from '../calendar-grid/time-event-resize-handler/CalendarGridTimeEventResizeHandler';
import type { StandaloneEvent } from '../standalone-event';

export const EVENT_DRAG_PRECISION_MINUTE = 15;
export const EVENT_DRAG_PRECISION_MS = EVENT_DRAG_PRECISION_MINUTE * 60 * 1000;

export interface EventDropDataLookup {
  CalendarGridTimeEvent: CalendarGridTimeEvent.DragData;
  CalendarGridTimeEventResizeHandler: CalendarGridTimeEventResizeHandler.DragData;
  CalendarGridDayEvent: CalendarGridDayEvent.DragData;
  CalendarGridDayEventResizeHandler: CalendarGridDayEventResizeHandler.DragData;
  StandaloneEvent: StandaloneEvent.DragData;
}

export function buildIsValidDropTarget<Targets extends keyof EventDropDataLookup>(
  targets: Targets[],
) {
  const targetsSet = new Set(targets);
  return (data: any): data is EventDropDataLookup[Targets] => targetsSet.has(data.source);
}

export type EventDropData = EventDropDataLookup[keyof EventDropDataLookup];
