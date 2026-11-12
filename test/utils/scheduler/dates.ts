import type { TemporalTimezone } from '@mui/x-scheduler-internals/models';
import {
  addToDate,
  createStartOfPlainDate,
  getEndOfDayMs,
  getPlainDateWeekStart,
  getStartOfDayMs,
  localToEpochMs,
  toLocalDayNumber,
  toPlainDate,
} from '@mui/x-scheduler-internals/internals';

// Builds and moves the dates of the tests: plain `Date` objects, read with the timezone helpers of
// the Scheduler. The calendar operations work on the wall clock of a timezone, the timezone of the
// system by default.

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;

// A string that ends with `Z`, or a date-time that ends with an offset, like the event dates the
// Scheduler reads as instants.
const INSTANT_REGEXP = /(?:Z|T.*[+-]\d{2}:?\d{2})$/i;

/**
 * The date of an ISO string: the instant of a string ending with `Z` or an offset, otherwise the
 * wall-clock time of the string in `timezone`, midnight for a date. A time a DST transition skips
 * moves forward by the length of the gap, and a repeated one resolves to its first instant.
 * Throws for a string that isn't a date.
 */
export function createDate(value: string, timezone: TemporalTimezone = 'default'): Date {
  let epochMs: number;
  if (INSTANT_REGEXP.test(value)) {
    epochMs = Date.parse(value);
  } else {
    // Read as UTC, the fields of the string are its wall-clock time. `Date.parse()` already reads
    // an ISO date as UTC.
    const wallClockMs = Date.parse(value.includes('T') ? `${value}Z` : value);
    epochMs = localToEpochMs(wallClockMs, timezone);
  }
  if (Number.isNaN(epochMs)) {
    throw new Error(`createDate: "${value}" is not an ISO date.`);
  }
  return new Date(epochMs);
}

function addMilliseconds(date: Date, amount: number): Date {
  return new Date(date.getTime() + amount);
}

export function addMinutes(date: Date, amount: number): Date {
  return addMilliseconds(date, amount * MINUTE_MS);
}

export function addHours(date: Date, amount: number): Date {
  return addMilliseconds(date, amount * HOUR_MS);
}

// The calendar arithmetic keeps the time of day on the wall clock of `timezone`, like the Scheduler.

export function addDays(date: Date, amount: number, timezone: TemporalTimezone = 'default') {
  return addToDate(date, { days: amount }, timezone);
}

export function addWeeks(date: Date, amount: number, timezone: TemporalTimezone = 'default') {
  return addToDate(date, { weeks: amount }, timezone);
}

export function addMonths(date: Date, amount: number, timezone: TemporalTimezone = 'default') {
  return addToDate(date, { months: amount }, timezone);
}

export function addYears(date: Date, amount: number, timezone: TemporalTimezone = 'default') {
  return addToDate(date, { years: amount }, timezone);
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
  return createStartOfPlainDate(getPlainDateWeekStart(plainDate, 7), timezone);
}

/**
 * The first instant of the month of `date` in `timezone`.
 */
export function startOfMonth(date: Date, timezone: TemporalTimezone = 'default'): Date {
  const plainDate = toPlainDate(date.getTime(), timezone);
  return createStartOfPlainDate(plainDate.with({ day: 1 }), timezone);
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
