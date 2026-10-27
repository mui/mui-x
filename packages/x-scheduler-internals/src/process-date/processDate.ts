import type { SchedulerProcessedDate, TemporalSupportedObject } from '../models';
import type { Adapter } from '../use-adapter';
import { buildProcessedDate } from '../internals/utils/plain-date-utils/adapter';

/**
 * Creates a processed date object from a date object.
 */
export function processDate(
  date: TemporalSupportedObject,
  adapter: Adapter,
): SchedulerProcessedDate {
  return buildProcessedDate(date, adapter.getTime(date), adapter.getTimezone(date));
}
