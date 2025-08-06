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
   * The recurrence rule for the event, if it is a recurring event.
   */
  recurrenceRule?: RecurrenceRule;
}

export interface RecurrenceRule {
  /**
   * The unit of recurrence.
   */
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  /**
   * Repeat every X units.
   */
  interval: number;
  /**
   * Days of the week (0 = Sunday, 6 = Saturday).
   * Only used when frequency is 'weekly'.
   */
  daysOfWeek?: number[];
  /**
   * Monthly recurrence rule.
   * Only used when frequency is 'monthly'.
   */
  monthly?:
    | {
        /**
         * Repeats on the same day of the month (e.g. 28th).
         */
        mode: 'onDate';
        day: number;
      }
    | {
        /**
         * Repeats on the Nth weekday (e.g. 4th Saturday).
         */
        mode: 'onWeekday';
        weekIndex: number;
        weekday: number;
      }
    | {
        /**
         * Repeats on the last weekday of the month (e.g. last Saturday).
         */
        mode: 'onLastWeekday';
        weekday: number;
      };
  /**
   * End condition for the recurrence.
   */
  end:
    | {
        /**
         * Never ends.
         */
        type: 'never';
      }
    | {
        /**
         * Ends after a number of occurrences.
         */
        type: 'after';
        count: number;
      }
    | {
        /**
         * Ends on a specific date.
         */
        type: 'until';
        date: SchedulerValidDate;
      };
}

export type CalendarEventId = string | number;

// TODO: Try to keep this property on the Material UI side
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
