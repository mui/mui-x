import {
  BaseDateValidationProps,
  TimeValidationProps,
  DefaultizedProps,
  MakeOptional,
  UseFieldInternalProps,
  DateTimeValidationProps,
  DateOrTimeViewWithMeridiem,
} from '@mui/x-date-pickers/internals';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { BaseRangeProps, DayRangeValidationProps } from './dateRange';
import { DateTimeRangeValidationError, DateRange } from '../../models';
import { RangeFieldSection } from './fields';

export interface UseDateTimeRangeFieldProps<TDate extends PickerValidDate>
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

export type UseDateTimeRangeFieldDefaultizedProps<TDate extends PickerValidDate> = DefaultizedProps<
  UseDateTimeRangeFieldProps<TDate>,
  keyof BaseDateValidationProps<TDate> | 'format' | 'disableIgnoringDatePartForTimeValidation'
>;

export type DateTimeRangePickerView = Exclude<DateOrTimeViewWithMeridiem, 'month' | 'year'>;

export type DateTimeRangePickerViewExternal = Exclude<DateTimeRangePickerView, 'meridiem'>;
