import {
  SchedulerEventOccurrence,
  SchedulerResourceId,
  SchedulerValidDate,
} from '@mui/x-scheduler-headless/models';

export type TimelineEventRowProps = {
  start: SchedulerValidDate;
  end: SchedulerValidDate;
  resourceId: SchedulerResourceId | null;
  occurrences: SchedulerEventOccurrence[];
};
