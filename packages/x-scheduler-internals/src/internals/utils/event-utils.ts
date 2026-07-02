import { TemporalTimezone } from '../../base-ui-copy/types/temporal';
import {
  TemporalSupportedObject,
  SchedulerProcessedEvent,
  SchedulerProcessedDate,
  SchedulerEventOccurrence,
  SchedulerEventId,
  SchedulerResourceId,
} from '../../models';
import { SchedulerRecurringEventsPluginInterface } from '../plugins/SchedulerRecurringEventsPlugin.types';
import { Adapter } from '../../use-adapter/useAdapter.types';

export function generateOccurrenceFromEvent({
  event,
  eventId,
  occurrenceKey,
  start,
  end,
}: {
  event: SchedulerProcessedEvent;
  eventId: SchedulerEventId;
  occurrenceKey: string;
  start: SchedulerProcessedDate;
  end: SchedulerProcessedDate;
}): SchedulerEventOccurrence {
  return {
    ...event,
    id: eventId,
    key: occurrenceKey,
    displayTimezone: {
      ...event?.displayTimezone,
      start,
      end,
    },
    dataTimezone: {
      ...event?.dataTimezone,
      start,
      end,
    },
  };
}

/**
 *  Returns the key of the days an event occurrence should be visible on.
 */
export function getDaysTheOccurrenceIsVisibleOn(
  event: SchedulerEventOccurrence,
  days: SchedulerProcessedDate[],
  adapter: Adapter,
) {
  const eventStartStartOfDay = adapter.startOfDay(event.displayTimezone.start.value);
  const eventEndEndOfDay = adapter.endOfDay(event.displayTimezone.end.value);

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

/**
 * Returns the occurrences to render in the given date range, expanding recurring events.
 */
export function getOccurrencesFromEvents(parameters: GetOccurrencesFromEventsParameters) {
  const { adapter, start, end, events, visibleResources, displayTimezone, recurringEventsPlugin } =
    parameters;
  const occurrences: SchedulerEventOccurrence[] = [];

  for (const event of events) {
    // STEP 1: Skip events from resources that are not visible
    const eventResourceIds = getEventResourceIds(event.resource);
    const allHidden =
      eventResourceIds.length > 0 && eventResourceIds.every((id) => visibleResources[id] === false);
    if (allHidden) {
      continue;
    }

    // STEP 2-A: Recurrent event processing, if it is recurrent expand it for the visible days
    if (event.displayTimezone.rrule) {
      // Without the premium recurring-events plugin attached, recurring events
      // are not expanded into occurrences — they are treated as single non-recurring events.
      if (recurringEventsPlugin == null) {
        if (
          adapter.isAfter(event.displayTimezone.start.value, end) ||
          adapter.isBefore(event.displayTimezone.end.value, start)
        ) {
          continue;
        }
        occurrences.push({ ...event, key: String(event.id) });
        continue;
      }

      // TODO: Check how this behave when the occurrence is between start and end but not in the visible days (e.g: hidden week end).
      occurrences.push(
        ...recurringEventsPlugin.getOccurrencesForVisibleDays(
          event,
          start,
          end,
          adapter,
          displayTimezone,
        ),
      );
      continue;
    }

    // STEP 2-B: Non-recurring event processing, skip events that are not within the visible days
    if (
      adapter.isAfter(event.displayTimezone.start.value, end) ||
      adapter.isBefore(event.displayTimezone.end.value, start)
    ) {
      continue;
    }

    occurrences.push({ ...event, key: String(event.id) });
  }

  return occurrences;
}

/**
 * Returns the resource IDs for the given resource, or an empty array if the resource is null or undefined.
 */
export function getEventResourceIds(
  resource: SchedulerResourceId | SchedulerResourceId[] | null | undefined,
): SchedulerResourceId[] {
  if (resource == null) {
    return [];
  }

  return Array.isArray(resource) ? resource : [resource];
}

/**
 * Returns the primary resource ID for the given resource, or null if the resource is null or undefined.
 */
export function getPrimaryResourceId(
  resource: SchedulerResourceId | SchedulerResourceId[] | null | undefined,
): SchedulerResourceId | null {
  if (resource == null) {
    return null;
  }

  if (Array.isArray(resource)) {
    return resource[0] ?? null;
  }

  return resource;
}

export interface GetOccurrencesFromEventsParameters {
  adapter: Adapter;
  start: TemporalSupportedObject;
  end: TemporalSupportedObject;
  events: SchedulerProcessedEvent[];
  visibleResources: Record<string, boolean>;
  displayTimezone: TemporalTimezone;
  recurringEventsPlugin: SchedulerRecurringEventsPluginInterface | null;
}
