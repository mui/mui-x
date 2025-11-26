import {
  SchedulerValidDate,
  SchedulerProcessedEvent,
  SchedulerProcessedDate,
  SchedulerEventOccurrence,
} from '../models';
import { Adapter } from '../use-adapter/useAdapter.types';
import { getRecurringEventOccurrencesForVisibleDays } from './recurring-events';

/**
 *  Returns the key of the days an event occurrence should be visible on.
 */
export function getDaysTheOccurrenceIsVisibleOn(
  event: SchedulerEventOccurrence,
  days: SchedulerProcessedDate[],
  adapter: Adapter,
) {
  const eventStartStartOfDay = adapter.startOfDay(event.start.value);
  const eventEndEndOfDay = adapter.endOfDay(event.end.value);

  const dayKeys: string[] = [];
  for (const day of days) {
    // If the day is before the event start, skip to the next day
    if (adapter.isBefore(day.value, eventStartStartOfDay)) {
      continue;
    }

    // If the day is after the event end, break as the days are sorted by start date
    if (adapter.isAfter(day.value, eventEndEndOfDay)) {
      break;
    }
    dayKeys.push(day.key);
  }
  return dayKeys;
}

const checkResourceVisibility = (
  resourceId: string,
  visibleResources: Map<string, boolean>,
  resourceParentIds: Map<string, string | null>,
): boolean => {
  if (!resourceId) {
    return true;
  }

  const isResourceVisible = visibleResources.get(resourceId) !== false;

  if (isResourceVisible) {
    const parentId = resourceParentIds.get(resourceId);
    if (!parentId) {
      return isResourceVisible;
    }
    return checkResourceVisibility(parentId, visibleResources, resourceParentIds);
  }

  return isResourceVisible;
};

/**
 * Returns the occurrences to render in the given date range, expanding recurring events.
 */
export function getOccurrencesFromEvents(parameters: GetOccurrencesFromEventsParameters) {
  const { adapter, start, end, events, visibleResources, resourceParentIds } = parameters;
  const occurrences: SchedulerEventOccurrence[] = [];

  for (const event of events) {
    // STEP 1: Skip events from resources that are not visible
    if (
      event.resource &&
      checkResourceVisibility(event.resource, visibleResources, resourceParentIds) === false
    ) {
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

  return occurrences;
}

export interface GetOccurrencesFromEventsParameters {
  adapter: Adapter;
  start: SchedulerValidDate;
  end: SchedulerValidDate;
  events: SchedulerProcessedEvent[];
  visibleResources: Map<string, boolean>;
  resourceParentIds: Map<string, string | null>;
}
