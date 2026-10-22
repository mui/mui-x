import { createPlainDate } from '../base-temporal/PlainDate';
import type { PlainDate } from '../base-temporal/PlainDate';
import { ISO_CALENDAR_ID } from '../base-temporal/calendar';

// Unlike `PlainDate.add()` and `PlainDate.from()`, these helpers don't check the supported range:
// the grids show the days around its first and last days, like the day after December 31st, 9999.

/**
 * The plain date of a day number, in the ISO calendar.
 */
export function plainDateFromDayNumber(dayNumber: number): PlainDate {
  return createPlainDate(dayNumber, ISO_CALENDAR_ID);
}

/**
 * Moves a plain date by whole days.
 */
export function addDaysToPlainDate(plainDate: PlainDate, dayCount: number): PlainDate {
  return createPlainDate(plainDate.dayNumber + dayCount, plainDate.calendarId);
}

/**
 * Checks if the given plain date is a weekend (Saturday or Sunday).
 */
export function isWeekendPlainDate(plainDate: PlainDate): boolean {
  // ISO weekdays 6 and 7 are Saturday and Sunday.
  return plainDate.dayOfWeek >= 6;
}
