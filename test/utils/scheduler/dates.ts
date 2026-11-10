import type { TemporalTimezone } from '@base-ui/react/internals/temporal';
import {
  getEndOfDayMs,
  getPlainDateWeekStart,
  getStartOfDayMs,
  localToEpochMs,
  MS_PER_DAY,
  moveTimestampToPlainDate,
  toEpochMs,
  toLocalDayNumber,
  toLocalMs,
  toPlainDate,
} from '@mui/x-scheduler-internals/internals';
import type { PlainDateDuration } from '@mui/x-scheduler-internals/internals';

// Builds and moves the dates of the tests: plain `Date` objects, read with the timezone helpers of
// the Scheduler. The calendar operations work on the wall clock of a timezone, the timezone of the
// system by default.

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;

/**
 * The date of an ISO string: the instant of a string ending with `Z`, otherwise the wall-clock time
 * of the string in `timezone`, midnight for a date. A time a DST transition skips moves forward by
 * the length of the gap, and a repeated one resolves to its first instant.
 */
export function createDate(value: string, timezone: TemporalTimezone = 'default'): Date {
  if (value.endsWith('Z')) {
    return new Date(value);
  }
  // Read as UTC, the fields of the string are its wall-clock time. `Date.parse()` already reads an
  // ISO date as UTC.
  const wallClockMs = Date.parse(value.includes('T') ? `${value}Z` : value);
  return new Date(localToEpochMs(wallClockMs, timezone));
}

export function addMilliseconds(date: Date, amount: number): Date {
  return new Date(date.getTime() + amount);
}

export function addMinutes(date: Date, amount: number): Date {
  return addMilliseconds(date, amount * MINUTE_MS);
}

export function addHours(date: Date, amount: number): Date {
  return addMilliseconds(date, amount * HOUR_MS);
}

/**
 * Moves a date by a duration of the calendar, keeping its time of day on the wall clock of
 * `timezone`.
 */
function addToWallClock(date: Date, duration: PlainDateDuration, timezone: TemporalTimezone) {
  const epochMs = date.getTime();
  return new Date(
    moveTimestampToPlainDate(epochMs, toPlainDate(epochMs, timezone).add(duration), timezone),
  );
}

export function addDays(date: Date, amount: number, timezone: TemporalTimezone = 'default') {
  return addToWallClock(date, { days: amount }, timezone);
}

export function addWeeks(date: Date, amount: number, timezone: TemporalTimezone = 'default') {
  return addToWallClock(date, { weeks: amount }, timezone);
}

export function addMonths(date: Date, amount: number, timezone: TemporalTimezone = 'default') {
  return addToWallClock(date, { months: amount }, timezone);
}

export function addYears(date: Date, amount: number, timezone: TemporalTimezone = 'default') {
  return addToWallClock(date, { years: amount }, timezone);
}

/**
 * The first instant of the day of `date` in `timezone`.
 */
export function startOfDay(date: Date, timezone: TemporalTimezone = 'default'): Date {
  return new Date(getStartOfDayMs(date.getTime(), timezone));
}

/**
 * The last instant of the day of `date` in `timezone`.
 */
export function endOfDay(date: Date, timezone: TemporalTimezone = 'default'): Date {
  return new Date(getEndOfDayMs(date.getTime(), timezone));
}

/**
 * The first instant of the week of `date` in `timezone`, with weeks starting on Sunday.
 */
export function startOfWeek(date: Date, timezone: TemporalTimezone = 'default'): Date {
  const plainDate = toPlainDate(date.getTime(), timezone);
  return new Date(toEpochMs(getPlainDateWeekStart(plainDate, 7), 0, timezone));
}

/**
 * The last instant of the week of `date` in `timezone`, with weeks starting on Sunday.
 */
export function endOfWeek(date: Date, timezone: TemporalTimezone = 'default'): Date {
  const plainDate = toPlainDate(date.getTime(), timezone);
  return new Date(toEpochMs(getPlainDateWeekStart(plainDate, 7).add({ days: 7 }), 0, timezone) - 1);
}

/**
 * The first instant of the month of `date` in `timezone`.
 */
export function startOfMonth(date: Date, timezone: TemporalTimezone = 'default'): Date {
  const plainDate = toPlainDate(date.getTime(), timezone);
  return new Date(toEpochMs(plainDate.with({ day: 1 }), 0, timezone));
}

/**
 * Sets the hour of `date` on the wall clock of `timezone`, keeping its minutes and seconds.
 */
export function setHours(date: Date, hours: number, timezone: TemporalTimezone = 'default'): Date {
  const localMs = toLocalMs(date.getTime(), timezone);
  const dayStartMs = Math.floor(localMs / MS_PER_DAY) * MS_PER_DAY;
  return new Date(
    localToEpochMs(dayStartMs + hours * HOUR_MS + ((localMs - dayStartMs) % HOUR_MS), timezone),
  );
}

/**
 * The number of full days from `earlier` to `later` on the wall clock of `timezone`.
 */
export function differenceInDays(
  later: Date,
  earlier: Date,
  timezone: TemporalTimezone = 'default',
): number {
  return Math.trunc(
    (toLocalMs(later.getTime(), timezone) - toLocalMs(earlier.getTime(), timezone)) / MS_PER_DAY,
  );
}

/**
 * Whether two dates are on the same day in `timezone`.
 */
export function isSameDay(
  date: Date,
  other: Date,
  timezone: TemporalTimezone = 'default',
): boolean {
  return toLocalDayNumber(date.getTime(), timezone) === toLocalDayNumber(other.getTime(), timezone);
}
