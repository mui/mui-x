import {
  SchedulerValidDate,
  CalendarEvent,
  CalendarProcessedDate,
  CalendarEventOccurrence,
} from '../models';
import { Adapter } from './adapter/types';
import { getRecurringEventOccurrencesForVisibleDays } from './recurrence-utils';

/**
 *  Returns the key of the days an event occurrence should be visible on.
 */
export function getDaysTheOccurrenceIsVisibleOn(
  event: CalendarEventOccurrence,
  days: CalendarProcessedDate[],
  adapter: Adapter,
  renderEventIn: 'first-day' | 'every-day',
) {
  const dayKeys: string[] = [];
  for (const day of days) {
    // If the day is before the event start, skip to the next day
    if (adapter.isBeforeDay(day.value, event.start)) {
      continue;
    }

    // If the day is after the event end, break as the days are sorted by start date
    if (adapter.isAfterDay(day.value, event.end)) {
      break;
    }
    dayKeys.push(day.key);

    // If the event should only be rendered on its first day, break after the first match
    if (renderEventIn === 'first-day') {
      break;
    }
  }
  return dayKeys;
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

/**
 * Returns the occurrences to render in the given date range, expanding recurring events.
 */
export function getOccurrencesFromEvents(parameters: GetOccurrencesFromEventsParameters) {
  const { adapter, start, end, events, visibleResources } = parameters;
  const occurrences: CalendarEventOccurrence[] = [];

  for (const event of events) {
    // STEP 1: Skip events from resources that are not visible
    if (event.resource && visibleResources.get(event.resource) === false) {
      continue;
    }

    // STEP 2-A: Recurrent event processing, if it is recurrent expand it for the visible days
    if (event.rrule) {
      // TODO: Check how this behave when the occurrence is between start and end but not in the visible days (e.g: hidden week end).
      occurrences.push(...getRecurringEventOccurrencesForVisibleDays(event, start, end, adapter));
      continue;
    }

    // STEP 2-B: Non-recurring event processing, skip events that are not within the visible days
    if (adapter.isAfter(event.start, end) || adapter.isBefore(event.end, start)) {
      continue;
    }

    occurrences.push({ ...event, key: String(event.id) });
  }

  // STEP 3: Sort by the actual start date of each occurrence
  // If two events have the same start date, put the longest one first
  // We sort here so that events are processed in the correct order
  return (
    occurrences
      // TODO: Avoid JS Date conversion
      .map((occurrence) => ({
        occurrence,
        start: adapter.toJsDate(occurrence.start).getTime(),
        end: adapter.toJsDate(occurrence.end).getTime(),
      }))
      .sort((a, b) => a.start - b.start || b.end - a.end)
      .map((item) => item.occurrence)
  );
}

interface GetOccurrencesFromEventsParameters {
  adapter: Adapter;
  start: SchedulerValidDate;
  end: SchedulerValidDate;
  events: CalendarEvent[];
  visibleResources: Map<string, boolean>;
}

// TODO: Allow to render some multi-day events that are not all-day in the Day Grid.
export function isMultiDayEvent(event: CalendarEvent | CalendarEventOccurrence) {
  if (event.allDay) {
    return true;
  }

  return false;
}
