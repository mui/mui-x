import {
  SchedulerEventOccurrence,
  SchedulerResourceId,
  TemporalSupportedObject,
} from '@mui/x-scheduler-headless/models';

export type TimelineEventRowProps = {
  start: TemporalSupportedObject;
  end: TemporalSupportedObject;
  resourceId: SchedulerResourceId | null;
  occurrences: SchedulerEventOccurrence[];
};
