/**
 * Validation props common to all date views
 */
export interface BaseDateValidationProps<TDate> {
  /**
   * If `true` past days are disabled.
   * @default false
   */
  disablePast?: boolean;
  /**
   * If `true` future days are disabled.
   * @default false
   */
  disableFuture?: boolean;
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
export interface DayValidationProps<TDate> extends BaseDateValidationProps<TDate> {
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
export interface MonthValidationProps<TDate> extends BaseDateValidationProps<TDate> {
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
export interface YearValidationProps<TDate> extends BaseDateValidationProps<TDate> {
  /**
   * Disable specific years dynamically.
   * Works like `shouldDisableDate` but for year selection view @DateIOType.
   * @template TDate
   * @param {TDate} year The year to test.
   * @returns {boolean} Returns `true` if the year should be disabled.
   */
  shouldDisableYear?: (year: TDate) => boolean;
}
