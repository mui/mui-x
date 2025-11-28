import { SchedulerEventOccurrence, SchedulerEvent } from '@mui/x-scheduler-headless/models';
import { processEvent } from '@mui/x-scheduler-headless/process-event';
import { TemporalTimezone } from '@mui/x-scheduler-headless/base-ui-copy/types';
import { adapter } from './adapters';

export function createOccurrenceFromEvent(
  event: SchedulerEvent,
  uiTimezone: TemporalTimezone,
  key: string = event.id.toString(),
): SchedulerEventOccurrence {
  return {
    ...processEvent(event, uiTimezone, adapter),
    key,
  };
}
