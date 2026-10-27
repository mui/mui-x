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
  // TODO: Read the weekend days from adapter.isWeekend() so they follow the locale
  // (https://github.com/mui/mui-x/issues/23985).
  // ISO weekdays 6 and 7 are Saturday and Sunday.
  return plainDate.dayOfWeek >= 6;
}

/**
 * The key of `plainDate` that the processed dates and the occurrences use: its ISO date, such as
 * `2026-03-07`, whatever the locale.
 */
export function getPlainDateKey(plainDate: PlainDate): string {
  return plainDate.toString();
}
