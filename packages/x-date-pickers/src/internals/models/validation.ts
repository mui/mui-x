import type { PickerValidDate, TimeView } from '../../models';

interface FutureAndPastValidationProps {
  /**
   * If `true`, disable values before the current date for date components, time for time components and both for date time components.
   * @default false
   */
  disablePast?: boolean;
  /**
   * If `true`, disable values after the current date for date components, time for time components and both for date time components.
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
export interface TimeValidationProps {
  /**
   * Minimal selectable time.
   * The date part of the object will be ignored unless `props.disableIgnoringDatePartForTimeValidation === true`.
   */
  minTime?: PickerValidDate;
  /**
   * Maximal selectable time.
   * The date part of the object will be ignored unless `props.disableIgnoringDatePartForTimeValidation === true`.
   */
  maxTime?: PickerValidDate;
  /**
   * Step over minutes.
   * @default 1
   */
  minutesStep?: number;
  /**
   * Disable specific time.
   * @param {PickerValidDate} value The value to check.
   * @param {TimeView} view The clock type of the timeValue.
   * @returns {boolean} If `true` the time will be disabled.
   */
  shouldDisableTime?: (value: PickerValidDate, view: TimeView) => boolean;
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
export interface BaseDateValidationProps extends FutureAndPastValidationProps {
  /**
   * Maximal selectable date.
   * @default 2099-12-31
   */
  maxDate?: PickerValidDate;
  /**
   * Minimal selectable date.
   * @default 1900-01-01
   */
  minDate?: PickerValidDate;
}

/**
 * Props used to validate a date value (validates day + month + year).
 */
export interface DayValidationProps {
  /**
   * Disable specific date.
   *
   * Warning: This function can be called multiple times (for example when rendering date calendar, checking if focus can be moved to a certain date, etc.). Expensive computations can impact performance.
   *
   * @param {PickerValidDate} day The date to test.
   * @returns {boolean} If `true` the date will be disabled.
   */
  shouldDisableDate?: (day: PickerValidDate) => boolean;
}

/**
 * Props used to validate a month value
 */
export interface MonthValidationProps {
  /**
   * Disable specific month.
   * @param {PickerValidDate} month The month to test.
   * @returns {boolean} If `true`, the month will be disabled.
   */
  shouldDisableMonth?: (month: PickerValidDate) => boolean;
}

/**
 * Props used to validate a year value
 */
export interface YearValidationProps {
  /**
   * Disable specific year.
   * @param {PickerValidDate} year The year to test.
   * @returns {boolean} If `true`, the year will be disabled.
   */
  shouldDisableYear?: (year: PickerValidDate) => boolean;
}

/**
 * Props used to validate a date time value.
 */
export interface DateTimeValidationProps {
  /**
   * Minimal selectable moment of time with binding to date, to set min time in each day use `minTime`.
   */
  minDateTime?: PickerValidDate;
  /**
   * Maximal selectable moment of time with binding to date, to set max time in each day use `maxTime`.
   */
  maxDateTime?: PickerValidDate;
}
