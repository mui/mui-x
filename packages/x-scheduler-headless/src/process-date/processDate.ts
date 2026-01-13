import { SchedulerProcessedDate, TemporalSupportedObject } from '../models';
import { Adapter } from '../use-adapter';
import { getDateKey } from '../utils/date-utils';

/**
 * Creates a processed date object from a date object.
 */
export function processDate(
  date: TemporalSupportedObject,
  adapter: Adapter,
): SchedulerProcessedDate {
  const hours = Number(adapter.formatByString(date, 'HH'));
  const minutes = Number(adapter.formatByString(date, 'mm'));

  return {
    value: date,
    key: getDateKey(date, adapter),
    timestamp: adapter.getTime(date),
    minutesInDay: hours * 60 + minutes,
  };
}
