import {
  BaseDateValidationProps,
  TimeValidationProps,
  DefaultizedProps,
} from '@mui/x-date-pickers/internals';
import { UseFieldInternalProps } from '@mui/x-date-pickers/internals-fields';
import { DateRange } from './range';
import type { DateRangeValidationError } from '../hooks/validation/useDateRangeValidation';

/**
 * Props used to validate a day value in range pickers.
 */
export interface DayRangeValidationProps<TDate> {
  /**
   * Disable specific date. @DateIOType
   * @template TDate
   * @param {TDate} day The date to test.
   * @param {string} position The date to test, 'start' or 'end'.
   * @returns {boolean} Returns `true` if the date should be disabled.
   */
  shouldDisableDate?: (day: TDate, position: 'start' | 'end') => boolean;
}

export interface UseDateRangeFieldProps<TDate>
  extends UseFieldInternalProps<DateRange<TDate>, DateRangeValidationError>,
    DayRangeValidationProps<TDate>,
    TimeValidationProps<TDate>,
    BaseDateValidationProps<TDate> {}

export type UseDateRangeFieldDefaultizedProps<TDate> = DefaultizedProps<
  UseDateRangeFieldProps<TDate>,
  'minDate' | 'maxDate' | 'disableFuture' | 'disablePast'
>;
