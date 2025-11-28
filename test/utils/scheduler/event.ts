import { SchedulerEventOccurrence, SchedulerEvent } from '@mui/x-scheduler-headless/models';
import { processEvent } from '@mui/x-scheduler-headless/process-event';
import { adapter } from './adapters';

export function createOccurrenceFromEvent(
  event: SchedulerEvent,
  key: string = event.id.toString(),
): SchedulerEventOccurrence {
  return {
    ...processEvent(event, adapter),
    key,
  };
}
