import { UseSingleInputDateRangeFieldProps } from '../SingleInputDateRangeField';

export interface UseMultiInputDateRangeFieldProps<TInputDate, TDate>
  extends UseSingleInputDateRangeFieldProps<TInputDate, TDate> {}

export interface MultiInputDateRangeFieldProps<TInputDate, TDate>
  extends UseMultiInputDateRangeFieldProps<TInputDate, TDate> {}
