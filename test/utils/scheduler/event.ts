import {
  CalendarEventOccurrence,
  SchedulerEvent,
  SchedulerProcessedEvent,
} from '@mui/x-scheduler-headless/models';
import { processEvent } from '@mui/x-scheduler-headless/process-event';
import { adapter } from './adapters';

export function createOccurrenceFromEvent(
  event: SchedulerEvent,
  key: string = event.id.toString(),
): CalendarEventOccurrence {
  return {
    ...processEvent(event, adapter),
    key,
  };
}

export function createProcessedEvent(event: SchedulerEvent): SchedulerProcessedEvent {
  return processEvent(event, adapter);
}
