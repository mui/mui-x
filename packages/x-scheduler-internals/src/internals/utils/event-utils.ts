import type {
  SchedulerProcessedEvent,
  SchedulerProcessedEventInternalInfos,
  SchedulerProcessedDate,
  SchedulerProcessedDay,
  SchedulerEventOccurrence,
  SchedulerEventId,
  SchedulerRenderableEventOccurrence,
  SchedulerResourceId,
} from '../../models';
import type { SchedulerRecurringEventsPluginInterface } from '../plugins/SchedulerRecurringEventsPlugin.types';
import { toLocalDayNumber, toPlainDate } from './plain-date-utils/timeZone';
import { getDayNumber, getPlainDateKey } from './plain-date-utils/plainDate';
import type { SchedulerEventRangeIndex } from './event-range-index';

/**
 * The day number of the last day an occurrence covers in the display timezone. The end of an
 * all-day occurrence is exclusive: the first instant of the day after its last day.
 */
export function getOccurrenceLastDayNumber(
  occurrence: Pick<SchedulerRenderableEventOccurrence, 'allDay' | 'end' | 'unstable_internalInfos'>,
): number {
  return occurrence.allDay
    ? toLocalDayNumber(
        occurrence.end.timestamp - 1,
        occurrence.unstable_internalInfos.displayTimezone,
      )
    : getDayNumber(occurrence.end.value.toPlainDate());
}

/**
 * The end of an occurrence as the event models write it: an all-day event model ends on the last
 * instant of its last day, where its occurrence's exclusive end is the first instant after it.
 */
export function getOccurrenceModelEnd(
  occurrence: Pick<SchedulerRenderableEventOccurrence, 'allDay' | 'end'>,
): number {
  return occurrence.end.timestamp - (occurrence.allDay ? 1 : 0);
}

/**
 * Whether the occurrence is a persisted event occurrence, as opposed to a
 * placeholder (creation draft, drag preview) that has no data instants.
 */
export function isEventOccurrence(
  occurrence: SchedulerRenderableEventOccurrence,
): occurrence is SchedulerEventOccurrence {
  return 'dataStart' in occurrence.unstable_internalInfos;
}

/**
 * The internal values of an occurrence, with its instants in the data timezone, the identity
 * recurring drag updates target; placeholders have none.
 */
export function getOccurrenceInternalInfos(
  occurrence: SchedulerRenderableEventOccurrence,
): SchedulerProcessedEventInternalInfos | undefined {
  return isEventOccurrence(occurrence) ? occurrence.unstable_internalInfos : undefined;
}

/**
 * The timestamp of a bound of an event or occurrence, in its data timezone.
 */
export function getDataTimestamp(event: SchedulerProcessedEvent, bound: 'start' | 'end'): number {
  return bound === 'start'
    ? event.unstable_internalInfos.dataStart
    : event.unstable_internalInfos.dataEnd;
}

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
  timestamp: number,
  timezone: string,
): string {
  return getRecurringOccurrenceKeyFromDateKey(
    eventId,
    getPlainDateKey(toPlainDate(timestamp, timezone)),
  );
}

/**
 * The render key of a recurring occurrence, from the key of its day (`getPlainDateKey()`).
 */
export function getRecurringOccurrenceKeyFromDateKey(
  eventId: SchedulerEventId,
  dateKey: string,
): string {
  return `${eventId}::${dateKey}`;
}

export function generateOccurrenceFromEvent({
  event,
  eventId,
  occurrenceKey,
  start,
  end,
  internalInfos,
}: {
  event: SchedulerProcessedEvent;
  eventId: SchedulerEventId;
  occurrenceKey: string;
  start: SchedulerProcessedDate;
  end: SchedulerProcessedDate;
  /**
   * The internal values of the occurrence, with its instants in the data timezone. Defaults to the
   * display `start`/`end`, a fallback only placeholder occurrences may rely on.
   */
  internalInfos?: SchedulerProcessedEventInternalInfos;
}): SchedulerEventOccurrence {
  // `exDates` is cleared rather than left out with a rest destructuring, which is about 8 times
  // slower.
  const occurrence = {
    ...event,
    exDates: undefined,
    id: eventId,
    key: occurrenceKey,
    start,
    end,
    unstable_internalInfos: internalInfos ?? {
      displayTimezone: event.unstable_internalInfos.displayTimezone,
      dataStart: start.timestamp,
      dataEnd: end.timestamp,
    },
  };
  return occurrence;
}

/**
 * Returns the key of the days an event occurrence should be visible on.
 * `dayNumbers` are the day numbers of `days`, read once for all the occurrences of the days.
 */
export function getDaysTheOccurrenceIsVisibleOn(
  event: SchedulerEventOccurrence,
  days: SchedulerProcessedDay[],
  dayNumbers: readonly number[],
) {
  const startDayNumber = getDayNumber(event.start.value.toPlainDate());
  const endDayNumber = getOccurrenceLastDayNumber(event);

  const dayKeys: string[] = [];
  for (let index = 0; index < days.length; index += 1) {
    const dayNumber = dayNumbers[index];
    // If the day is before the event start, skip to the next day
    if (dayNumber < startDayNumber) {
      continue;
    }

    // If the day is after the event end, break as the days are sorted by start date
    if (dayNumber > endDayNumber) {
      break;
    }
    dayKeys.push(days[index].key);
  }
  return dayKeys;
}

/**
 * Returns the occurrences to render in the given date range, expanding recurring events.
 * Build eventRangeIndex with expandRecurringEvents set to whether recurringEventsPlugin is non-null.
 */
export function getOccurrencesFromEvents(parameters: GetOccurrencesFromEventsParameters) {
  const { start, end, eventRangeIndex, visibleResources, displayTimezone, recurringEventsPlugin } =
    parameters;
  const occurrences: SchedulerEventOccurrence[] = [];
  const eventsInRange = eventRangeIndex.getEventsForRange(start, end);

  for (const event of eventsInRange) {
    // STEP 1: Skip events from resources that are not visible
    const eventResourceIds = getEventResourceIds(event.resource);
    const allHidden =
      eventResourceIds.length > 0 && eventResourceIds.every((id) => visibleResources[id] === false);
    if (allHidden) {
      continue;
    }

    // STEP 2: Recurrent event processing, if it is recurrent expand it for the visible days
    if (event.rrule && recurringEventsPlugin != null) {
      // TODO: Check how this behave when the occurrence is between start and end but not in the visible days (e.g: hidden week end).
      occurrences.push(
        ...recurringEventsPlugin.getOccurrencesForVisibleDays(event, start, end, displayTimezone),
      );
      continue;
    }

    // Without the recurring-events plugin, recurring events are treated as single events.
    // `exDates` is cleared rather than left out with a rest destructuring, which is about 8 times
    // slower.
    const occurrence = { ...event, exDates: undefined, key: getOccurrenceKey(event.id) };
    occurrences.push(occurrence);
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

export interface GetOccurrencesFromEventsParameters {
  /**
   * The first instant of the range, as a timestamp.
   */
  start: number;
  /**
   * The last instant of the range, as a timestamp.
   */
  end: number;
  eventRangeIndex: SchedulerEventRangeIndex;
  visibleResources: Record<string, boolean>;
  displayTimezone: string;
  recurringEventsPlugin: SchedulerRecurringEventsPluginInterface | null;
}
