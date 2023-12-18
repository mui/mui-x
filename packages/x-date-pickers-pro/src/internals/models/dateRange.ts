import {
  BaseDateValidationProps,
  MakeOptional,
  UseFieldInternalProps,
} from '@mui/x-date-pickers/internals';
import { DateRange } from './range';
import type { DateRangeValidationError, RangeFieldSection } from '../../models';

/**
 * Props used to validate a day value in range pickers.
 */
export interface DayRangeValidationProps<TDate> {
  /**
   * Disable specific date.
   *
   * Warning: This function can be called multiple times (e.g. when rendering date calendar, checking if focus can be moved to a certain date, etc.). Expensive computations can impact performance.
   *
   * @template TDate
   * @param {TDate} day The date to test.
   * @param {string} position The date to test, 'start' or 'end'.
   * @returns {boolean} Returns `true` if the date should be disabled.
   */
  shouldDisableDate?: (day: TDate, position: 'start' | 'end') => boolean;
}

export interface UseDateRangeFieldProps<TDate, TUseV6TextField extends boolean>
  extends MakeOptional<
      Omit<
        UseFieldInternalProps<
          DateRange<TDate>,
          TDate,
          RangeFieldSection,
          TUseV6TextField,
          DateRangeValidationError
        >,
        'unstableFieldRef'
      >,
      'format'
    >,
    DayRangeValidationProps<TDate>,
    BaseDateValidationProps<TDate> {}
