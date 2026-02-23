import type { TemporalSupportedObject } from '../base-ui-copy/types';

export type RecurringEventFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
/**
 * The preset recurrence options available in the UI.
 * Only recurring events created from a preset can be edited with the "this-and-following" and "all" scopes.
 */
export type RecurringEventPresetKey = RecurringEventFrequency;

/**
 * The scope of a recurring event update.
 *
 * - `only-this`: Updates only the selected occurrence of the recurring event.
 * - `this-and-following`: Updates the selected occurrence and all following occurrences,
 *   but leaves the previous ones untouched.
 * - `all`: Updates all occurrences in the recurring series, past, present, and future.
 */
export type RecurringEventUpdateScope = 'this-and-following' | 'all' | 'only-this';

/**
 * Two-letter weekday codes expected by the `byDay` property of the recurrence rule,
 */
export type RecurringEventWeekDayCode = 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU';

/**
 * Ordinal prefix for the `byDay` property.
 * If positive, it represents the n-th occurrence of the weekday in the month (e.g: "2TU" means "the second Tuesday of the month").
 * If negative, it represents the n-th occurrence of the weekday counting backwards from the end of the month (e.g: "-1FR" means "the last Friday of the month").
 */
type RecurringEventByDayOrdinal = `${'' | '-'}${1 | 2 | 3 | 4 | 5}`;

/**
 * The valid values for the BYDAY property of the RRULE.
 * When used with a weekly frequency, it needs to be a weekday code (e.g: "TU", "FR").
 * When used with a monthly frequency, it needs to be an ordinal and a weekday (e.g: "2TU", "-1FR").
 */
export type RecurringEventByDayValue =
  | RecurringEventWeekDayCode
  | `${RecurringEventByDayOrdinal}${RecurringEventWeekDayCode}`;

/**
 * The recurrence rule to convert a single event into a series of occurrences.
 * This is a subset of the RFC 5545 RRULE specification that only contains the properties supported by the Event Calendar and the Event Timeline Premium components.
 * (read the full specification for more information: https://datatracker.ietf.org/doc/html/rfc5545).
 */
export interface SchedulerProcessedEventRecurrenceRule {
  /**
   * Base frequency of the rule.
   * Corresponds to the FREQ property of the string-based RRULE.
   */
  freq: RecurringEventFrequency;
  /**
   * Positive integer representing at which intervals the recurrence rule repeats.
   * For example, within a DAILY rule, a value of "8" means every eight days.
   * Corresponds to the INTERVAL property of the string-based RRULE.
   * @default 1
   */
  interval?: number;
  /**
   * A list of days (with or without ordinals) the event occurs on.
   * When used with a weekly frequency, it needs to be a weekday code (e.g: "TU", "FR").
   * When used with a monthly frequency, it needs to be an ordinal and a weekday (e.g: "2TU", "-1FR").
   * Corresponds to the BYDAY property of the string-based RRULE.
   */
  byDay?: RecurringEventByDayValue[];
  /**
   * List of days of the month (1..31).
   * Must not be specified when the frequency is set to WEEKLY.
   * Corresponds to the BYMONTHDAY property of the string-based RRULE.
   */
  byMonthDay?: number[];
  /**
   * List of months of the year (1..12).
   * Corresponds to the BYMONTH property of the string-based RRULE.
   */
  byMonth?: number[];
  /**
   * A date time value that bounds the recurrence rule in an inclusive manner.
   * Must not be specified when the count property is set.
   * Corresponds to the UNTIL property of the string-based RRULE.
   */
  until?: TemporalSupportedObject;
  /**
   * The number of occurrences at which to range-bound the recurrence.
   * Must not be specified when the until property is set.
   * Corresponds to the COUNT property of the string-based RRULE.
   */
  count?: number;
}

/**
 * User-facing recurrence rule type used in `SchedulerEvent`.
 * Same as `SchedulerProcessedEventRecurrenceRule` but with `until` as a `string`.
 */
export type SchedulerEventRecurrenceRule = Omit<SchedulerProcessedEventRecurrenceRule, 'until'> & {
  /**
   * A date time value that bounds the recurrence rule in an inclusive manner.
   * Same string semantics as `SchedulerEvent.start` / `end`.
   */
  until?: string;
};
