import {
  BaseDateValidationProps,
  TimeValidationProps,
  MakeOptional,
  UseFieldInternalProps,
  DateTimeValidationProps,
} from '@mui/x-date-pickers/internals';
import { DayRangeValidationProps } from './dateRange';
import { DateRange } from './range';
import { DateTimeRangeValidationError } from '../../models';
import { RangeFieldSection } from './fields';

export interface UseDateTimeRangeFieldProps<TDate, TUseV6TextField extends boolean>
  extends MakeOptional<
      Omit<
        UseFieldInternalProps<
          DateRange<TDate>,
          TDate,
          RangeFieldSection,
          TUseV6TextField,
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
