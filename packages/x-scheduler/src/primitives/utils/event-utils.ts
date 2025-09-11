import {
  SchedulerValidDate,
  CalendarEvent,
  CalendarEventOccurrenceWithPosition,
  CalendarEventOccurrence,
} from '../models';
import { Adapter } from './adapter/types';

/**
 *  Returns the largest `eventRowIndex` among all-day occurrences.
 *  Useful to know how many stacked rows are already used for a given day.
 *  @returns Highest row index found, or 0 if none.
 */
export function getEventWithLargestRowIndex(events: CalendarEventOccurrenceWithPosition[]) {
  return (
    events.reduce(
      (maxEvent, event) =>
        (event?.eventRowIndex ?? 0) > (maxEvent.eventRowIndex ?? 0) ? event : maxEvent,
      { eventRowIndex: 0 } as CalendarEventOccurrenceWithPosition,
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

/**
 *  Computes the vertical row for an all-day occurrence on `day`.
 *  If the event started before the visible range, reuses the row chosen on the first visible day.
 *  Otherwise, assigns the first free row index in that day’s all-day stack.
 *  @returns 1-based row index.
 */
export function getEventRowIndex(
  event: CalendarEventOccurrence,
  day: SchedulerValidDate,
  days: SchedulerValidDate[],
  daysMap: Map<string, { allDayEvents: CalendarEventOccurrenceWithPosition[] }>,
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
      ?.allDayEvents.find((currentEvent) => currentEvent.key === event.key)?.eventRowIndex;

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

/**
 *  Returns the list of visible days an event should render on.
 *  When `shouldOnlyRenderEventInOneCell` is true, collapses multi-day to a single cell
 *  (first visible day, or the event’s start if it is inside the range).
 */
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
