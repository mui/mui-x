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

export interface UseDateTimeRangeFieldProps<TDate, TUseV6TextField extends boolean>
  extends MakeOptional<
      UseFieldInternalProps<
        DateRange<TDate>,
        TDate,
        RangeFieldSection,
        TUseV6TextField,
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

export type UseDateTimeRangeFieldDefaultizedProps<
  TDate,
  TUseV6TextField extends boolean,
> = DefaultizedProps<
  UseDateTimeRangeFieldProps<TDate, TUseV6TextField>,
  keyof BaseDateValidationProps<TDate> | 'format' | 'disableIgnoringDatePartForTimeValidation'
>;
