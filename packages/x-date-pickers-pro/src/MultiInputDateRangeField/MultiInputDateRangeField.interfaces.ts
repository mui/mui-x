import { UseDateRangeFieldProps } from '../DateRangeField';

export interface UseMultiInputDateRangeFieldProps<TInputDate, TDate>
  extends UseDateRangeFieldProps<TInputDate, TDate> {}

export interface MultiInputDateRangeFieldProps<TInputDate, TDate>
  extends UseMultiInputDateRangeFieldProps<TInputDate, TDate> {}
