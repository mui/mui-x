import type { TemporalTimezone } from '@base-ui/react/internals/temporal';
import { ISO_CALENDAR_ID } from '../base-temporal/calendar';
import { MS_PER_DAY, toDayNumber } from '../base-temporal/iso';
import { createPlainDate } from '../base-temporal/PlainDate';
import type { PlainDate } from '../base-temporal/PlainDate';

interface TimezoneOffsets {
  format: (epochMs: number) => string;
  /**
   * The offset of each UTC day without a transition, keyed by day number.
   */
  days: Map<number, number>;
}

const MAX_CACHED_DAYS_PER_TIMEZONE = 20_000;
const timezoneOffsets = new Map<string, TimezoneOffsets | null>();
const OFFSET_REGEXP = /^([+-])(\d{2}):?(\d{2})?(?::?(\d{2}))?$/;

function parseOffset(offset: string): number {
  const match = OFFSET_REGEXP.exec(offset);
  return match
    ? (match[1] === '-' ? -1 : 1) *
        (Number(match[2]) * 3_600_000 +
          Number(match[3] ?? 0) * 60_000 +
          Number(match[4] ?? 0) * 1000)
    : NaN;
}

function getTimezoneOffsets(timezone: string): TimezoneOffsets | null {
  let offsets = timezoneOffsets.get(timezone);
  if (offsets === undefined) {
    try {
      // `longOffset` formats the offset like `GMT+05:30`, or `GMT` when it is zero.
      const { format } = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        timeZoneName: 'longOffset',
      });
      offsets = { format, days: new Map() };
    } catch {
      offsets = null;
    }
    timezoneOffsets.set(timezone, offsets);
  }
  return offsets;
}

function readOffset(format: TimezoneOffsets['format'], epochMs: number): number {
  const offset = format(epochMs).split('GMT')[1];
  return offset ? parseOffset(offset) : 0;
}

function getSystemTimezoneOffsetMs(epochMs: number): number {
  const date = new Date(epochMs);
  // `getTimezoneOffset()` drops the seconds of the local mean time offsets used before standard
  // time, such as +00:09:21 in Paris until 1911. These seconds also shift the local seconds.
  if (date.getSeconds() === date.getUTCSeconds()) {
    return -date.getTimezoneOffset() * 60_000;
  }
  const localMs =
    toDayNumber(date.getFullYear(), date.getMonth() + 1, date.getDate()) * MS_PER_DAY +
    ((date.getHours() * 60 + date.getMinutes()) * 60 + date.getSeconds()) * 1000 +
    date.getMilliseconds();
  return localMs - epochMs;
}

/**
 * The offset of `timezone` from UTC at an instant, in milliseconds.
 * `'default'` and `'system'` read the timezone of the system, like the adapter.
 */
export function getTimezoneOffsetMs(timezone: TemporalTimezone, epochMs: number): number {
  if (timezone === 'default' || timezone === 'system') {
    return getSystemTimezoneOffsetMs(epochMs);
  }
  if (timezone === 'UTC') {
    return 0;
  }
  const offsets = getTimezoneOffsets(timezone);
  if (offsets === null) {
    // Engines without fixed-offset support in Intl, such as `+02:00`.
    return parseOffset(timezone);
  }

  // Formatting with Intl is slow, and offsets only change at the few transitions of a year.
  // A UTC day that starts and ends with the same offset keeps it throughout, as no timezone
  // has two transitions in a day that cancel out.
  const day = Math.floor(epochMs / MS_PER_DAY);
  const cached = offsets.days.get(day);
  if (cached !== undefined) {
    return cached;
  }
  const offsetAtDayStart = readOffset(offsets.format, day * MS_PER_DAY);
  if (offsetAtDayStart !== readOffset(offsets.format, (day + 1) * MS_PER_DAY - 1)) {
    return readOffset(offsets.format, epochMs);
  }
  if (offsets.days.size >= MAX_CACHED_DAYS_PER_TIMEZONE) {
    offsets.days.clear();
  }
  offsets.days.set(day, offsetAtDayStart);
  return offsetAtDayStart;
}

/**
 * The offset the adapter uses for `timezone` at an instant, in milliseconds.
 * `TZDate` reads the offsets between -01:00 and 00:00 as positive, such as the -00:44:30 of
 * Africa/Monrovia until 1972. Plain dates follow it to match the adapter values of the Scheduler.
 */
function getAdapterOffsetMs(timezone: TemporalTimezone, epochMs: number): number {
  const offsetMs = getTimezoneOffsetMs(timezone, epochMs);
  return offsetMs < 0 && offsetMs > -3_600_000 && timezone !== 'default' && timezone !== 'system'
    ? -offsetMs
    : offsetMs;
}

/**
 * The wall-clock time of an instant in `timezone`, in milliseconds since 1970-01-01T00:00 of the
 * wall clock.
 */
export function toLocalMs(epochMs: number, timezone: TemporalTimezone): number {
  return epochMs + getAdapterOffsetMs(timezone, epochMs);
}

/**
 * The date of an instant in `timezone`.
 */
export function toPlainDate(epochMs: number, timezone: TemporalTimezone): PlainDate {
  return createPlainDate(toLocalDayNumber(epochMs, timezone), ISO_CALENDAR_ID);
}

/**
 * The wall-clock time of an instant in `timezone`, in milliseconds since midnight.
 */
export function toMsInDay(epochMs: number, timezone: TemporalTimezone): number {
  const localMs = toLocalMs(epochMs, timezone);
  return localMs - Math.floor(localMs / MS_PER_DAY) * MS_PER_DAY;
}

/**
 * The instant of a wall-clock time in `timezone`, given in milliseconds since 1970-01-01T00:00 of
 * the wall clock.
 *
 * Resolves the wall-clock times a DST transition skips or repeats like RFC 5545 §3.3.5, whatever
 * the timezone of the system: a skipped time moves forward by the length of the gap, and a
 * repeated time resolves to its first instant, like the `'compatible'` disambiguation of Temporal.
 */
export function localToEpochMs(localMs: number, timezone: TemporalTimezone): number {
  // Offsets are below a day, so the instant lies between these two.
  const offsetBefore = getAdapterOffsetMs(timezone, localMs - MS_PER_DAY);
  const offsetAfter = getAdapterOffsetMs(timezone, localMs + MS_PER_DAY);
  if (offsetBefore === offsetAfter) {
    return localMs - offsetBefore;
  }

  // A transition happens around this wall-clock time.
  const instantBefore = localMs - offsetBefore;
  const instantAfter = localMs - offsetAfter;
  const isValidBefore = getAdapterOffsetMs(timezone, instantBefore) === offsetBefore;
  const isValidAfter = getAdapterOffsetMs(timezone, instantAfter) === offsetAfter;
  if (isValidBefore && isValidAfter) {
    // Repeated time: both instants show it.
    return Math.min(instantBefore, instantAfter);
  }
  if (isValidAfter) {
    return instantAfter;
  }
  // Valid with the earlier offset only, or skipped time, which the earlier offset moves forward.
  return instantBefore;
}

/**
 * The instant of a date and wall-clock time in `timezone`, resolved like `localToEpochMs()`.
 */
export function toEpochMs(date: PlainDate, msInDay: number, timezone: TemporalTimezone): number {
  return localToEpochMs(date.dayNumber * MS_PER_DAY + msInDay, timezone);
}

/**
 * Moves an instant to `plainDate`, keeping its time of day on the wall clock of `timezone`. The
 * times a DST transition skips or repeats resolve like `toEpochMs()`.
 */
export function moveTimestampToPlainDate(
  epochMs: number,
  plainDate: PlainDate,
  timezone: TemporalTimezone,
): number {
  return toEpochMs(plainDate, toMsInDay(epochMs, timezone), timezone);
}

/**
 * Adds days to an instant on the wall clock of `timezone`, keeping its time of day. The times a
 * DST transition skips or repeats resolve like `localToEpochMs()`. Returns the instant unchanged
 * for 0 days, even in the second occurrence of a repeated time.
 */
export function addDaysOnWallClock(
  epochMs: number,
  dayCount: number,
  timezone: TemporalTimezone,
): number {
  if (dayCount === 0) {
    return epochMs;
  }
  return localToEpochMs(toLocalMs(epochMs, timezone) + dayCount * MS_PER_DAY, timezone);
}

/**
 * Moves an instant back by the minutes past the last multiple of `stepMinutes` in its hour, on the
 * wall clock of `timezone`. Returns a non-finite instant unchanged, like the one of a surface
 * without a size.
 */
export function floorToWallClockMinutes(
  epochMs: number,
  stepMinutes: number,
  timezone: TemporalTimezone,
): number {
  if (!Number.isFinite(epochMs)) {
    return epochMs;
  }
  const localMinutes = Math.floor(toLocalMs(epochMs, timezone) / 60_000);
  const minutesInHour = localMinutes - Math.floor(localMinutes / 60) * 60;
  return epochMs - (minutesInHour % stepMinutes) * 60_000;
}

/**
 * The day number of the date of an instant in `timezone`. For the loops that compare many dates, a
 * day number is cheaper than `toPlainDate()`.
 */
export function toLocalDayNumber(epochMs: number, timezone: TemporalTimezone): number {
  return Math.floor(toLocalMs(epochMs, timezone) / MS_PER_DAY);
}

/**
 * The first instant of the day of an instant in `timezone`. A day whose midnight a DST transition
 * skips starts at the end of the gap.
 */
export function getStartOfDayMs(epochMs: number, timezone: TemporalTimezone): number {
  const dayNumber = Math.floor(toLocalMs(epochMs, timezone) / MS_PER_DAY);
  return localToEpochMs(dayNumber * MS_PER_DAY, timezone);
}

/**
 * The last instant of the day of an instant in `timezone`, just before the next day starts.
 * When a DST transition repeats the last hour of the day, it's the later 23:59:59.999.
 */
export function getEndOfDayMs(epochMs: number, timezone: TemporalTimezone): number {
  const dayNumber = Math.floor(toLocalMs(epochMs, timezone) / MS_PER_DAY);
  return localToEpochMs((dayNumber + 1) * MS_PER_DAY, timezone) - 1;
}

/**
 * The number of full days from `earlierMs` to `laterMs` on the wall clock of `timezone`, like the
 * adapter's `differenceInDays()`: the days between the two dates, minus one when the time of
 * `laterMs` is before the time of `earlierMs`. Negative when `laterMs` is before `earlierMs`.
 */
export function differenceInDays(
  laterMs: number,
  earlierMs: number,
  timezone: TemporalTimezone,
): number {
  // A wall-clock day always lasts 24 hours, whatever the DST transitions.
  return (
    Math.trunc((toLocalMs(laterMs, timezone) - toLocalMs(earlierMs, timezone)) / MS_PER_DAY) || 0
  );
}

/**
 * Returns the day numbers of the days `timezone` skips from `from` (inclusive) to `to` (exclusive),
 * like December 30th, 2011, which Pacific/Apia skipped when it moved across the date line.
 */
export function getSkippedDays(
  from: PlainDate,
  to: PlainDate,
  timezone: TemporalTimezone,
): Set<number> {
  const skippedDays = new Set<number>();
  const getStartMs = (dayNumber: number) => localToEpochMs(dayNumber * MS_PER_DAY, timezone);

  // A skipped day makes the days of a period last a day longer than the time elapsed between their
  // starts, when DST transitions change it by hours. The periods are a month long, as a timezone
  // never skipped and repeated a day within a month, which would cancel out.
  let periodStartMs = getStartMs(from.dayNumber);
  for (let start = from.dayNumber; start < to.dayNumber; start += 31) {
    const end = Math.min(start + 31, to.dayNumber);
    const periodEndMs = getStartMs(end);
    if ((end - start) * MS_PER_DAY - (periodEndMs - periodStartMs) >= MS_PER_DAY / 2) {
      for (let dayNumber = start; dayNumber < end; dayNumber += 1) {
        // The start of a skipped day resolves to an instant of the next day.
        if (toLocalMs(getStartMs(dayNumber), timezone) >= (dayNumber + 1) * MS_PER_DAY) {
          skippedDays.add(dayNumber);
        }
      }
    }
    periodStartMs = periodEndMs;
  }
  return skippedDays;
}
