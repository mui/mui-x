import { createPlainDate } from '../base-temporal/PlainDate';
import type { PlainDate } from '../base-temporal/PlainDate';
import { ISO_CALENDAR_ID } from '../base-temporal/calendar';

/**
 * The plain date of a day number, in the ISO calendar.
 */
export function plainDateFromDayNumber(dayNumber: number): PlainDate {
  return createPlainDate(dayNumber, ISO_CALENDAR_ID);
}

/**
 * Checks if the given plain date is a weekend (Saturday or Sunday).
 */
export function isWeekendPlainDate(plainDate: PlainDate): boolean {
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
export function getPlainDateKey(plainDate: PlainDate): string {
  let key = plainDateKeys.get(plainDate.dayNumber);
  if (key === undefined) {
    if (plainDateKeys.size >= MAX_CACHED_KEYS) {
      plainDateKeys.clear();
    }
    key = plainDate.toString();
    plainDateKeys.set(plainDate.dayNumber, key);
  }
  return key;
}
