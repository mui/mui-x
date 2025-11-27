import { SchedulerProcessedDate, TemporalSupportedObject } from '../models';
import { Adapter } from '../use-adapter';
import { getDateKey } from '../utils/date-utils';

/**
 * Creates a CalendarProcessedDate object from a date object.
 */
export function processDate(
  date: TemporalSupportedObject,
  adapter: Adapter,
): SchedulerProcessedDate {
  return {
    value: date,
    key: getDateKey(date, adapter),
    timestamp: adapter.toJsDate(date).getTime(),
  };
}
