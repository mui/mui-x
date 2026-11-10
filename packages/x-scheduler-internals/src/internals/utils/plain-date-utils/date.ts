import type { TemporalTimezone } from '@base-ui/react/internals/temporal';
import type { SchedulerProcessedDate, TemporalSupportedObject } from '../../../models';
import type { BaseTemporal } from '../base-temporal';
import { MS_PER_DAY } from './dayNumber';
import type { PlainDateDuration } from './plainDate';
import {
  getEndOfDayMs,
  getStartOfDayMs,
  localToEpochMs,
  moveTimestampToPlainDate,
  toEpochMs,
  toLocalMs,
  toPlainDate,
} from './timeZone';
import { getPlainDateKey, plainDateFromDayNumber } from './plainDate';

// Translates between the `Date` objects of the Scheduler and plain dates, so that code working on
// plain dates receives and returns the same values as the rest of the Scheduler.
// The `Date` objects are instants: their getters read the timezone of the system, so their date and
// time are always read in an explicit timezone.

/**
 * Builds the plain date of a date in `timezone`.
 */
export function buildTemporalPlainDate(
  date: TemporalSupportedObject,
  timezone: TemporalTimezone,
): BaseTemporal.PlainDate {
  return toPlainDate(date.getTime(), timezone);
}

/**
 * Creates the date of the first instant of a plain date in `timezone`, the reverse of
 * `buildTemporalPlainDate()`. A day whose midnight a DST transition skips starts at the end of the
 * gap.
 */
export function createStartOfPlainDate(
  plainDate: BaseTemporal.PlainDate,
  timezone: TemporalTimezone,
): TemporalSupportedObject {
  return new Date(toEpochMs(plainDate, 0, timezone));
}

/**
 * Creates the date of the last instant of a plain date in `timezone`, just before the next
 * day starts. When a DST transition repeats the last hour of the day, it's the later 23:59:59.999.
 */
export function createEndOfPlainDate(
  plainDate: BaseTemporal.PlainDate,
  timezone: TemporalTimezone,
): TemporalSupportedObject {
  const nextPlainDate = plainDate.add({ days: 1 });
  return new Date(toEpochMs(nextPlainDate, 0, timezone) - 1);
}

/**
 * Whether `value` is a date with a valid instant.
 */
export function isValidDate(value: TemporalSupportedObject | null | undefined): boolean {
  return value != null && !Number.isNaN(value.getTime());
}

// An ISO date (`yyyy-MM-dd`), or an ISO date followed by a time.
const ISO_DATE_REGEXP = /^\d{4}-\d{2}-\d{2}(?:T|$)/;

/**
 * Creates the date of an ISO date or date-time without an offset, read as a wall-clock time in
 * `timezone`. The times a DST transition skips or repeats resolve like `localToEpochMs()`,
 * as the occurrences of recurring events do.
 * Returns `null` for other formats and for unknown timezones.
 */
export function createDateFromWallTime(
  value: string,
  timezone: TemporalTimezone,
): TemporalSupportedObject | null {
  if (!ISO_DATE_REGEXP.test(value)) {
    return null;
  }
  // Read as UTC, the fields of the string are its wall-clock time, whatever the timezone of the
  // system. `Date.parse()` already reads an ISO date as UTC.
  const wallClockMs = Date.parse(value.length > 10 ? `${value}Z` : value);
  const epochMs = Number.isNaN(wallClockMs) ? NaN : localToEpochMs(wallClockMs, timezone);
  return Number.isNaN(epochMs) ? null : new Date(epochMs);
}

/**
 * Creates the date of a string that `createDateFromWallTime()` doesn't read, like a date-time with
 * an offset or a format other than ISO 8601. `Date.parse()` reads it, and its wall-clock time in the
 * timezone of the system, or its date for a date-only string, is then read in `timezone`.
 */
export function createDateFromString(value: string, timezone: TemporalTimezone): Date {
  const epochMs = Date.parse(value);
  // `Date.parse()` reads a date-only string as UTC midnight, and the date-times without an offset
  // in the timezone of the system.
  const isDateOnly = !value.includes('T');
  if (!isDateOnly && (timezone === 'default' || timezone === 'system')) {
    return new Date(epochMs);
  }
  const wallClockMs = isDateOnly ? epochMs : toLocalMs(epochMs, 'default');
  return new Date(localToEpochMs(wallClockMs, timezone));
}

/**
 * Snaps an all-day event's bounds to span their whole days in `timezone`; non-all-day bounds are
 * returned unchanged. The day ends on the later 23:59:59.999 when a DST transition repeats its last
 * hour, like the occurrences of recurring events, whatever the timezone of the system.
 */
export function normalizeAllDayBounds(
  start: TemporalSupportedObject,
  end: TemporalSupportedObject,
  allDay: boolean | undefined,
  timezone: TemporalTimezone,
): { start: TemporalSupportedObject; end: TemporalSupportedObject } {
  if (!allDay) {
    return { start, end };
  }
  return {
    start: new Date(getStartOfDayMs(start.getTime(), timezone)),
    end: new Date(getEndOfDayMs(end.getTime(), timezone)),
  };
}

/**
 * Returns the processed date of `value`, the date of the instant `epochMs` in `timezone`.
 * Reads the date and time from the offsets of the timezone instead of the getters of the date.
 */
export function buildProcessedDate(
  value: TemporalSupportedObject,
  epochMs: number,
  timezone: TemporalTimezone,
): SchedulerProcessedDate {
  // The wall clock is read once, as this runs for each occurrence of the visible range.
  const localMs = toLocalMs(epochMs, timezone);
  const dayNumber = Math.floor(localMs / MS_PER_DAY);
  return {
    value,
    key: getPlainDateKey(plainDateFromDayNumber(dayNumber)),
    timestamp: epochMs,
    minutesInDay: Math.floor((localMs - dayNumber * MS_PER_DAY) / 60_000),
  };
}

/**
 * Returns the processed date of an instant in `timezone`.
 */
export function createProcessedDate(
  epochMs: number,
  timezone: TemporalTimezone,
): SchedulerProcessedDate {
  return buildProcessedDate(new Date(epochMs), epochMs, timezone);
}

/**
 * Moves a date to `plainDate` like `moveTimestampToPlainDate()`, in `timezone`.
 */
export function moveToPlainDate(
  date: TemporalSupportedObject,
  plainDate: BaseTemporal.PlainDate,
  timezone: TemporalTimezone,
): TemporalSupportedObject {
  return new Date(moveTimestampToPlainDate(date.getTime(), plainDate, timezone));
}

/**
 * Moves a date by a duration of the calendar, keeping its time of day on the wall clock of
 * `timezone`. A time that a DST transition skips moves forward by the length of the gap, and a
 * repeated one resolves to its first instant, like `toEpochMs()`.
 */
export function addToDate(
  date: TemporalSupportedObject,
  duration: PlainDateDuration,
  timezone: TemporalTimezone,
): TemporalSupportedObject {
  return moveToPlainDate(date, buildTemporalPlainDate(date, timezone).add(duration), timezone);
}
