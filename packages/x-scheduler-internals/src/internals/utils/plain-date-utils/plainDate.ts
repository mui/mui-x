import { BaseTemporal } from '../base-temporal';
import { dayNumberToIsoDate, isoDateToDayNumber } from './dayNumber';

/**
 * The durations that `BaseTemporal.PlainDate#add()` takes.
 */
export type PlainDateDuration = Parameters<BaseTemporal.PlainDate['add']>[0];

const ISO_CALENDAR_ID = 'iso8601';

const MAX_CACHED_PLAIN_DATES = 10_000;
// The plain dates are immutable, so a day number keeps its plain date: the views build the same
// days on every render, and a lookup is faster than creating one. Emptied at 10,000 entries.
const plainDateLookup = new Map<number, BaseTemporal.PlainDate>();
// The day number of a plain date, read once from its fields. The entries go with their dates, so it
// needs no limit, holds the results of `add()` and `from()` too, and outlives `plainDateLookup`.
const dayNumberLookup = new WeakMap<BaseTemporal.PlainDate, number>();

/**
 * The plain date of a day number, in the ISO calendar.
 * Returns the same instance for a day number until the cache is emptied, so compare the results
 * with `equals()` or their day numbers, not with `===`.
 * Throws, like the `BaseTemporal.PlainDate` constructor, outside the days it supports: check the
 * day number against `LAST_SUPPORTED_DAY` first when it can leave them.
 */
export function plainDateFromDayNumber(dayNumber: number): BaseTemporal.PlainDate {
  let plainDate = plainDateLookup.get(dayNumber);
  if (plainDate === undefined) {
    if (plainDateLookup.size >= MAX_CACHED_PLAIN_DATES) {
      plainDateLookup.clear();
    }
    const isoDate = dayNumberToIsoDate(dayNumber);
    plainDate = new BaseTemporal.PlainDate(isoDate.year, isoDate.month, isoDate.day);
    plainDateLookup.set(dayNumber, plainDate);
    dayNumberLookup.set(plainDate, dayNumber);
  }
  return plainDate;
}

/**
 * The day number of `plainDate`: the number of days since January 1st, 1970.
 * It's read from the ISO fields of the date, so it only uses the public API of the plain dates.
 * Use it instead of the `dayNumber` field of the dates, which is internal to BaseTemporal.
 */
export function getDayNumber(plainDate: BaseTemporal.PlainDate): number {
  let dayNumber = dayNumberLookup.get(plainDate);
  if (dayNumber === undefined) {
    const isoPlainDate =
      plainDate.calendarId === ISO_CALENDAR_ID
        ? plainDate
        : plainDate.withCalendar(ISO_CALENDAR_ID);
    dayNumber = isoDateToDayNumber(isoPlainDate.year, isoPlainDate.month, isoPlainDate.day);
    dayNumberLookup.set(plainDate, dayNumber);
  }
  return dayNumber;
}

/**
 * Checks if the given plain date is on one of the ISO weekdays of `weekend`.
 */
export function isWeekendPlainDate(
  plainDate: BaseTemporal.PlainDate,
  weekend: readonly number[],
): boolean {
  return weekend.includes(plainDate.dayOfWeek);
}

const MAX_CACHED_KEYS = 10_000;
const plainDateKeys = new Map<number, string>();

/**
 * The key of `plainDate` that the processed dates and the occurrences use: its ISO date, such as
 * `2026-03-07`, whatever the locale.
 * Cached per day, since a lookup is faster than building the string. The cache ignores the
 * calendar, as all the plain dates of the Scheduler share one, the ISO calendar for now.
 */
export function getPlainDateKey(plainDate: BaseTemporal.PlainDate): string {
  const dayNumber = getDayNumber(plainDate);
  let key = plainDateKeys.get(dayNumber);
  if (key === undefined) {
    if (plainDateKeys.size >= MAX_CACHED_KEYS) {
      plainDateKeys.clear();
    }
    key = plainDate.toString();
    plainDateKeys.set(dayNumber, key);
  }
  return key;
}

const MAX_CACHED_PLAIN_TIMES = 10_000;

const plainTimeLookup = new Map<number, BaseTemporal.PlainTime>();

/**
 * The plain time of a wall-clock time, in milliseconds since midnight.
 * Returns the same instance for a time until the cache is emptied: most times are whole minutes.
 */
export function plainTimeFromMsInDay(msInDay: number): BaseTemporal.PlainTime {
  let plainTime = plainTimeLookup.get(msInDay);
  if (plainTime === undefined) {
    if (plainTimeLookup.size >= MAX_CACHED_PLAIN_TIMES) {
      plainTimeLookup.clear();
    }
    plainTime = new BaseTemporal.PlainTime(
      Math.floor(msInDay / 3_600_000),
      Math.floor(msInDay / 60_000) % 60,
      Math.floor(msInDay / 1000) % 60,
      msInDay % 1000,
    );
    plainTimeLookup.set(msInDay, plainTime);
  }
  return plainTime;
}

/**
 * The wall-clock time of a time or date-time, in milliseconds since midnight. The microseconds and
 * nanoseconds are dropped.
 */
export function getMsInDay(time: BaseTemporal.PlainTime | BaseTemporal.PlainDateTime): number {
  return ((time.hour * 60 + time.minute) * 60 + time.second) * 1000 + time.millisecond;
}

/**
 * The number of minutes since midnight of a time or date-time.
 */
export function getMinutesInDay(time: BaseTemporal.PlainTime | BaseTemporal.PlainDateTime): number {
  return time.hour * 60 + time.minute;
}
