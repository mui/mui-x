import {
  CalendarEventOccurrence,
  CalendarResourceId,
  SchedulerValidDate,
} from '@mui/x-scheduler-headless/models';

export type TimelineEventRowProps = {
  start: SchedulerValidDate;
  end: SchedulerValidDate;
  resourceId: CalendarResourceId | undefined;
  occurrences: CalendarEventOccurrence[];
};
