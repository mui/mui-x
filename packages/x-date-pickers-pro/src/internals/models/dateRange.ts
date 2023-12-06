import {
  BaseDateValidationProps,
  DefaultizedProps,
  MakeOptional,
  UseFieldInternalProps,
} from '@mui/x-date-pickers/internals';
import { DateRange } from './range';
import type { DateRangeValidationError } from '../../models';
import { RangeFieldSection } from './fields';

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

/**
 * Props used in every range picker.
 */
export interface BaseRangeProps {
  /**
   * If `true`, the component is disabled.
   * @default false
   */
  disabled?: boolean;
}

export interface UseDateRangeFieldProps<TDate>
  extends MakeOptional<
      UseFieldInternalProps<DateRange<TDate>, TDate, RangeFieldSection, DateRangeValidationError>,
      'format'
    >,
    DayRangeValidationProps<TDate>,
    BaseDateValidationProps<TDate>,
    BaseRangeProps {}

export type UseDateRangeFieldDefaultizedProps<TDate> = DefaultizedProps<
  UseDateRangeFieldProps<TDate>,
  keyof BaseDateValidationProps<TDate> | 'format'
>;
