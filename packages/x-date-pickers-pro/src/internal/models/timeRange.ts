import {
  BaseTimeValidationProps,
  TimeValidationProps,
  DefaultizedProps,
  MakeOptional,
  UseFieldInternalProps,
} from '@mui/x-date-pickers/internals';
import { DateRange } from './range';
import { TimeRangeValidationError } from '../hooks/validation/useTimeRangeValidation';

export interface UseTimeRangeFieldProps<TDate>
  extends MakeOptional<UseFieldInternalProps<DateRange<TDate>, TimeRangeValidationError>, 'format'>,
    TimeValidationProps<TDate>,
    BaseTimeValidationProps {
  /**
   * 12h/24h view for hour selection clock.
   * @default `utils.is12HourCycleInCurrentLocale()`
   */
  ampm?: boolean;
}

export type UseTimeRangeFieldDefaultizedProps<TDate> = DefaultizedProps<
  UseTimeRangeFieldProps<TDate>,
  keyof BaseTimeValidationProps | 'format'
>;
