import { CalendarEventOccurrence, SchedulerValidDate } from '@mui/x-scheduler-headless/models';

export type TimelineEventRowProps = {
  start: SchedulerValidDate;
  end: SchedulerValidDate;
  occurrences: CalendarEventOccurrence[];
};
