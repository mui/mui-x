import {
  SchedulerValidDate,
  SchedulerProcessedEvent,
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
    if (adapter.isBeforeDay(day.value, event.start.value)) {
      continue;
    }

    // If the day is after the event end, break as the days are sorted by start date
    if (adapter.isAfterDay(day.value, event.end.value)) {
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
    if (adapter.isAfter(event.start.value, end) || adapter.isBefore(event.end.value, start)) {
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
        start: adapter.toJsDate(occurrence.start.value).getTime(),
        end: adapter.toJsDate(occurrence.end.value).getTime(),
      }))
      .sort((a, b) => a.start - b.start || b.end - a.end)
      .map((item) => item.occurrence)
  );
}

interface GetOccurrencesFromEventsParameters {
  adapter: Adapter;
  start: SchedulerValidDate;
  end: SchedulerValidDate;
  events: SchedulerProcessedEvent[];
  visibleResources: Map<string, boolean>;
}
