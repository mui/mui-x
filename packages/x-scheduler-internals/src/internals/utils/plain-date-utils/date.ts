import type { TemporalTimezone } from '@base-ui/react/internals/temporal';
import type { SchedulerProcessedDate, TemporalSupportedObject } from '../../../models';
import { processDate } from '../../../process-date/processDate';
import type { BaseTemporal } from '../base-temporal';
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

// Creates and reads the `Date` objects of the Scheduler. Their getters read the timezone of the
// system, so their date and time are always read in an explicit timezone.

/**
 * Creates the date of the first instant of a plain date in `timezone`, the reverse of
 * `toPlainDate()`. A day whose midnight a DST transition skips starts at the end of the
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
  if (Number.isNaN(epochMs)) {
    return new Date(NaN);
  }
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
 * Returns the processed date of an instant in `timezone`.
 */
export function createProcessedDate(
  epochMs: number,
  timezone: TemporalTimezone,
): SchedulerProcessedDate {
  return processDate(new Date(epochMs), timezone);
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
  const epochMs = date.getTime();
  return new Date(
    moveTimestampToPlainDate(epochMs, toPlainDate(epochMs, timezone).add(duration), timezone),
  );
}
