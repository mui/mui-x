import type {
  RecurringEventScope,
  SchedulerProcessedEvent,
  SchedulerEventOccurrence,
} from '@mui/x-scheduler-internals/models';
import type { UpdateEventsParameters } from '@mui/x-scheduler-internals/internals';
import { getOccurrencePlainDate } from '@mui/x-scheduler-internals/internals';
import { RecurringSeries } from './RecurringSeries';

export function deleteRecurringEvent(
  originalEvent: SchedulerProcessedEvent,
  occurrence: SchedulerEventOccurrence,
  scope: RecurringEventScope,
  displayTimezone: string,
): UpdateEventsParameters {
  switch (scope) {
    case 'this-and-following': {
      return applyRecurringDeleteFollowing(originalEvent, occurrence, displayTimezone);
    }

    case 'all': {
      return { deleted: [originalEvent.id] };
    }

    case 'only-this': {
      return applyRecurringDeleteOnlyThis(originalEvent, occurrence, displayTimezone);
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
  originalEvent: SchedulerProcessedEvent,
  occurrence: SchedulerEventOccurrence,
  displayTimezone: string,
): UpdateEventsParameters {
  const occurrenceDay = getOccurrencePlainDate(occurrence);
  const previousExDates = originalEvent.exDates ?? [];
  const excludedDays = [...previousExDates.map((exDate) => exDate.toPlainDate()), occurrenceDay];
  // The writer preserves existing exception strings, including repeated-hour instants.
  const exDates = [...previousExDates, occurrenceDay.toPlainDateTime()];

  if (!RecurringSeries.fromEvent(originalEvent, displayTimezone, excludedDays).hasOccurrence()) {
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
  originalEvent: SchedulerProcessedEvent,
  occurrence: SchedulerEventOccurrence,
  displayTimezone: string,
): UpdateEventsParameters {
  const occurrencePlainDate = getOccurrencePlainDate(occurrence);
  if (
    !RecurringSeries.fromEvent(originalEvent, displayTimezone).hasOccurrenceBefore(
      occurrencePlainDate,
    )
  ) {
    return { deleted: [originalEvent.id] };
  }

  const { count, until, ...baseRule } = originalEvent.rrule!;
  return {
    updated: [
      {
        id: originalEvent.id,
        // The series keeps the whole day before the edited occurrence.
        rrule: { ...baseRule, until: occurrencePlainDate.add({ days: -1 }) },
      },
    ],
  };
}
