import type { SchedulerProcessedDay } from '@mui/x-scheduler-internals/models';
import { getPlainDateKey, toPlainDate } from '@mui/x-scheduler-internals/internals';

/**
 * The day of a view starting at `date`, as the day lists build it in `timezone`.
 */
export function processDay(date: Date, timezone: string = 'default'): SchedulerProcessedDay {
  const plainDate = toPlainDate(date.getTime(), timezone);
  return { plainDate, key: getPlainDateKey(plainDate), timestamp: date.getTime() };
}
