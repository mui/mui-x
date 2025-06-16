import { SchedulerValidDate } from '../../primitives/models';
import { CalendarResourceId } from './resource';

export type EventVariant = 'regular' | 'compact' | 'allDay';

export type EventAction = 'edit' | 'delete';

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
   * The description of the event.
   */
  description?: string;
  /**
   * The start date and time of the event.
   */
  start: SchedulerValidDate;
  /**
   * The end date and time of the event.
   */
  end: SchedulerValidDate;
  /**
   * The id of the resource this event is associated with.
   */
  resource?: CalendarResourceId;
}

export type CalendarEventColor = 'primary' | 'mauve' | 'violet' | 'cyan' | 'jade' | 'red';
