import type { TemporalTimezone } from '@base-ui/react/internals/temporal';
import type { TemporalSupportedObject } from '../../../models';
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
  return new Date(toEpochMs(plainDate, timezone));
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
  return new Date(toEpochMs(nextPlainDate, timezone) - 1);
}

// A string that ends with `Z`, or a date-time that ends with an offset, like
// `2025-01-01T09:00:00+02:00`. `Date.parse()` also reads a lowercase `t` or `z`.
const INSTANT_REGEXP = /(?:Z|T.*[+-]\d{2}:?\d{2})$/i;

/**
 * Whether an event date string is an instant: it ends with `Z` or with an offset.
 * Other strings are wall-clock times read in the data timezone.
 */
export function isInstantString(value: string): boolean {
  return INSTANT_REGEXP.test(value);
}

// An ISO date (`YYYY`, `YYYY-MM` or `YYYY-MM-DD`), alone or followed by a time.
const ISO_DATE_REGEXP = /^\d{4}(?:-\d{2}){0,2}(?:(T)|$)/i;

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
  const match = ISO_DATE_REGEXP.exec(value);
  if (match === null) {
    return null;
  }
  const hasTime = match[1] !== undefined;
  // `Date.parse()` reads an ISO date-time on the wall clock of the system, and resolves the times a
  // DST transition skips or repeats like `localToEpochMs()`, about 3 times faster.
  if (hasTime && (timezone === 'default' || timezone === 'system')) {
    return new Date(value);
  }
  // Read as UTC, the fields of the string are its wall-clock time, whatever the timezone of the
  // system. `Date.parse()` already reads an ISO date as UTC.
  const wallClockMs = Date.parse(hasTime ? `${value}Z` : value);
  const epochMs = Number.isNaN(wallClockMs) ? NaN : localToEpochMs(wallClockMs, timezone);
  return Number.isNaN(epochMs) ? null : new Date(epochMs);
}

/**
 * Creates the date of a string in a format other than ISO 8601, like `2025/01/01 09:00`.
 * `Date.parse()` reads it in the timezone of the system, and its wall-clock time there is then read
 * in `timezone`.
 */
export function createDateFromString(
  value: string,
  timezone: TemporalTimezone,
): TemporalSupportedObject {
  const epochMs = Date.parse(value);
  return new Date(
    Number.isNaN(epochMs) ? NaN : localToEpochMs(toLocalMs(epochMs, 'default'), timezone),
  );
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

export { createProcessedDate } from '../../../process-date/processDate';

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
