import type { TemporalTimezone } from '@base-ui/react/internals/temporal';
import type { SchedulerProcessedDate, TemporalSupportedObject } from '../../../models';
import type { Adapter } from '../../../use-adapter/useAdapter.types';
import type { BaseTemporal } from '../base-temporal';
import type { PlainDateDuration } from '../base-temporal/PlainDate';
import { MS_PER_DAY } from '../base-temporal/iso';
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

/**
 * Returns the `getPlainDateKey()` of the day of `day`, in the timezone it's labeled with.
 */
export function getDateKey(day: TemporalSupportedObject, adapter: Adapter): string {
  return getPlainDateKey(buildTemporalPlainDate(adapter, day));
}

/**
 * Builds the plain date of an adapter value, in the timezone the value is labeled with.
 * Read from the offsets of the timezone, which is faster than the getters of the adapter and
 * returns the same date.
 */
export function buildTemporalPlainDate(
  adapter: Adapter,
  date: TemporalSupportedObject,
): BaseTemporal.PlainDate {
  return toPlainDate(adapter.getTime(date), adapter.getTimezone(date));
}

/**
 * Creates the adapter value of the first instant of a plain date in `timezone`, the reverse of
 * `buildTemporalPlainDate()`. A day whose midnight a DST transition skips starts at the end of the
 * gap.
 */
export function createStartOfPlainDate(
  adapter: Adapter,
  plainDate: BaseTemporal.PlainDate,
  timezone: TemporalTimezone,
): TemporalSupportedObject {
  return createAdapterDate(adapter, toEpochMs(plainDate, 0, timezone), timezone);
}

/**
 * Creates the adapter value of the last instant of a plain date in `timezone`, just before the next
 * day starts. When a DST transition repeats the last hour of the day, it's the later 23:59:59.999.
 */
export function createEndOfPlainDate(
  adapter: Adapter,
  plainDate: BaseTemporal.PlainDate,
  timezone: TemporalTimezone,
): TemporalSupportedObject {
  const nextPlainDate = plainDate.add({ days: 1 });
  return createAdapterDate(adapter, toEpochMs(nextPlainDate, 0, timezone) - 1, timezone);
}

const epochValues = new WeakMap<Adapter, TemporalSupportedObject>();

/**
 * Creates an adapter value for an instant, labeled with `timezone`.
 */
export function createAdapterDate(
  adapter: Adapter,
  epochMs: number,
  timezone: TemporalTimezone,
): TemporalSupportedObject {
  // Adding the milliseconds to the epoch is faster than formatting and parsing an ISO string.
  let epoch = epochValues.get(adapter);
  if (epoch === undefined) {
    epoch = adapter.date('1970-01-01T00:00:00Z', 'default');
    epochValues.set(adapter, epoch);
  }
  return adapter.setTimezone(adapter.addMilliseconds(epoch, epochMs), timezone);
}

// An ISO date (`yyyy-MM-dd`), or an ISO date followed by a time.
const ISO_DATE_REGEXP = /^\d{4}-\d{2}-\d{2}(?:T|$)/;

/**
 * Creates the adapter value of an ISO date or date-time without an offset, read as a wall-clock
 * time in `timezone`. `adapter.date()` reads it with `TZDate`, which resolves the times a DST
 * transition skips or repeats differently depending on the timezone of the system. This resolves
 * them like `localToEpochMs()`, as the occurrences of recurring events do.
 * Returns `null` for other formats and for unknown timezones.
 */
export function createAdapterDateFromWallTime(
  adapter: Adapter,
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
  return Number.isNaN(epochMs) ? null : createAdapterDate(adapter, epochMs, timezone);
}

/**
 * Snaps an all-day event's bounds to span the whole day; non-all-day bounds are returned unchanged.
 * The day ends on the later 23:59:59.999 when a DST transition repeats its last hour, like the
 * occurrences of recurring events, whatever the timezone of the system.
 */
export function normalizeAllDayBounds(
  adapter: Adapter,
  start: TemporalSupportedObject,
  end: TemporalSupportedObject,
  allDay: boolean | undefined,
): { start: TemporalSupportedObject; end: TemporalSupportedObject } {
  if (!allDay) {
    return { start, end };
  }
  // Created from their instants, as `adapter.addMilliseconds()` also copies its input.
  const startTimezone = adapter.getTimezone(start);
  const endTimezone = adapter.getTimezone(end);
  return {
    start: createAdapterDate(
      adapter,
      getStartOfDayMs(adapter.getTime(start), startTimezone),
      startTimezone,
    ),
    end: createAdapterDate(adapter, getEndOfDayMs(adapter.getTime(end), endTimezone), endTimezone),
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
  adapter: Adapter,
  epochMs: number,
  timezone: TemporalTimezone,
): SchedulerProcessedDate {
  return buildProcessedDate(createAdapterDate(adapter, epochMs, timezone), epochMs, timezone);
}

/**
 * Moves a date to `plainDate` like `moveTimestampToPlainDate()`, in the timezone of the date.
 */
export function moveToPlainDate(
  adapter: Adapter,
  date: TemporalSupportedObject,
  plainDate: BaseTemporal.PlainDate,
): TemporalSupportedObject {
  const timezone = adapter.getTimezone(date);
  return createAdapterDate(
    adapter,
    moveTimestampToPlainDate(adapter.getTime(date), plainDate, timezone),
    timezone,
  );
}

/**
 * Moves an adapter value by a duration of the calendar, keeping its time of day on the wall clock of
 * its timezone. A time that a DST transition skips moves forward by the length of the gap, and a
 * repeated one resolves to its first instant, like `toEpochMs()`.
 */
export function addToAdapterDate(
  adapter: Adapter,
  date: TemporalSupportedObject,
  duration: PlainDateDuration,
): TemporalSupportedObject {
  return moveToPlainDate(adapter, date, buildTemporalPlainDate(adapter, date).add(duration));
}
