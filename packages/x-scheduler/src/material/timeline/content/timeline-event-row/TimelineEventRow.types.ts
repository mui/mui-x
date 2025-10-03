import { CalendarEventOccurrence, SchedulerValidDate } from '../../../../primitives/models';

export type TimelineEventRowProps = {
  start: SchedulerValidDate;
  end: SchedulerValidDate;
  occurrences: CalendarEventOccurrence[];
};
