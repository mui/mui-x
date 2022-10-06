import { UseFieldInternalProps } from '@mui/x-date-pickers/internals-fields';
import {
  BaseDateValidationProps,
  TimeValidationProps,
  DefaultizedProps,
} from '@mui/x-date-pickers/internals';
import { DayRangeValidationProps } from './dateRange';
import { DateRange } from './range';
import { DateTimeRangeValidationError } from '../hooks/validation/useDateTimeRangeValidation';

export interface UseDateTimeRangeFieldProps<TDate>
  extends UseFieldInternalProps<DateRange<TDate>, DateTimeRangeValidationError>,
    DayRangeValidationProps<TDate>,
    TimeValidationProps<TDate>,
    BaseDateValidationProps<TDate> {
  /**
   * Minimal selectable moment of time with binding to date, to set min time in each day use `minTime`.
   */
  minDateTime?: TDate;
  /**
   * Maximal selectable moment of time with binding to date, to set max time in each day use `maxTime`.
   */
  maxDateTime?: TDate;
}

export type UseDateTimeRangeFieldDefaultizedProps<TDate> = DefaultizedProps<
  UseDateTimeRangeFieldProps<TDate>,
  'minDate' | 'maxDate' | 'disableFuture' | 'disablePast'
>;
