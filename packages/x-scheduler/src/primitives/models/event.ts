import type { SchedulerValidDate } from './date';
import type { CalendarResourceId } from './resource';

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
   * Whether the event is an all-day event.
   */
  allDay?: boolean;
  /**
   * Whether the event is read-only.
   * Readonly events cannot be modified using UI features such as popover editing or drag and drop.
   */
  readOnly?: boolean;
}

export interface CalendarEventWithPosition extends CalendarEvent {
  eventRowIndex?: number;
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
