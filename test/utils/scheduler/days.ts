import type { SchedulerProcessedDay } from '@mui/x-scheduler-internals/models';
import { processDate } from '@mui/x-scheduler-internals/process-date';
import { toPlainDate } from '@mui/x-scheduler-internals/internals';

/**
 * The day of a view starting at `date`, as the day lists build it in `timezone`.
 */
export function processDay(date: Date, timezone: string = 'default'): SchedulerProcessedDay {
  return {
    ...processDate(date, timezone),
    plainDate: toPlainDate(date.getTime(), timezone),
  };
}
