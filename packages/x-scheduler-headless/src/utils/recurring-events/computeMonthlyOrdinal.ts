import { Adapter, diffIn } from '../../use-adapter';
import { SchedulerValidDate } from '../../models';
import { getWeekDayCode, nthWeekdayOfMonth } from './internal-utils';

/**
 * Computes the ordinal for a MONTHLY BYDAY rule for a given date.
 * @returns {number} - The ordinal: -1 for last, otherwise 1..5.
 */
export function computeMonthlyOrdinal(adapter: Adapter, date: SchedulerValidDate): number {
  const monthStart = adapter.startOfMonth(date);
  const code = getWeekDayCode(adapter, date);

  // Is it the last same-weekday of the month? (-1)
  const lastSameWeekday = nthWeekdayOfMonth(adapter, monthStart, code, -1)!;
  if (adapter.isSameDay(adapter.startOfDay(date), lastSameWeekday)) {
    return -1;
  }

  // First same-weekday of the month (1..5)
  const firstSameWeekday = nthWeekdayOfMonth(adapter, monthStart, code, 1)!;
  const daysDiff = diffIn(adapter, adapter.startOfDay(date), firstSameWeekday, 'days');
  return Math.floor(daysDiff / 7) + 1;
}
