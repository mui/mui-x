import type { SchedulerProcessedDate, TemporalSupportedObject, TemporalTimezone } from '../models';
import { MS_PER_DAY } from '../internals/utils/plain-date-utils/dayNumber';
import {
  getPlainDateKey,
  plainDateFromDayNumber,
} from '../internals/utils/plain-date-utils/plainDate';
import { toLocalMs } from '../internals/utils/plain-date-utils/timeZone';

/**
 * Creates the processed date of a date, read in `timezone` from the offsets of the timezone instead
 * of the getters of the date.
 */
export function processDate(
  date: TemporalSupportedObject,
  timezone: TemporalTimezone,
): SchedulerProcessedDate {
  const epochMs = date.getTime();
  // The wall clock is read once, as this runs for each occurrence of the visible range.
  const localMs = toLocalMs(epochMs, timezone);
  const dayNumber = Math.floor(localMs / MS_PER_DAY);
  return {
    value: date,
    key: getPlainDateKey(plainDateFromDayNumber(dayNumber)),
    timestamp: epochMs,
    minutesInDay: Math.floor((localMs - dayNumber * MS_PER_DAY) / 60_000),
  };
}
