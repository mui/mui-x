import type { TemporalTimezone } from '@base-ui/react/internals/temporal';
import type {
  SchedulerProcessedDay,
  TemporalSupportedObject,
} from '@mui/x-scheduler-internals/models';
import { processDate } from '@mui/x-scheduler-internals/process-date';
import { buildTemporalPlainDate } from '@mui/x-scheduler-internals/internals';

/**
 * The day of a view starting at `date`, as the day lists build it in `timezone`.
 */
export function processDay(
  date: TemporalSupportedObject,
  timezone: TemporalTimezone = 'default',
): SchedulerProcessedDay {
  return {
    ...processDate(date, timezone),
    plainDate: buildTemporalPlainDate(date, timezone),
  };
}
