import type {
  RecurringEventScope,
  SchedulerProcessedEvent,
  SchedulerEventOccurrence,
} from '@mui/x-scheduler-internals/models';
import type { UpdateEventsParameters } from '@mui/x-scheduler-internals/internals';
import {
  getOccurrencePlainDate,
  getTimezoneId,
  toEpochMs,
  toZonedDateTime,
} from '@mui/x-scheduler-internals/internals';
import { resolveEventTimestamp } from '@mui/x-scheduler-internals/process-event';
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
 * @returns The updated list of events.
 */
export function applyRecurringDeleteOnlyThis(
  originalEvent: SchedulerProcessedEvent,
  occurrence: SchedulerEventOccurrence,
): UpdateEventsParameters {
  const { timezone } = originalEvent;
  const occurrenceDay = getOccurrencePlainDate(occurrence);
  const previousExDates = originalEvent.exDates ?? [];
  const excludedDays = [...previousExDates.map((exDate) => exDate.toPlainDate()), occurrenceDay];
  // The exceptions of an all-day series are dates, written as they are, even one the display
  // timezone skips; a timed series keeps the instants of its exceptions.
  // Resolved once, since `"default"` reads the timezone of the system from `Intl`.
  const timezoneId = getTimezoneId(timezone);
  const exDates = originalEvent.allDay
    ? excludedDays.map((day) => day.toString())
    : [
        ...(originalEvent.modelInBuiltInFormat.exDates ?? []).map((exDate) =>
          toZonedDateTime(resolveEventTimestamp(exDate, timezone), timezoneId),
        ),
        toZonedDateTime(toEpochMs(occurrenceDay, timezone), timezoneId),
      ];

  if (!RecurringSeries.fromEvent(originalEvent, excludedDays).hasOccurrence()) {
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
): UpdateEventsParameters {
  const occurrencePlainDate = getOccurrencePlainDate(occurrence);
  if (!RecurringSeries.fromEvent(originalEvent).hasOccurrenceBefore(occurrencePlainDate)) {
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
