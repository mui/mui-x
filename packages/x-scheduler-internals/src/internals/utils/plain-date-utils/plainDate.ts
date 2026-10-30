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
 * Checks if the given plain date is a weekend (Saturday or Sunday).
 */
export function isWeekendPlainDate(plainDate: BaseTemporal.PlainDate): boolean {
  // TODO: Read the weekend days of the locale from `Intl.Locale.prototype.getWeekInfo()`
  // (https://github.com/mui/mui-x/issues/23985).
  // ISO weekdays 6 and 7 are Saturday and Sunday.
  return plainDate.dayOfWeek >= 6;
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
