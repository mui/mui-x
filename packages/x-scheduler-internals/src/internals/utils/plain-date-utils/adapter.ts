import type { TemporalTimezone } from '@base-ui/react/internals/temporal';
import type { SchedulerProcessedDate, TemporalSupportedObject } from '../../../models';
import type { Adapter } from '../../../use-adapter/useAdapter.types';
import { getDateKey } from '../date-utils';
import type { PlainDate, PlainDateDuration } from '../base-temporal/PlainDate';
import { MS_PER_DAY } from '../base-temporal/iso';
import {
  getEndOfDayMs,
  getStartOfDayMs,
  localToEpochMs,
  toEpochMs,
  toPlainDateTime,
} from './timeZone';

// Translates between the adapter's date objects and plain dates, so that code working on plain dates
// receives and returns the same values as the rest of the Scheduler.

/**
 * Builds the plain date of an adapter value, in the timezone the value is labeled with.
 * Read from the offsets of the timezone, which is faster than the getters of the adapter and
 * returns the same date.
 */
export function buildTemporalPlainDate(adapter: Adapter, date: TemporalSupportedObject): PlainDate {
  return toPlainDateTime(adapter.getTime(date), adapter.getTimezone(date)).date;
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

const MAX_CACHED_KEYS_PER_ADAPTER = 10_000;
const dateKeysCache = new WeakMap<Adapter, Map<number, string>>();

/**
 * Returns the `getDateKey()` of any adapter value on `date`.
 * The key only depends on the date and the adapter's locale, so it's formatted once per day.
 */
export function getPlainDateKey(adapter: Adapter, date: PlainDate): string {
  let keys = dateKeysCache.get(adapter);
  if (keys === undefined) {
    keys = new Map();
    dateKeysCache.set(adapter, keys);
  }
  let key = keys.get(date.dayNumber);
  if (key === undefined) {
    if (keys.size >= MAX_CACHED_KEYS_PER_ADAPTER) {
      keys.clear();
    }
    // Labeled in UTC: a system timezone can skip the local midnight of a day, such as
    // December 30th, 2011 in Pacific/Apia.
    key = getDateKey(createAdapterDate(adapter, date.dayNumber * MS_PER_DAY, 'UTC'), adapter);
    keys.set(date.dayNumber, key);
  }
  return key;
}

/**
 * Returns the processed date of `value`, the adapter value of the instant `epochMs` in `timezone`.
 * Reads the date and time from the offsets of the timezone instead of the getters of the adapter.
 */
export function buildProcessedDate(
  adapter: Adapter,
  value: TemporalSupportedObject,
  epochMs: number,
  timezone: TemporalTimezone,
): SchedulerProcessedDate {
  const plainDateTime = toPlainDateTime(epochMs, timezone);
  return {
    value,
    key: getPlainDateKey(adapter, plainDateTime.date),
    timestamp: epochMs,
    minutesInDay: Math.floor(plainDateTime.msInDay / 60_000),
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
  return buildProcessedDate(
    adapter,
    createAdapterDate(adapter, epochMs, timezone),
    epochMs,
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
  const timezone = adapter.getTimezone(date);
  const plainDateTime = toPlainDateTime(adapter.getTime(date), timezone);
  return createAdapterDate(
    adapter,
    toEpochMs(plainDateTime.date.add(duration), plainDateTime.msInDay, timezone),
    timezone,
  );
}
