import { ClockPickerView } from '../../models/views';

interface FutureAndPastValidationProps {
  /**
   * If `true` disable values after the current time.
   * @default false
   */
  disablePast?: boolean;
  /**
   * If `true` disable values before the current time
   * @default false
   */
  disableFuture?: boolean;
}

/**
 * Validation props common to all time views.
 * All these props have a default value when used inside a picker component.
 */
export interface BaseTimeValidationProps extends FutureAndPastValidationProps {}

/**
 * Props used to validate a time value.
 */
export interface TimeValidationProps<TDate> {
  /**
   * Min time acceptable time.
   * For input validation date part of passed object will be ignored if `disableIgnoringDatePartForTimeValidation` not specified.
   */
  minTime?: TDate;
  /**
   * Max time acceptable time.
   * For input validation date part of passed object will be ignored if `disableIgnoringDatePartForTimeValidation` not specified.
   */
  maxTime?: TDate;
  /**
   * Step over minutes.
   * @default 1
   */
  minutesStep?: number;
  /**
   * Dynamically check if time is disabled or not.
   * If returns `false` appropriate time point will ot be acceptable.
   * @param {number} timeValue The value to check.
   * @param {ClockPickerView} view The clock type of the timeValue.
   * @returns {boolean} Returns `true` if the time should be disabled
   */
  shouldDisableTime?: (timeValue: number, view: ClockPickerView) => boolean;
  /**
   * Do not ignore date part when validating min/max time.
   * @default false
   */
  disableIgnoringDatePartForTimeValidation?: boolean;
}

/**
 * Validation props common to all date views.
 * All these props have a default value when used inside a picker component.
 */
export interface BaseDateValidationProps<TDate> extends FutureAndPastValidationProps {
  /**
   * Maximal selectable date. @DateIOType
   */
  maxDate?: TDate;
  /**
   * Minimal selectable date. @DateIOType
   */
  minDate?: TDate;
}

/**
 * Props used to validate a day value.
 */
export interface DayValidationProps<TDate> {
  /**
   * Disable specific date. @DateIOType
   * @template TDate
   * @param {TDate} day The date to test.
   * @returns {boolean} Returns `true` if the date should be disabled.
   */
  shouldDisableDate?: (day: TDate) => boolean;
}

/**
 * Props used to validate a month value
 */
export interface MonthValidationProps<TDate> {
  /**
   * Disable specific months dynamically.
   * Works like `shouldDisableDate` but for month selection view @DateIOType.
   * @template TDate
   * @param {TDate} month The month to check.
   * @returns {boolean} If `true` the month will be disabled.
   */
  shouldDisableMonth?: (month: TDate) => boolean;
}

/**
 * Props used to validate a year value
 */
export interface YearValidationProps<TDate> {
  /**
   * Disable specific years dynamically.
   * Works like `shouldDisableDate` but for year selection view @DateIOType.
   * @template TDate
   * @param {TDate} year The year to test.
   * @returns {boolean} Returns `true` if the year should be disabled.
   */
  shouldDisableYear?: (year: TDate) => boolean;
}

/**
 * Common validation error types applicable to both date and time validation
 */
export type CommonDateTimeValidationError = 'invalidDate' | 'disableFuture' | 'disablePast' | null;
