import {
  SchedulerEventOccurrence,
  SchedulerEvent,
  SchedulerProcessedEvent,
} from '@mui/x-scheduler-headless/models';
import { processEvent } from '@mui/x-scheduler-headless/process-event';
import { TemporalTimezone } from '@mui/x-scheduler-headless/base-ui-copy/types';
import { adapter } from './adapters';

export function createOccurrenceFromEvent(
  event: SchedulerEvent,
  timezone: TemporalTimezone,
  key: string = event.id.toString(),
): SchedulerEventOccurrence {
  return {
    ...processEvent(event, timezone, adapter),
    key,
  };
}

export function createProcessedEvent(
  event: SchedulerEvent,
  timezone: TemporalTimezone,
): SchedulerProcessedEvent {
  return processEvent(event, timezone, adapter);
}
