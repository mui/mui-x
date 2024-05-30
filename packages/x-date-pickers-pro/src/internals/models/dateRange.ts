import { PickerValidDate } from '@mui/x-date-pickers/models';

/**
 * Props used to validate a day value in range pickers.
 */
export interface DayRangeValidationProps<TDate extends PickerValidDate> {
  /**
   * Disable specific date.
   *
   * Warning: This function can be called multiple times (for example when rendering date calendar, checking if focus can be moved to a certain date, etc.). Expensive computations can impact performance.
   *
   * @template TDate
   * @param {TDate} day The date to test.
   * @param {string} position The date to test, 'start' or 'end'.
   * @returns {boolean} Returns `true` if the date should be disabled.
   */
  shouldDisableDate?: (day: TDate, position: 'start' | 'end') => boolean;
}
