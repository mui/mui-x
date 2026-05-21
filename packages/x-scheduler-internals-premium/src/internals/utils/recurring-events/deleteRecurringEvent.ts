import { Adapter } from '@mui/x-scheduler-internals/use-adapter';
import {
  RecurringEventUpdateScope,
  SchedulerProcessedEvent,
  TemporalSupportedObject,
} from '@mui/x-scheduler-internals/models';
import type { UpdateEventsParameters } from '@mui/x-scheduler-internals/internals';
import { getRecurringEventOccurrencesForVisibleDays } from './getRecurringEventOccurrencesForVisibleDays';

export function deleteRecurringEvent(
  adapter: Adapter,
  originalEvent: SchedulerProcessedEvent,
  occurrenceStart: TemporalSupportedObject,
  scope: RecurringEventUpdateScope,
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
        `MUI X Scheduler: The scope "${scope}" is not supported for recurring event deletions. ` +
          'Supported scopes are "all", "only-this", and "this-and-following". ' +
          'Use one of the supported scope values.',
      );
    }
  }
}

/**
 * Deletes a single occurrence by adding an EXDATE to the series.
 * @returns The updated list of events.
 */
export function applyRecurringDeleteOnlyThis(
  adapter: Adapter,
  originalEvent: SchedulerProcessedEvent,
  occurrenceStart: TemporalSupportedObject,
): UpdateEventsParameters {
  return {
    updated: [
      {
        id: originalEvent.id,
        exDates: [
          ...(originalEvent.dataTimezone.exDates ?? []),
          adapter.startOfDay(occurrenceStart),
        ],
      },
    ],
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
  const occurrenceDayStart = adapter.startOfDay(occurrenceStart);
  const untilDate = adapter.addDays(occurrenceDayStart, -1);

  const originalRule = originalEvent.dataTimezone.rrule!;
  const { count, until, ...baseRule } = originalRule;

  const occurrencesBefore = getRecurringEventOccurrencesForVisibleDays(
    originalEvent,
    originalEvent.dataTimezone.start.value,
    adapter.endOfDay(untilDate),
    adapter,
    originalEvent.dataTimezone.timezone,
  );

  if (occurrencesBefore.length === 0) {
    return { deleted: [originalEvent.id] };
  }

  return {
    updated: [{ id: originalEvent.id, rrule: { ...baseRule, until: untilDate } }],
  };
}
