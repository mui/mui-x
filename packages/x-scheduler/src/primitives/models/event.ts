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
  rrule?: RRuleSpec;
  /**
   * `true` if the event is an all-day event.
   */
  allDay?: boolean;
}

// RRULE day codes
export type ByDayCode = 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU';

// Ordinals for BYDAY: 'MO' | 'WE' | '4SA' | '-1MO' (1..5, negatives for "last")
type Ordinal = `${'' | '-'}${1 | 2 | 3 | 4 | 5}`;
export type ByDayValue = ByDayCode | `${Ordinal}${ByDayCode}`;

// Minimal RRULE spec the scheduler needs
export interface RRuleSpec {
  freq: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  interval?: number;
  /** BYDAY: MO..SU or ordinals like 4SA, -1MO */
  byDay?: ByDayValue[];
  /** BYMONTHDAY: 1..31 */
  byMonthDay?: number[];
  /** BYMONTH: 1..12 */
  byMonth?: number[];
  /** COUNT */
  count?: number;
  /** UNTIL (inclusive) */
  until?: SchedulerValidDate;
}

export interface CalendarEventOccurence extends CalendarEvent {
  key: string;
}

export interface CalendarEventOccurenceWithPosition extends CalendarEventOccurence {
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
