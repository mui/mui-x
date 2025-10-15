import type { CalendarGridDayEvent } from '../calendar-grid/day-event/CalendarGridDayEvent';
import type { CalendarGridDayEventResizeHandler } from '../calendar-grid/day-event-resize-handler/CalendarGridDayEventResizeHandler';
import type { CalendarGridTimeEvent } from '../calendar-grid/time-event/CalendarGridTimeEvent';
import type { CalendarGridTimeEventResizeHandler } from '../calendar-grid/time-event-resize-handler/CalendarGridTimeEventResizeHandler';
import type { TimelineEvent } from '../timeline/event';
import type { StandaloneEvent } from '../standalone-event';

export interface EventDropDataLookup {
  CalendarGridTimeEvent: CalendarGridTimeEvent.DragData;
  CalendarGridTimeEventResizeHandler: CalendarGridTimeEventResizeHandler.DragData;
  CalendarGridDayEvent: CalendarGridDayEvent.DragData;
  CalendarGridDayEventResizeHandler: CalendarGridDayEventResizeHandler.DragData;
  TimelineEvent: TimelineEvent.DragData;
  StandaloneEvent: StandaloneEvent.DragData;
}

export type EventDropData = EventDropDataLookup[keyof EventDropDataLookup];

export function buildIsValidDropTarget<Targets extends keyof EventDropDataLookup>(
  targets: Targets[],
) {
  const targetsSet = new Set(targets);
  return (data: any): data is EventDropDataLookup[Targets] => targetsSet.has(data.source);
}
