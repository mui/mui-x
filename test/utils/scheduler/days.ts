import type {
  SchedulerProcessedDay,
  TemporalSupportedObject,
} from '@mui/x-scheduler-internals/models';
import type { Adapter } from '@mui/x-scheduler-internals/use-adapter';
import { processDate } from '@mui/x-scheduler-internals/process-date';
import { buildTemporalPlainDate } from '@mui/x-scheduler-internals/internals';

/**
 * The day of a view starting at `date`, as the day lists build it.
 */
export function processDay(date: TemporalSupportedObject, adapter: Adapter): SchedulerProcessedDay {
  return { ...processDate(date, adapter), plainDate: buildTemporalPlainDate(adapter, date) };
}
