import { SchedulerValidDate, CalendarEvent, CalendarEventWithPosition } from '../models';
import { Adapter } from './adapter/types';

export function getEventWithLargestRowIndex(events: CalendarEventWithPosition[]) {
  return (
    events.reduce(
      (maxEvent, event) =>
        (event?.eventRowIndex ?? 0) > (maxEvent.eventRowIndex ?? 0) ? event : maxEvent,
      { eventRowIndex: 0 } as CalendarEventWithPosition,
    ).eventRowIndex || 0
  );
}

export function isDayWithinRange(
  day: SchedulerValidDate,
  eventFirstDay: SchedulerValidDate,
  eventLastDay: SchedulerValidDate,
  adapter: Adapter,
) {
  return (
    adapter.isSameDay(day, eventFirstDay) ||
    adapter.isSameDay(day, eventLastDay) ||
    (adapter.isAfter(day, eventFirstDay) && adapter.isBefore(day, eventLastDay))
  );
}

export function getEventRowIndex(
  event: CalendarEvent,
  day: SchedulerValidDate,
  days: SchedulerValidDate[],
  daysMap: Map<string, { allDayEvents: CalendarEventWithPosition[] }>,
  adapter: Adapter,
): number {
  const dayKey = adapter.format(day, 'keyboardDate');
  const eventFirstDay = adapter.startOfDay(event.start);

  // If the event starts before the current day, we need to find the row index of the first day of the event
  const isBeforeVisibleRange =
    adapter.isBefore(eventFirstDay, day) && !adapter.isSameDay(days[0], day);
  if (isBeforeVisibleRange) {
    const firstDayKey = adapter.format(
      adapter.isBefore(eventFirstDay, days[0]) ? days[0] : eventFirstDay,
      'keyboardDate',
    );

    // Try to find the row index from the original event placement on the first visible day
    const existingRowIndex = daysMap
      .get(firstDayKey)
      ?.allDayEvents.find((currentEvent) => currentEvent.id === event.id)?.eventRowIndex;

    return existingRowIndex ?? 1;
  }

  // Otherwise, we just render the event on the first available row in the column
  const usedIndexes = new Set(
    daysMap.get(dayKey)?.allDayEvents.map((item) => item.eventRowIndex) ?? [],
  );
  let i = 1;
  while (usedIndexes.has(i)) {
    i += 1;
  }
  return i;
}

export function getEventDays(
  event: CalendarEvent,
  days: SchedulerValidDate[],
  adapter: Adapter,
  shouldOnlyRenderEventInOneCell: boolean,
) {
  const eventFirstDay = adapter.startOfDay(event.start);
  const eventLastDay = adapter.endOfDay(event.end);

  if (shouldOnlyRenderEventInOneCell) {
    if (adapter.isBefore(eventFirstDay, days[0])) {
      return [days[0]];
    }
    return [eventFirstDay];
  }
  return days.filter((day) => isDayWithinRange(day, eventFirstDay, eventLastDay, adapter));
}
