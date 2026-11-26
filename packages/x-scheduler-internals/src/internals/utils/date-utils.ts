import type { SchedulerEvent, SchedulerProcessedEvent, WeekStartsOn } from '../../models';
import { BaseTemporal } from './base-temporal';
import {
  getStartOfWeekDayNumber,
  isoDateToDayNumber,
  MS_PER_DAY,
} from './plain-date-utils/dayNumber';
import { getDayNumber, getMsInDay, plainDateFromDayNumber } from './plain-date-utils/plainDate';
import type { WeekInfo } from './date-locale';
import {
  addDaysToDayStart,
  getStartOfDayMs,
  localToEpochMs,
  toEpochMs,
  toPlainDate,
  toPlainDateTime,
} from './plain-date-utils/timeZone';
import { isInstantString } from './plain-date-utils/date';

/**
 * Converts an instant back to an event date string, respecting the format of `originalString`:
 * after an instant string (ending with `Z` or an offset), a UTC ISO string, and after a wall-time
 * string, the wall-clock time in the event's data timezone, without the `Z` suffix.
 */
export function timestampToEventString(
  epochMs: number,
  originalString: string,
  dataTimezone: string,
): string {
  if (isInstantString(originalString)) {
    return new Date(epochMs).toISOString();
  }
  // Like the strings of the events, without milliseconds.
  return toPlainDateTime(Math.floor(epochMs / 1000) * 1000, dataTimezone).toString();
}

/**
 * Writes the `until` of a processed rule with the type of the start of the event: a date on an
 * all-day event, and a date-time on a timed one, in the format of `originalString` like
 * `timestampToEventString()`. A plain date covers its whole day, so on a timed event it is written
 * as the last instant of its day. A plain date-time is written as its instant, or as its date on
 * an all-day event.
 */
export function untilToEventString(
  until: BaseTemporal.PlainDate | BaseTemporal.PlainDateTime,
  originalString: string,
  dataTimezone: string,
  allDay: boolean,
): string {
  if (allDay) {
    return (until instanceof BaseTemporal.PlainDateTime ? until.toPlainDate() : until).toString();
  }
  if (until instanceof BaseTemporal.PlainDateTime) {
    return timestampToEventString(toEpochMs(until, dataTimezone), originalString, dataTimezone);
  }
  return timestampToEventString(
    toEpochMs(until.add({ days: 1 }), dataTimezone) - 1,
    originalString,
    dataTimezone,
  );
}

/**
 * The `until` of a timed series made all-day: the last date with an occurrence on or before it.
 * That is the date of a date-time `until`, or the day before when the occurrence of that date, at
 * the time of the start of the series in `timezone`, starts after it.
 */
export function getAllDayUntil(
  until: BaseTemporal.PlainDate | BaseTemporal.PlainDateTime,
  seriesStart: BaseTemporal.PlainDateTime,
  timezone: string,
): BaseTemporal.PlainDate {
  if (!(until instanceof BaseTemporal.PlainDateTime)) {
    return until;
  }
  const date = until.toPlainDate();
  // Resolved like the series does, so a time a DST gap skips starts after the gap.
  const occurrenceStart = localToEpochMs(
    getDayNumber(date) * MS_PER_DAY + getMsInDay(seriesStart),
    timezone,
  );
  return occurrenceStart > toEpochMs(until, timezone) ? date.add({ days: -1 }) : date;
}

/**
 * The string whose format the `until` written to an event follows: its current `until`, including
 * the UNTIL of an RRULE string, or else its start.
 */
export function getUntilReferenceString(event: SchedulerEvent): string {
  if (typeof event.rrule === 'object') {
    return event.rrule.until ?? event.start;
  }
  // The date form of UNTIL, like `20250110`, or its UTC date-time form, like `20250110T090000Z`.
  const match = event.rrule?.match(
    /(?:^|;)\s*UNTIL\s*=\s*(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})Z)?\s*(?:;|$)/i,
  );
  if (match == null) {
    return event.start;
  }
  const date = `${match[1]}-${match[2]}-${match[3]}`;
  return match[4] === undefined ? date : `${date}T${match[4]}:${match[5]}:${match[6]}Z`;
}

/**
 * Writes a bound of an all-day event: the date of its instant, which must be the first instant of
 * a day in `timezone`.
 */
export function allDayBoundToEventString(epochMs: number, timezone: string): string {
  if (epochMs !== getStartOfDayMs(epochMs, timezone)) {
    throw new Error(
      `MUI X Scheduler: The date ${new Date(epochMs).toISOString()} of the all-day event is not the first instant of a day in the display timezone "${timezone}". ` +
        'The dates of an all-day event are whole days, so an instant inside a day cannot be written as one of them. ' +
        'Pass a "YYYY-MM-DD" string, or the Date of 00:00 of the day in the display timezone (of the day after the last day for the end). ' +
        'See https://mui.com/x/react-scheduler/event-calendar/events/#all-day.',
    );
  }
  return toPlainDate(epochMs, timezone).toString();
}

/**
 * The number of days an all-day event covers, from the dates of its model.
 */
export function getAllDayDayCount(
  event: Pick<SchedulerProcessedEvent, 'modelInBuiltInFormat'>,
): number {
  const model = event.modelInBuiltInFormat;
  return (
    getDayNumber(BaseTemporal.PlainDate.from(model.end)) -
    getDayNumber(BaseTemporal.PlainDate.from(model.start))
  );
}

/**
 * The end of an occurrence from its start: an all-day occurrence ends at the start of the day
 * after its last day in the display timezone, a timed one keeps the duration of its event.
 */
export function getOccurrenceEnd({
  event,
  occurrenceStart,
  displayTimezone,
}: {
  event: SchedulerProcessedEvent;
  occurrenceStart: number;
  displayTimezone: string;
}): number {
  if (event.allDay) {
    return addDaysToDayStart(occurrenceStart, getAllDayDayCount(event), displayTimezone);
  }
  return occurrenceStart + event.end.epochMilliseconds - event.start.epochMilliseconds;
}

function checkWeekStartsOn(weekStartsOn: WeekStartsOn) {
  if (process.env.NODE_ENV !== 'production') {
    if (
      !Number.isInteger(weekStartsOn) ||
      (weekStartsOn as number) < 1 ||
      (weekStartsOn as number) > 7
    ) {
      // eslint-disable-next-line mui/no-guarded-throw
      throw new Error(
        `MUI X Scheduler: weekStartsOn must be an integer between 1 (Monday) and 7 (Sunday),` +
          ` but received ${weekStartsOn}.`,
      );
    }
  }
}

/**
 * The first day of the week of `plainDate`.
 */
export function getPlainDateWeekStart(
  plainDate: BaseTemporal.PlainDate,
  weekStartsOn: WeekStartsOn,
): BaseTemporal.PlainDate {
  checkWeekStartsOn(weekStartsOn);
  return plainDateFromDayNumber(getStartOfWeekDayNumber(getDayNumber(plainDate), weekStartsOn));
}

/**
 * Returns the week number of `plainDate`, with weeks starting on `weekInfo.firstDay`
 * (1 = Monday … 7 = Sunday).
 *
 * The first week of a year is the first one with at least `weekInfo.minimalDays` days in that
 * year. With weeks starting on Monday and 4 minimal days, the result is the ISO 8601 week number.
 */
export function getWeekNumber(
  plainDate: BaseTemporal.PlainDate,
  weekInfo: Pick<WeekInfo, 'firstDay' | 'minimalDays'>,
): number {
  const { firstDay: weekStartsOn, minimalDays } = weekInfo;
  const weekStartPlainDate = getPlainDateWeekStart(plainDate, weekStartsOn);
  // A week belongs to the year of its last `minimalDays` days, and the first week of a year holds
  // its `minimalDays`-th day.
  const year = weekStartPlainDate.add({ days: 7 - minimalDays }).year;
  const firstWeekStart = getStartOfWeekDayNumber(
    isoDateToDayNumber(year, 1, minimalDays),
    weekStartsOn,
  );
  return (getDayNumber(weekStartPlainDate) - firstWeekStart) / 7 + 1;
}
