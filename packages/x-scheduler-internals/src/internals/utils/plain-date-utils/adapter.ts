import type { TemporalTimezone } from '@base-ui/react/internals/temporal';
import type { SchedulerProcessedDate, TemporalSupportedObject } from '../../../models';
import type { Adapter } from '../../../use-adapter/useAdapter.types';
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

// Translates between the adapter's date objects and plain dates, so that code working on plain dates
// receives and returns the same values as the rest of the Scheduler.
// The adapter values are `Date` objects of instants: their getters read the timezone of the system,
// so their date and time are always read in an explicit timezone.

/**
 * Builds the plain date of an adapter value in `timezone`.
 */
export function buildTemporalPlainDate(
  adapter: Adapter,
  date: TemporalSupportedObject,
  timezone: TemporalTimezone,
): BaseTemporal.PlainDate {
  return toPlainDate(adapter.getTime(date), timezone);
}

/**
 * Creates the adapter value of the first instant of a plain date in `timezone`, the reverse of
 * `buildTemporalPlainDate()`. A day whose midnight a DST transition skips starts at the end of the
 * gap.
 */
export function createStartOfPlainDate(
  plainDate: BaseTemporal.PlainDate,
  timezone: TemporalTimezone,
): TemporalSupportedObject {
  return createAdapterDate(toEpochMs(plainDate, 0, timezone));
}

/**
 * Creates the adapter value of the last instant of a plain date in `timezone`, just before the next
 * day starts. When a DST transition repeats the last hour of the day, it's the later 23:59:59.999.
 */
export function createEndOfPlainDate(
  plainDate: BaseTemporal.PlainDate,
  timezone: TemporalTimezone,
): TemporalSupportedObject {
  const nextPlainDate = plainDate.add({ days: 1 });
  return createAdapterDate(toEpochMs(nextPlainDate, 0, timezone) - 1);
}

/**
 * Creates the adapter value of an instant: a `Date`.
 */
export function createAdapterDate(epochMs: number): TemporalSupportedObject {
  return new Date(epochMs);
}

// An ISO date (`yyyy-MM-dd`), or an ISO date followed by a time.
const ISO_DATE_REGEXP = /^\d{4}-\d{2}-\d{2}(?:T|$)/;

/**
 * Creates the adapter value of an ISO date or date-time without an offset, read as a wall-clock
 * time in `timezone`. The times a DST transition skips or repeats resolve like `localToEpochMs()`,
 * as the occurrences of recurring events do.
 * Returns `null` for other formats and for unknown timezones.
 */
export function createAdapterDateFromWallTime(
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
  return Number.isNaN(epochMs) ? null : createAdapterDate(epochMs);
}

/**
 * Snaps an all-day event's bounds to span their whole days in `timezone`; non-all-day bounds are
 * returned unchanged. The day ends on the later 23:59:59.999 when a DST transition repeats its last
 * hour, like the occurrences of recurring events, whatever the timezone of the system.
 */
export function normalizeAllDayBounds(
  adapter: Adapter,
  start: TemporalSupportedObject,
  end: TemporalSupportedObject,
  allDay: boolean | undefined,
  timezone: TemporalTimezone,
): { start: TemporalSupportedObject; end: TemporalSupportedObject } {
  if (!allDay) {
    return { start, end };
  }
  return {
    start: createAdapterDate(getStartOfDayMs(adapter.getTime(start), timezone)),
    end: createAdapterDate(getEndOfDayMs(adapter.getTime(end), timezone)),
  };
}

/**
 * Returns the processed date of `value`, the adapter value of the instant `epochMs` in `timezone`.
 * Reads the date and time from the offsets of the timezone instead of the getters of the adapter.
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
 * Returns the processed date of the adapter value of an instant in `timezone`.
 */
export function createProcessedDate(
  epochMs: number,
  timezone: TemporalTimezone,
): SchedulerProcessedDate {
  return buildProcessedDate(createAdapterDate(epochMs), epochMs, timezone);
}

/**
 * Moves a date to `plainDate` like `moveTimestampToPlainDate()`, in `timezone`.
 */
export function moveToPlainDate(
  adapter: Adapter,
  date: TemporalSupportedObject,
  plainDate: BaseTemporal.PlainDate,
  timezone: TemporalTimezone,
): TemporalSupportedObject {
  return createAdapterDate(moveTimestampToPlainDate(adapter.getTime(date), plainDate, timezone));
}

/**
 * Moves an adapter value by a duration of the calendar, keeping its time of day on the wall clock of
 * `timezone`. A time that a DST transition skips moves forward by the length of the gap, and a
 * repeated one resolves to its first instant, like `toEpochMs()`.
 */
export function addToAdapterDate(
  adapter: Adapter,
  date: TemporalSupportedObject,
  duration: PlainDateDuration,
  timezone: TemporalTimezone,
): TemporalSupportedObject {
  return moveToPlainDate(
    adapter,
    date,
    buildTemporalPlainDate(adapter, date, timezone).add(duration),
    timezone,
  );
}
