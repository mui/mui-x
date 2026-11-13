import type { SchedulerProcessedDate } from '../models';
import { toPlainDateTime } from '../internals/utils/plain-date-utils/timeZone';

/**
 * Returns the processed date of an instant in `timezone`, read from the offsets of the timezone.
 */
export function createProcessedDate(epochMs: number, timezone: string): SchedulerProcessedDate {
  return { value: toPlainDateTime(epochMs, timezone), timestamp: epochMs };
}
