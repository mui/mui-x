import { CalendarProcessedDate, SchedulerValidDate } from '../models';
import { Adapter } from '../use-adapter';
import { getDateKey } from '../utils/event-utils';

/**
 * Creates a CalendarProcessedDate object from a date object.
 */
export function processDate(date: SchedulerValidDate, adapter: Adapter): CalendarProcessedDate {
  return {
    value: date,
    key: getDateKey(date, adapter),
  };
}
