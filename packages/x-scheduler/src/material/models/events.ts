import { SchedulerValidDate } from '../../primitives/models';
import { CalendarResourceId } from './resource';

export type EventVariant = 'regular' | 'compact' | 'allDay' | 'invisible';

export interface CalendarEvent {
  /**
   * The unique identifier of the event.
   */
  id: CalendarEventId;
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

  /**
   * `true` if the event is an all-day event.
   */
  allDay?: boolean;
}

export interface CalendarEventWithPosition extends CalendarEvent {
  eventRowIndex: number;
}

export type CalendarEventId = string | number;

export type CalendarEventColor =
  | 'primary'
  | 'mauve'
  | 'violet'
  | 'cyan'
  | 'jade'
  | 'red'
  | 'lime'
  | 'orange'
  | 'yellow'
  | 'pink'
  | 'indigo'
  | 'blue';
