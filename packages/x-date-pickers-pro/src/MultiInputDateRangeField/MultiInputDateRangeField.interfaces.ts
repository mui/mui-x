import { UseSingleInputDateRangeFieldProps } from '../SingleInputDateRangeField';

export interface UseMultiInputDateRangeFieldProps<TDate>
  extends UseSingleInputDateRangeFieldProps<TDate> {}

export interface MultiInputDateRangeFieldProps<TDate>
  extends UseMultiInputDateRangeFieldProps<TDate> {}
