import type { SchedulerProcessedDate, TemporalSupportedObject } from '../models';
import type { Adapter } from '../use-adapter';
import { getPlainDateKey } from '../internals/utils/plain-date-utils/adapter';
import { toPlainDateTime } from '../internals/utils/plain-date-utils/timeZone';

/**
 * Creates a processed date object from a date object.
 * Reads the date and time from the offsets of the timezone of the date, which is faster than the
 * getters and the formatting of the adapter and returns the same values.
 */
export function processDate(
  date: TemporalSupportedObject,
  adapter: Adapter,
): SchedulerProcessedDate {
  const timestamp = adapter.getTime(date);
  const plainDateTime = toPlainDateTime(timestamp, adapter.getTimezone(date));

  return {
    value: date,
    key: getPlainDateKey(adapter, plainDateTime.date),
    timestamp,
    minutesInDay: Math.floor(plainDateTime.msInDay / 60_000),
  };
}
