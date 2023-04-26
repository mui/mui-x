import {
  BaseDateValidationProps,
  TimeValidationProps,
  DefaultizedProps,
  MakeOptional,
  UseFieldInternalProps,
} from '@mui/x-date-pickers/internals';
import { BaseRangeProps, DayRangeValidationProps } from './dateRange';
import { DateRange } from './range';
import { DateTimeRangeValidationError } from '../../models';
import { RangeFieldSection } from './fields';

export interface UseDateTimeRangeFieldProps<TDate>
  extends MakeOptional<
      UseFieldInternalProps<DateRange<TDate>, RangeFieldSection, DateTimeRangeValidationError>,
      'format'
    >,
    DayRangeValidationProps<TDate>,
    TimeValidationProps<TDate>,
    BaseDateValidationProps<TDate>,
    BaseRangeProps {
  /**
   * Minimal selectable moment of time with binding to date, to set min time in each day use `minTime`.
   */
  minDateTime?: TDate;
  /**
   * Maximal selectable moment of time with binding to date, to set max time in each day use `maxTime`.
   */
  maxDateTime?: TDate;
  /**
   * 12h/24h view for hour selection clock.
   * @default `utils.is12HourCycleInCurrentLocale()`
   */
  ampm?: boolean;
}

export type UseDateTimeRangeFieldDefaultizedProps<TDate> = DefaultizedProps<
  UseDateTimeRangeFieldProps<TDate>,
  keyof BaseDateValidationProps<TDate> | 'format' | 'disableIgnoringDatePartForTimeValidation'
>;
