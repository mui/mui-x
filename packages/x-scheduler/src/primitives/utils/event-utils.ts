import {
  SchedulerValidDate,
  CalendarEvent,
  CalendarEventOccurrencesWithRowIndex,
  CalendarEventOccurrence,
  CalendarProcessedDate,
} from '../models';
import { Adapter } from './adapter/types';

/**
 *  Returns the largest `eventRowIndex` among all-day occurrences.
 *  Useful to know how many stacked rows are already used for a given day.
 *  @returns Highest row index found, or 0 if none.
 */
export function getEventWithLargestRowIndex(events: CalendarEventOccurrencesWithRowIndex[]) {
  return (
    events.reduce(
      (maxEvent, event) =>
        (event?.eventRowIndex ?? 0) > (maxEvent.eventRowIndex ?? 0) ? event : maxEvent,
      { eventRowIndex: 0 } as CalendarEventOccurrencesWithRowIndex,
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
export function getEventRowIndex(parameters: GetEventRowIndexParameters): number {
  const { rowIndexLookup, occurrence, day, previousDay } = parameters;

  // If the event is present in the previous day, we keep the same row index
  const occurrenceRowIndexInPreviousDay =
    previousDay == null
      ? null
      : rowIndexLookup[previousDay.key]?.occurrencesRowIndex[occurrence.key];

  if (occurrenceRowIndexInPreviousDay != null) {
    return occurrenceRowIndexInPreviousDay;
  }

  // Otherwise, we just render the event on the first available row in the column
  const usedIndexes = rowIndexLookup[day.key]?.usedRowIndexes;
  let i = 1;
  if (usedIndexes) {
    while (usedIndexes.has(i)) {
      i += 1;
    }
  }
  return i;
}

export interface GetEventRowIndexParameters {
  rowIndexLookup: {
    [dayKey: string]: {
      occurrencesRowIndex: { [occurrenceKey: string]: number };
      usedRowIndexes: Set<number>;
    };
  };
  occurrence: CalendarEventOccurrence;
  day: CalendarProcessedDate;
  previousDay: CalendarProcessedDate | null;
}

/**
 *  Returns the list of visible days an event should render on.
 *  When `shouldOnlyRenderEventInOneCell` is true, collapses multi-day to a single cell
 *  (first visible day, or the event’s start if it is inside the range).
 */
export function getEventDays(
  event: CalendarEvent,
  days: CalendarProcessedDate[],
  adapter: Adapter,
  eventPlacement: 'first-day' | 'every-day',
) {
  const eventFirstDay = adapter.startOfDay(event.start);
  const eventLastDay = adapter.endOfDay(event.end);

  if (eventPlacement === 'first-day') {
    if (adapter.isBefore(eventFirstDay, days[0].value)) {
      return [days[0].value];
    }
    return [eventFirstDay];
  }
  return days
    .filter((day) => isDayWithinRange(day.value, eventFirstDay, eventLastDay, adapter))
    .map((day) => day.value);
}

export function processDate(date: SchedulerValidDate, adapter: Adapter): CalendarProcessedDate {
  return {
    value: date,
    key: getDateKey(date, adapter),
    startOfDay: adapter.startOfDay(date),
    endOfDay: adapter.endOfDay(date),
  };
}

export function getDateKey(day: SchedulerValidDate, adapter: Adapter): string {
  return adapter.format(day, 'keyboardDate');
}
