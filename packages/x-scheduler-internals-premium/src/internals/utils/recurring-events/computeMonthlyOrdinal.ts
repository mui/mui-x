import type { Adapter } from '@mui/x-scheduler-internals/use-adapter';
import type { TemporalSupportedObject } from '@mui/x-scheduler-internals/models';
import { buildTemporalPlainDate } from '@mui/x-scheduler-internals/internals';

/**
 * Computes the ordinal for a MONTHLY BYDAY rule for a given date.
 * @returns {number} - The ordinal: -1 for last, otherwise 1..5.
 */
export function computeMonthlyOrdinal(adapter: Adapter, date: TemporalSupportedObject): number {
  const plainDate = buildTemporalPlainDate(adapter, date);

  // Is it the last same-weekday of the month? (-1)
  if (plainDate.day + 7 > plainDate.daysInMonth) {
    return -1;
  }

  // Same weekdays are 7 days apart, so the 1st one falls on days 1..7, the 2nd on 8..14, etc.
  return Math.ceil(plainDate.day / 7);
}
