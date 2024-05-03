import {
  BaseDateValidationProps,
  TimeValidationProps,
  MakeOptional,
  UseFieldInternalProps,
  DateTimeValidationProps,
  DateOrTimeViewWithMeridiem,
} from '@mui/x-date-pickers/internals';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { DayRangeValidationProps } from './dateRange';
import {
  DateTimeRangeValidationError,
  RangeFieldSection,
  DateRange,
  RangeFieldSeparatorProps,
} from '../../models';

export interface UseDateTimeRangeFieldProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends MakeOptional<
      Omit<
        UseFieldInternalProps<
          DateRange<TDate>,
          TDate,
          RangeFieldSection,
          TEnableAccessibleFieldDOMStructure,
          DateTimeRangeValidationError
        >,
        'unstableFieldRef'
      >,
      'format'
    >,
    RangeFieldSeparatorProps,
    DayRangeValidationProps<TDate>,
    TimeValidationProps<TDate>,
    BaseDateValidationProps<TDate>,
    DateTimeValidationProps<TDate> {
  /**
   * 12h/24h view for hour selection clock.
   * @default utils.is12HourCycleInCurrentLocale()
   */
  ampm?: boolean;
}

export type DateTimeRangePickerView = Exclude<DateOrTimeViewWithMeridiem, 'month' | 'year'>;

export type DateTimeRangePickerViewExternal = Exclude<DateTimeRangePickerView, 'meridiem'>;
