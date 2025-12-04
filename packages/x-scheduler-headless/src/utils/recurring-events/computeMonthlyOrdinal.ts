import { Adapter } from '../../use-adapter';
import { TemporalSupportedObject } from '../../models';
import { getWeekDayCode, nthWeekdayOfMonth } from './internal-utils';

/**
 * Computes the ordinal for a MONTHLY BYDAY rule for a given date.
 * @returns {number} - The ordinal: -1 for last, otherwise 1..5.
 */
export function computeMonthlyOrdinal(adapter: Adapter, date: TemporalSupportedObject): number {
  const dayStart = adapter.startOfDay(date);
  const monthStart = adapter.startOfMonth(date);
  const code = getWeekDayCode(adapter, date);

  // Is it the last same-weekday of the month? (-1)
  const lastSameWeekday = nthWeekdayOfMonth(adapter, monthStart, code, -1)!;
  if (adapter.isSameDay(dayStart, lastSameWeekday)) {
    return -1;
  }

  // First same-weekday of the month (1..5)
  const firstSameWeekday = nthWeekdayOfMonth(adapter, monthStart, code, 1)!;
  const daysDiff = adapter.differenceInDays(dayStart, firstSameWeekday);
  return Math.floor(daysDiff / 7) + 1;
}
