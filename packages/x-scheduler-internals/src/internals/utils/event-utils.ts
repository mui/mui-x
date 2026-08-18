import type { TemporalTimezone } from '@base-ui/react/internals/temporal';
import type {
  TemporalSupportedObject,
  SchedulerProcessedEvent,
  SchedulerProcessedDate,
  SchedulerEventOccurrence,
  SchedulerEventId,
  SchedulerResourceId,
} from '../../models';
import type { SchedulerRecurringEventsPluginInterface } from '../plugins/SchedulerRecurringEventsPlugin.types';
import type { Adapter } from '../../use-adapter/useAdapter.types';
import { getDateKey } from './date-utils';
import type { SchedulerEventRangeIndex } from './event-range-index';

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
  const {
    adapter,
    start,
    end,
    events,
    eventRangeIndex,
    visibleResources,
    displayTimezone,
    recurringEventsPlugin,
  } = parameters;
  const occurrences: SchedulerEventOccurrence[] = [];
  const eventsInRange =
    eventRangeIndex == null ? events : eventRangeIndex.getEventsForRange(start, end);

  for (const event of eventsInRange) {
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

    // The index already excludes non-recurring events outside the visible range.
    if (eventRangeIndex == null) {
      if (
        adapter.isAfter(event.displayTimezone.start.value, end) ||
        adapter.isBefore(event.displayTimezone.end.value, start)
      ) {
        continue;
      }
    }

    occurrences.push({ ...event, key: getOccurrenceKey(event.id) });
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

export type ResourceSelectionMode = 'single' | 'multiple';

/**
 * Resolves whether an occurrence should be edited (and saved) as single- or multi-resource.
 *
 * - Creating: `canHaveMultipleResources` decides, full stop. A creation placeholder can already
 *   carry a `resource` (e.g. the Event Timeline pre-selects the row it was created in), but that
 *   only seeds an entry — it doesn't get to pick the picker, exactly like the Event Calendar,
 *   whose creation placeholder never carries a resource at all.
 * - Editing: the shape of `resource` is the source of truth and is never overridden — a string
 *   means single, an array (including `[]`) means multiple. Only when `resource` carries no
 *   shape (`null` or `undefined`) does the mode fall back to `canHaveMultipleResources`.
 *
 * `canHaveMultipleResources` is resolved by the caller from the `eventCreation` prop, or
 * inferred from the rest of the data — see `schedulerEventSelectors.canHaveMultipleResources`.
 */
export function getResourceSelectionMode(
  resource: SchedulerResourceId | SchedulerResourceId[] | null | undefined,
  canHaveMultipleResources: boolean,
  isCreating: boolean,
): ResourceSelectionMode {
  if (isCreating) {
    return canHaveMultipleResources ? 'multiple' : 'single';
  }
  if (Array.isArray(resource)) {
    return 'multiple';
  }
  if (resource != null) {
    return 'single';
  }
  return canHaveMultipleResources ? 'multiple' : 'single';
}

interface GetOccurrencesFromEventsBaseParameters {
  adapter: Adapter;
  start: TemporalSupportedObject;
  end: TemporalSupportedObject;
  visibleResources: Record<string, boolean>;
  displayTimezone: TemporalTimezone;
  recurringEventsPlugin: SchedulerRecurringEventsPluginInterface | null;
}

export type GetOccurrencesFromEventsParameters = GetOccurrencesFromEventsBaseParameters &
  (
    | { events: SchedulerProcessedEvent[]; eventRangeIndex?: never }
    | { events?: never; eventRangeIndex: SchedulerEventRangeIndex }
  );
