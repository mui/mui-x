import {
  SchedulerValidDate,
  CalendarEvent,
  CalendarProcessedDate,
  CalendarEventOccurrence,
} from '../models';
import { Adapter } from '../use-adapter/useAdapter.types';
import { getRecurringEventOccurrencesForVisibleDays } from './recurring-event-utils';

/**
 *  Returns the key of the days an event occurrence should be visible on.
 */
export function getDaysTheOccurrenceIsVisibleOn(
  event: CalendarEventOccurrence,
  days: CalendarProcessedDate[],
  adapter: Adapter,
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
  }
  return dayKeys;
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

  return occurrences;
}

export interface GetOccurrencesFromEventsParameters {
  adapter: Adapter;
  start: SchedulerValidDate;
  end: SchedulerValidDate;
  events: CalendarEvent[];
  visibleResources: Map<string, boolean>;
}

export function sortEventOccurrences(
  occurrences: CalendarEventOccurrence[],
  adapter: Adapter,
): CalendarEventOccurrence[] {
  return occurrences
    .map((occurrence) => {
      // If we sort by date only, we normalize the start to be the start of the day
      const occurrenceStart = occurrence.allDay
        ? adapter.startOfDay(occurrence.start)
        : occurrence.start;

      const occurrenceEnd = occurrence.allDay ? adapter.endOfDay(occurrence.end) : occurrence.end;

      return {
        occurrence,
        // TODO: Avoid JS Date conversion
        start: adapter.toJsDate(occurrenceStart).getTime(),
        end: adapter.toJsDate(occurrenceEnd).getTime(),
      };
    })
    .sort((a, b) => a.start - b.start || b.end - a.end)
    .map((item) => item.occurrence);
}
