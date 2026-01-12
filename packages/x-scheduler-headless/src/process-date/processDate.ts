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
  const value = date;

  const hours = Number(adapter.formatByString(value as Date, 'HH'));
  const minutes = Number(adapter.formatByString(value as Date, 'mm'));

  return {
    value,
    key: getDateKey(value, adapter),
    timestamp: adapter.getTime(value as Date),
    minutesInDay: hours * 60 + minutes,
  };
}
