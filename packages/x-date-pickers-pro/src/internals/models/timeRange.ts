import {
  BaseTimeValidationProps,
  TimeValidationProps,
  MakeOptional,
  UseFieldInternalProps,
} from '@mui/x-date-pickers/internals';
import { FieldTextFieldVersion } from '@mui/x-date-pickers/models';
import { DateRange } from './range';
import { TimeRangeValidationError, RangeFieldSection } from '../../models';

export interface UseTimeRangeFieldProps<TDate, TTextFieldVersion extends FieldTextFieldVersion>
  extends MakeOptional<
      Omit<
        UseFieldInternalProps<
          DateRange<TDate>,
          TDate,
          RangeFieldSection,
          TTextFieldVersion,
          TimeRangeValidationError
        >,
        'unstableFieldRef'
      >,
      'format'
    >,
    TimeValidationProps<TDate>,
    BaseTimeValidationProps {
  /**
   * 12h/24h view for hour selection clock.
   * @default `utils.is12HourCycleInCurrentLocale()`
   */
  ampm?: boolean;
}
