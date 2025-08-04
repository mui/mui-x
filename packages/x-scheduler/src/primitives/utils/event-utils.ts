import { CalendarEventWithPosition } from '../models';

export function getEventWithLargestRowIndex(events: CalendarEventWithPosition[]) {
  return (
    events.reduce(
      (maxEvent, event) =>
        (event?.eventRowIndex ?? 0) > (maxEvent.eventRowIndex ?? 0) ? event : maxEvent,
      { eventRowIndex: 0 } as CalendarEventWithPosition,
    ).eventRowIndex || 0
  );
}

export function getEventWithLargestRowIndexForDay(
  dayKey: string,
  daysMap: Map<string, { events: CalendarEventWithPosition[] }>,
) {
  const events = daysMap.get(dayKey)?.events || [];
  if (events.length === 0) {
    return 0;
  }
  return getEventWithLargestRowIndex(events);
}
