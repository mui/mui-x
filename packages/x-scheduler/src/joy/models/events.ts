import { SchedulerValidDate } from '../../primitives/utils/adapter/types';

export type EventVariant = 'regular' | 'compact' | 'allDay';

export interface CalendarEvent {
  /**
   * The unique identifier of the event.
   */
  id: string;
  /**
   * The title of the event.
   */
  title: string;
  /**
   * The start date and time of the event.
   */
  start: SchedulerValidDate;
  /**
   * The end date and time of the event.
   */
  end: SchedulerValidDate;
}
