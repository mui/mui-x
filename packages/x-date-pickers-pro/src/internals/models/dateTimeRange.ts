import {
  BaseDateValidationProps,
  TimeValidationProps,
  MakeOptional,
  UseFieldInternalProps,
  DateTimeValidationProps,
} from '@mui/x-date-pickers/internals';
import { FieldTextFieldVersion } from '@mui/x-date-pickers/models';
import { DayRangeValidationProps } from './dateRange';
import { DateRange } from './range';
import { DateTimeRangeValidationError, RangeFieldSection } from '../../models';

export interface UseDateTimeRangeFieldProps<TDate, TTextFieldVersion extends FieldTextFieldVersion>
  extends MakeOptional<
      Omit<
        UseFieldInternalProps<
          DateRange<TDate>,
          TDate,
          RangeFieldSection,
          TTextFieldVersion,
          DateTimeRangeValidationError
        >,
        'unstableFieldRef'
      >,
      'format'
    >,
    DayRangeValidationProps<TDate>,
    TimeValidationProps<TDate>,
    BaseDateValidationProps<TDate>,
    DateTimeValidationProps<TDate> {
  /**
   * 12h/24h view for hour selection clock.
   * @default `utils.is12HourCycleInCurrentLocale()`
   */
  ampm?: boolean;
}
