import { Adapter } from '@mui/x-scheduler-internals/use-adapter';
import {
  RecurringEventScope,
  SchedulerProcessedEvent,
  TemporalSupportedObject,
} from '@mui/x-scheduler-internals/models';
import type { UpdateEventsParameters } from '@mui/x-scheduler-internals/internals';
import { hasOccurrenceBefore, hasRemainingOccurrence } from './seriesOccurrence';

export function deleteRecurringEvent(
  adapter: Adapter,
  originalEvent: SchedulerProcessedEvent,
  occurrenceStart: TemporalSupportedObject,
  scope: RecurringEventScope,
): UpdateEventsParameters {
  switch (scope) {
    case 'this-and-following': {
      return applyRecurringDeleteFollowing(adapter, originalEvent, occurrenceStart);
    }

    case 'all': {
      return { deleted: [originalEvent.id] };
    }

    case 'only-this': {
      return applyRecurringDeleteOnlyThis(adapter, originalEvent, occurrenceStart);
    }

    default: {
      throw new Error(
        `MUI X Scheduler: The scope "${scope}" is not supported for recurring events. ` +
          'Supported scopes are "all", "only-this", and "this-and-following". ' +
          'Use one of the supported scope values.',
      );
    }
  }
}

/**
 * Deletes a single occurrence by adding an EXDATE to the series.
 * Drops the whole series when excluding the occurrence would leave no occurrence.
 * @returns The updated list of events.
 */
export function applyRecurringDeleteOnlyThis(
  adapter: Adapter,
  originalEvent: SchedulerProcessedEvent,
  occurrenceStart: TemporalSupportedObject,
): UpdateEventsParameters {
  const exDates = [
    ...(originalEvent.dataTimezone.exDates ?? []),
    adapter.startOfDay(occurrenceStart),
  ];

  if (!hasRemainingOccurrence(adapter, originalEvent, exDates)) {
    return { deleted: [originalEvent.id] };
  }

  return {
    updated: [{ id: originalEvent.id, exDates }],
  };
}

/**
 * Deletes the edited occurrence and every following one by truncating the rule to end the day
 * before. Drops the whole series when no occurrence remains before the edited one.
 * @returns The updated list of events.
 */
export function applyRecurringDeleteFollowing(
  adapter: Adapter,
  originalEvent: SchedulerProcessedEvent,
  occurrenceStart: TemporalSupportedObject,
): UpdateEventsParameters {
  if (!hasOccurrenceBefore(adapter, originalEvent, occurrenceStart)) {
    return { deleted: [originalEvent.id] };
  }

  const untilDate = adapter.addDays(adapter.startOfDay(occurrenceStart), -1);
  const { count, until, ...baseRule } = originalEvent.dataTimezone.rrule!;
  return {
    updated: [{ id: originalEvent.id, rrule: { ...baseRule, until: untilDate } }],
  };
}
