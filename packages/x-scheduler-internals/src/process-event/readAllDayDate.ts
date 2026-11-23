import type { SchedulerEvent, SchedulerEventId } from '../models';
import { BaseTemporal } from '../internals/utils/base-temporal';
import { parseDateOnlyString } from '../internals/utils/plain-date-utils/date';

const DOCS_LINK = 'https://mui.com/x/react-scheduler/event-calendar/events/#all-day';

function readAllDayBound(
  bound: 'start' | 'end',
  value: string,
  eventId: SchedulerEventId,
): BaseTemporal.PlainDate {
  const date = parseDateOnlyString(value);
  if (date == null) {
    throw new Error(
      `MUI X Scheduler: The ${bound} "${value}" of the all-day event "${eventId}" is not an existing date in the YYYY-MM-DD format. ` +
        'All-day events are floating dates with no time or timezone, so a date-time cannot place them on a day. ' +
        `Store the dates of all-day events as "YYYY-MM-DD" strings with an exclusive end, like start: "2025-07-04", end: "2025-07-05" for July 4th. See ${DOCS_LINK}.`,
    );
  }
  return date;
}

/**
 * Reads the bounds of an all-day event as plain dates.
 * Throws when a bound is not a `YYYY-MM-DD` date or when the end is not after the start.
 */
export function readAllDayBounds(model: Pick<SchedulerEvent, 'id' | 'start' | 'end'>): {
  start: BaseTemporal.PlainDate;
  end: BaseTemporal.PlainDate;
} {
  const start = readAllDayBound('start', model.start, model.id);
  const end = readAllDayBound('end', model.end, model.id);
  if (BaseTemporal.PlainDate.compare(end, start) <= 0) {
    throw new Error(
      `MUI X Scheduler: The all-day event "${model.id}" ends on ${model.end}, which is not after its start ${model.start}. ` +
        'The end of an all-day event is exclusive, the day after its last day, so an event ending on or before its start day covers no day. ' +
        `Set end to the day after the last day, like start: "2025-07-04", end: "2025-07-05" for July 4th. See ${DOCS_LINK}.`,
    );
  }
  return { start, end };
}

/**
 * Reads an exception date of an all-day series as a plain date.
 * Throws when it is not a `YYYY-MM-DD` date.
 */
export function readAllDayExDate(value: string, eventId: SchedulerEventId): BaseTemporal.PlainDate {
  const date = parseDateOnlyString(value);
  if (date == null) {
    throw new Error(
      `MUI X Scheduler: The exception date "${value}" of the all-day event "${eventId}" is not an existing date in the YYYY-MM-DD format. ` +
        'The occurrences of an all-day series are days, so an exception needs a date to match one. ' +
        `Store the exDates of all-day events as "YYYY-MM-DD" strings, like "2025-07-11". See ${DOCS_LINK}.`,
    );
  }
  return date;
}
