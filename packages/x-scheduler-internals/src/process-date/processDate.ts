import type { TemporalTimezone } from '@base-ui/react/internals/temporal';
import type { SchedulerProcessedDate, TemporalSupportedObject } from '../models';
import type { Adapter } from '../use-adapter';
import { buildProcessedDate } from '../internals/utils/plain-date-utils/adapter';

/**
 * Creates the processed date of a date object, read in `timezone`.
 */
export function processDate(
  date: TemporalSupportedObject,
  adapter: Adapter,
  timezone: TemporalTimezone,
): SchedulerProcessedDate {
  return buildProcessedDate(date, adapter.getTime(date), timezone);
}
