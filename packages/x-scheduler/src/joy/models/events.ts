import { SchedulerValidDate } from '../../primitives/utils/adapter/types';

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
   * The start date end time of the event.
   */
  start: SchedulerValidDate;
  /**
   * The end date and time of the event.
   */
  end: SchedulerValidDate;
}
