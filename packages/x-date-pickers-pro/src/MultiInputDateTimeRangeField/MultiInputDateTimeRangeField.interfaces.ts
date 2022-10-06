import { TextFieldProps } from '@mui/material/TextField';
import { UseDateTimeRangeFieldProps } from '../internal/models';

export interface UseMultiInputDateTimeRangeFieldProps<TDate>
  extends UseDateTimeRangeFieldProps<TDate> {}

export type UseMultiInputDateTimeRangeFieldComponentProps<TDate, ChildProps extends {}> = Omit<
  ChildProps,
  'value' | 'defaultValue' | 'onChange' | 'onError'
> &
  UseMultiInputDateTimeRangeFieldProps<TDate>;

export type MultiInputDateTimeRangeFieldProps<TDate> =
  UseMultiInputDateTimeRangeFieldComponentProps<TDate, TextFieldProps>;
