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
   * The recurrence rule for the event.
   * If not defined, the event will have only one occurrence.
   */
  rrule?: RRuleSpec;
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

/** Two-letter weekday codes as defined by RFC 5545 (`BYDAY`). */
export type ByDayCode = 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU';

/**
 *  Ordinal prefix for BYDAY ordinals.
 *  Positive 1..5 for “Nth” weekday, negative for “last” (e.g. `-1` = last).
 */
type Ordinal = `${'' | '-'}${1 | 2 | 3 | 4 | 5}`;

/** A BYDAY entry: either a plain weekday (`'MO'`) or an ordinal + weekday (`'2TU'`, `'-1FR'`). */
export type ByDayValue = ByDayCode | `${Ordinal}${ByDayCode}`;

/**
 *  Minimal subset of RFC 5545 RRULE supported by the scheduler.
 */
export interface RRuleSpec {
  /** Base frequency of the rule. */
  freq: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  /** Step between occurrences at the given frequency. Defaults to 1. */
  interval?: number;
  /** BYDAY: MO..SU or ordinals like 4SA, -1MO */
  byDay?: ByDayValue[];
  /** BYMONTHDAY: list of calendar days in the month (1..31). */
  byMonthDay?: number[];
  /** BYMONTH: list of months (1..12). */
  byMonth?: number[];
  /** COUNT: total number of occurrences, mutually exclusive with `until`. */
  count?: number;
  /** UNTIL: inclusive end boundary, mutually exclusive with `count`. */
  until?: SchedulerValidDate;
}

/**
 *  A concrete occurrence derived from a `CalendarEvent` (recurring or single).
 */
export interface CalendarEventOccurrence extends CalendarEvent {
  /**
   * Unique key that can be passed to the React `key` property when looping through events.
   */
  key: string;
}

/** Extension of an occurrence with layout information for all-day rows. */
export interface CalendarEventOccurrenceWithPosition extends CalendarEventOccurrence {
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
