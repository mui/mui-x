import { TemporalTimezone } from '../../base-ui-copy/types/temporal';
import {
  TemporalSupportedObject,
  SchedulerProcessedEvent,
  SchedulerProcessedDate,
  SchedulerEventOccurrence,
  SchedulerEventId,
} from '../../models';
import { SchedulerPlan } from './SchedulerStore/SchedulerStore.types';
import { Adapter } from '../../use-adapter/useAdapter.types';
import { getRecurringEventOccurrencesForVisibleDays } from './recurring-events';

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
 *
 * When `previous` is provided, occurrences whose underlying `SchedulerProcessedEvent`
 * reference is unchanged from the previous call are returned with the same JS reference
 * as before. This enables downstream reference-equality checks (per-day layout reuse,
 * leaf `React.memo` skipping) to short-circuit on unchanged events.
 *
 * When `outEventByKey` is provided, the function populates it with `key → underlying
 * SchedulerProcessedEvent`, so the caller can pass it back as `previous.eventByKey` on
 * the next call.
 */
export function getOccurrencesFromEvents(parameters: GetOccurrencesFromEventsParameters) {
  const {
    adapter,
    start,
    end,
    events,
    visibleResources,
    displayTimezone,
    plan,
    previous,
    outEventByKey,
  } = parameters;
  const occurrences: SchedulerEventOccurrence[] = [];

  const maybeReuse = (
    occurrence: SchedulerEventOccurrence,
    event: SchedulerProcessedEvent,
  ): SchedulerEventOccurrence => {
    if (previous !== undefined && previous.eventByKey.get(occurrence.key) === event) {
      const prev = previous.byKey.get(occurrence.key);
      if (prev !== undefined) {
        return prev;
      }
    }
    return occurrence;
  };

  for (const event of events) {
    // STEP 1: Skip events from resources that are not visible
    if (event.resource && visibleResources[event.resource] === false) {
      continue;
    }

    // STEP 2-A: Recurrent event processing, if it is recurrent expand it for the visible days
    if (event.displayTimezone.rrule) {
      // In community, recurring events are not expanded into occurrences.
      // They are treated as single non-recurring events.
      if (plan !== 'premium') {
        if (
          adapter.isAfter(event.displayTimezone.start.value, end) ||
          adapter.isBefore(event.displayTimezone.end.value, start)
        ) {
          continue;
        }
        const occ = maybeReuse({ ...event, key: String(event.id) }, event);
        occurrences.push(occ);
        outEventByKey?.set(occ.key, event);
        continue;
      }

      // TODO: Check how this behave when the occurrence is between start and end but not in the visible days (e.g: hidden week end).
      const recurringOccurrences = getRecurringEventOccurrencesForVisibleDays(
        event,
        start,
        end,
        adapter,
        displayTimezone,
      );
      for (const recurringOccurrence of recurringOccurrences) {
        const occ = maybeReuse(recurringOccurrence, event);
        occurrences.push(occ);
        outEventByKey?.set(occ.key, event);
      }
      continue;
    }

    // STEP 2-B: Non-recurring event processing, skip events that are not within the visible days
    if (
      adapter.isAfter(event.displayTimezone.start.value, end) ||
      adapter.isBefore(event.displayTimezone.end.value, start)
    ) {
      continue;
    }

    const occ = maybeReuse({ ...event, key: String(event.id) }, event);
    occurrences.push(occ);
    outEventByKey?.set(occ.key, event);
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
  plan: SchedulerPlan;
  /**
   * Optional previous-call snapshot. When the underlying event for a given occurrence
   * key matches the previous run, the previous occurrence reference is reused.
   */
  previous?: {
    byKey: ReadonlyMap<string, SchedulerEventOccurrence>;
    eventByKey: ReadonlyMap<string, SchedulerProcessedEvent>;
  };
  /**
   * Optional output map: for every produced occurrence, sets `outEventByKey.set(occurrenceKey, event)`.
   * Pass it back on the next call as `previous.eventByKey` to enable reuse.
   */
  outEventByKey?: Map<string, SchedulerProcessedEvent>;
}
