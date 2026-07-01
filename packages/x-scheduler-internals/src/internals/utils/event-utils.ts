import type { TemporalTimezone } from '../../base-ui-copy/types/temporal';
import type {
  TemporalSupportedObject,
  SchedulerProcessedEvent,
  SchedulerProcessedDate,
  SchedulerEventOccurrence,
  SchedulerEventId,
} from '../../models';
import type { SchedulerRecurringEventsPluginInterface } from '../plugins/SchedulerRecurringEventsPlugin.types';
import type { Adapter } from '../../use-adapter/useAdapter.types';
import { getDateKey } from './date-utils';

/**
 * The render key of a non-recurring occurrence: the event id stringified.
 * Single source of truth so producers (occurrence expansion) and consumers (the editing highlight)
 * derive identical keys.
 */
export function getOccurrenceKey(eventId: SchedulerEventId): string {
  return String(eventId);
}

/**
 * The render key of a recurring occurrence: the event id plus the occurrence's day key. Shared so the
 * occurrence expansion and any code re-deriving the key (e.g. re-pointing the edited occurrence after a
 * recurring scope change) stay in lockstep.
 */
export function getRecurringOccurrenceKey(
  eventId: SchedulerEventId,
  day: TemporalSupportedObject,
  adapter: Adapter,
): string {
  return `${eventId}::${getDateKey(day, adapter)}`;
}

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
    if (event.resource && visibleResources[event.resource] === false) {
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
        occurrences.push({ ...event, key: getOccurrenceKey(event.id) });
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

    occurrences.push({ ...event, key: getOccurrenceKey(event.id) });
  }

  return occurrences;
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
