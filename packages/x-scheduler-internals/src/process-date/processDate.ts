import type { TemporalTimezone } from '@base-ui/react/internals/temporal';
import type { SchedulerProcessedDate, TemporalSupportedObject } from '../models';
import { buildProcessedDate } from '../internals/utils/plain-date-utils/date';

/**
 * Creates the processed date of a date object, read in `timezone`.
 */
export function processDate(
  date: TemporalSupportedObject,
  timezone: TemporalTimezone,
): SchedulerProcessedDate {
  return buildProcessedDate(date, date.getTime(), timezone);
}
