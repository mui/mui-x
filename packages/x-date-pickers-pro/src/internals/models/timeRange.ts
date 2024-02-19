import {
  BaseTimeValidationProps,
  TimeValidationProps,
  DefaultizedProps,
  MakeOptional,
  UseFieldInternalProps,
} from '@mui/x-date-pickers/internals';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { TimeRangeValidationError, DateRange } from '../../models';
import { BaseRangeProps } from './dateRange';
import { RangeFieldSection } from './fields';

export interface UseTimeRangeFieldProps<TDate extends PickerValidDate>
  extends MakeOptional<
      UseFieldInternalProps<DateRange<TDate>, TDate, RangeFieldSection, TimeRangeValidationError>,
      'format'
    >,
    TimeValidationProps<TDate>,
    BaseTimeValidationProps,
    BaseRangeProps {
  /**
   * 12h/24h view for hour selection clock.
   * @default `utils.is12HourCycleInCurrentLocale()`
   */
  ampm?: boolean;
}

export type UseTimeRangeFieldDefaultizedProps<TDate extends PickerValidDate> = DefaultizedProps<
  UseTimeRangeFieldProps<TDate>,
  keyof BaseTimeValidationProps | 'format'
>;
