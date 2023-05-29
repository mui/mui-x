import {
  BaseDateValidationProps,
  TimeValidationProps,
  DefaultizedProps,
  MakeOptional,
  UseFieldInternalProps,
  DateTimeValidationProps,
} from '@mui/x-date-pickers/internals';
import { BaseRangeProps, DayRangeValidationProps } from './dateRange';
import { DateRange } from './range';
import { DateTimeRangeValidationError } from '../../models';
import { RangeFieldSection } from './fields';

export interface UseDateTimeRangeFieldProps<TDate>
  extends MakeOptional<
      UseFieldInternalProps<
        DateRange<TDate>,
        TDate,
        RangeFieldSection,
        DateTimeRangeValidationError
      >,
      'format'
    >,
    DayRangeValidationProps<TDate>,
    TimeValidationProps<TDate>,
    BaseDateValidationProps<TDate>,
    DateTimeValidationProps<TDate>,
    BaseRangeProps {
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
