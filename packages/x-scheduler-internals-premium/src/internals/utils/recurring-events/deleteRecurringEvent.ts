import type {
  RecurringEventScope,
  SchedulerProcessedEvent,
  SchedulerEventOccurrence,
} from '@mui/x-scheduler-internals/models';
import type { UpdateEventsParameters } from '@mui/x-scheduler-internals/internals';
import { createStartOfPlainDate, toPlainDate } from '@mui/x-scheduler-internals/internals';
import { createStartOfPreviousDay } from './internal-utils';
import { RecurringSeries } from './RecurringSeries';

export function deleteRecurringEvent(
  originalEvent: SchedulerProcessedEvent,
  occurrence: SchedulerEventOccurrence,
  scope: RecurringEventScope,
): UpdateEventsParameters {
  switch (scope) {
    case 'this-and-following': {
      return applyRecurringDeleteFollowing(originalEvent, occurrence);
    }

    case 'all': {
      return { deleted: [originalEvent.id] };
    }

    case 'only-this': {
      return applyRecurringDeleteOnlyThis(originalEvent, occurrence);
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
 * Reads `occurrenceStart` in the event's data timezone.
 * @returns The updated list of events.
 */
export function applyRecurringDeleteOnlyThis(
  originalEvent: SchedulerProcessedEvent,
  occurrence: SchedulerEventOccurrence,
): UpdateEventsParameters {
  const occurrenceStart = new Date(occurrence.unstable_internalInfos.dataStart);
  const exDates = [
    ...(originalEvent.exDates ?? []).map((exDate) => new Date(exDate.epochMilliseconds)),
    createStartOfPlainDate(
      toPlainDate(occurrenceStart.getTime(), originalEvent.timezone),
      originalEvent.timezone,
    ),
  ];

  if (
    !RecurringSeries.fromEvent(
      originalEvent,
      exDates.map((exDate) => exDate.getTime()),
    ).hasOccurrence()
  ) {
    return { deleted: [originalEvent.id] };
  }

  return {
    updated: [{ id: originalEvent.id, exDates }],
  };
}

/**
 * Deletes the edited occurrence and every following one by truncating the rule to end the day
 * before. Drops the whole series when no occurrence remains before the edited one.
 * Reads `occurrenceStart` in the event's data timezone.
 * @returns The updated list of events.
 */
export function applyRecurringDeleteFollowing(
  originalEvent: SchedulerProcessedEvent,
  occurrence: SchedulerEventOccurrence,
): UpdateEventsParameters {
  const occurrenceStart = new Date(occurrence.unstable_internalInfos.dataStart);
  const occurrencePlainDate = toPlainDate(occurrenceStart.getTime(), originalEvent.timezone);
  if (!RecurringSeries.fromEvent(originalEvent).hasOccurrenceBefore(occurrencePlainDate)) {
    return { deleted: [originalEvent.id] };
  }

  const untilDate = createStartOfPreviousDay(occurrencePlainDate, originalEvent.timezone);
  const { count, until, ...baseRule } = originalEvent.rrule!;
  return {
    updated: [{ id: originalEvent.id, rrule: { ...baseRule, until: untilDate } }],
  };
}
