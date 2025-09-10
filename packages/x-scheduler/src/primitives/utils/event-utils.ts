import {
  SchedulerValidDate,
  CalendarEvent,
  CalendarEventOccurrence,
  CalendarProcessedDate,
  CalendarEventOccurrencePosition,
} from '../models';
import { Adapter } from './adapter/types';
import { diffIn } from './date-utils';

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
 *  Computes the index and the span of an event occurrence when rendered in a list of days.
 *  If the event is present in the previous day of the same collection (e.g: same week in the Day Grid), reuses the previous day's row index and marks the occurrence as invisible for the current day.
 *  Otherwise, assigns the first free index in that day's stack and compute how many days is should span across.
 */
export function getEventOccurrencePositionInDayList(
  parameters: GetEventOccurrencePositionInDayListParameters,
): CalendarEventOccurrencePosition {
  const { adapter, indexLookup, occurrence, day, previousDay, daysBeforeCollectionEnd } =
    parameters;

  // If the event is present in the previous day, we keep the same index
  const occurrenceIndexInPreviousDay =
    previousDay == null ? null : indexLookup[previousDay.key]?.occurrencesIndex[occurrence.key];

  if (occurrenceIndexInPreviousDay != null) {
    return { index: occurrenceIndexInPreviousDay, span: 0 };
  }

  // Otherwise, we just set first available index
  const usedIndexes = indexLookup[day.key]?.usedIndexes;
  let i = 1;
  if (usedIndexes) {
    while (usedIndexes.has(i)) {
      i += 1;
    }
  }

  const durationInDays = diffIn(adapter, occurrence.end, day.value, 'days') + 1;
  const columnSpan = Math.min(durationInDays, daysBeforeCollectionEnd); // Don't go past the collection end

  return { index: i, span: columnSpan };
}

export interface GetEventOccurrencePositionInDayListParameters {
  adapter: Adapter;
  occurrence: CalendarEventOccurrence;
  daysBeforeCollectionEnd: number;
  day: CalendarProcessedDate;
  previousDay: CalendarProcessedDate | null;
  indexLookup: {
    [dayKey: string]: {
      occurrencesIndex: { [occurrenceKey: string]: number };
      usedIndexes: Set<number>;
    };
  };
}

/**
 *  Returns the list of days an event occurrence should be visible on.
 */
export function getDaysTheOccurrenceIsVisibleOn(
  event: CalendarEvent,
  days: CalendarProcessedDate[],
  adapter: Adapter,
  renderEventIn: 'first-day' | 'every-day',
) {
  const eventFirstDay = adapter.startOfDay(event.start);
  if (renderEventIn === 'first-day') {
    if (adapter.isBefore(eventFirstDay, days[0].value)) {
      return [days[0].value];
    }
    return [eventFirstDay];
  }

  const eventLastDay = adapter.endOfDay(event.end);
  return days
    .filter((day) => isDayWithinRange(day.value, eventFirstDay, eventLastDay, adapter))
    .map((day) => day.value);
}

/**
 * Creates a CalendarProcessedDate object from a date object.
 */
export function processDate(date: SchedulerValidDate, adapter: Adapter): CalendarProcessedDate {
  return {
    value: date,
    key: getDateKey(date, adapter),
  };
}

/**
 * Returns a string representation of the date.
 * It can be used as key in Maps or passed to the React `key` property when looping through days.
 * It only contains date information, two dates representing the same day but with different time will have the same key.
 */
export function getDateKey(day: SchedulerValidDate, adapter: Adapter): string {
  return adapter.format(day, 'keyboardDate');
}
