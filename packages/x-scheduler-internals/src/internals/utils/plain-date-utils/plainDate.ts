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
  // ISO weekdays 6 and 7 are Saturday and Sunday.
  return plainDate.dayOfWeek >= 6;
}
