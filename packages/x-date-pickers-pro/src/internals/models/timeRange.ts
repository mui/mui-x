import {
  BaseTimeValidationProps,
  TimeValidationProps,
  MakeOptional,
  UseFieldInternalProps,
} from '@mui/x-date-pickers/internals';
import { DateRange } from './range';
import { TimeRangeValidationError, RangeFieldSection } from '../../models';

export interface UseTimeRangeFieldProps<TDate, TUseV6TextField extends boolean>
  extends MakeOptional<
      Omit<
        UseFieldInternalProps<
          DateRange<TDate>,
          TDate,
          RangeFieldSection,
          TUseV6TextField,
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
