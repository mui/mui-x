import { CalendarEventOccurrence, SchedulerValidDate } from '../../../../primitives';

export type TimelineEventRowProps = {
  start: SchedulerValidDate;
  end: SchedulerValidDate;
  occurrences: CalendarEventOccurrence[];
};
