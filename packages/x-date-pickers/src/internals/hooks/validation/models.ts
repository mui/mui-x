import { TimeView } from '../../models/views';

interface FutureAndPastValidationProps {
  /**
   * If `true` disable values before the current date for date components, time for time components and both for date time components.
   * @default false
   */
  disablePast?: boolean;
  /**
   * If `true` disable values after the current date for date components, time for time components and both for date time components.
   * @default false
   */
  disableFuture?: boolean;
}

/**
 * Validation props common to all the time views.
 * All these props have a default value when used inside a field / picker / clock.
 */
export interface BaseTimeValidationProps extends FutureAndPastValidationProps {}

/**
 * Props used to validate a time value.
 */
export interface TimeValidationProps<TDate> {
  /**
   * Minimal selectable time.
   * The date part of the object will be ignored unless `props.disableIgnoringDatePartForTimeValidation === true`.
   */
  minTime?: TDate;
  /**
   * Maximal selectable time.
   * The date part of the object will be ignored unless `props.disableIgnoringDatePartForTimeValidation === true`.
   */
  maxTime?: TDate;
  /**
   * Step over minutes.
   * @default 1
   */
  minutesStep?: number;
  /**
   * Disable specific time.
   * @param {number} timeValue The value to check.
   * @param {TimeView} view The clock type of the timeValue.
   * @returns {boolean} If `true` the time will be disabled.
   */
  shouldDisableTime?: (timeValue: number, view: TimeView) => boolean;
  /**
   * Do not ignore date part when validating min/max time.
   * @default false
   */
  disableIgnoringDatePartForTimeValidation?: boolean;
}

/**
 * Validation props common to all the date views.
 * All these props have a default value when used inside a field / picker / calendar.
 */
export interface BaseDateValidationProps<TDate> extends FutureAndPastValidationProps {
  /**
   * Maximal selectable date.
   */
  maxDate?: TDate;
  /**
   * Minimal selectable date.
   */
  minDate?: TDate;
}

/**
 * Props used to validate a date value (validates day + month + year).
 */
export interface DayValidationProps<TDate> {
  /**
   * Disable specific date.
   * @template TDate
   * @param {TDate} day The date to test.
   * @returns {boolean} If `true` the date will be disabled.
   */
  shouldDisableDate?: (day: TDate) => boolean;
}

/**
 * Props used to validate a month value
 */
export interface MonthValidationProps<TDate> {
  /**
   * Disable specific month.
   * @template TDate
   * @param {TDate} month The month to test.
   * @returns {boolean} If `true` the month will be disabled.
   */
  shouldDisableMonth?: (month: TDate) => boolean;
}

/**
 * Props used to validate a year value
 */
export interface YearValidationProps<TDate> {
  /**
   * Disable specific year.
   * @template TDate
   * @param {TDate} year The year to test.
   * @returns {boolean} If `true` the year will be disabled.
   */
  shouldDisableYear?: (year: TDate) => boolean;
}

/**
 * Common validation error types applicable to both date and time validation
 */
export type CommonDateTimeValidationError = 'invalidDate' | 'disableFuture' | 'disablePast' | null;
