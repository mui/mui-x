import { TextFieldProps } from '@mui/material/TextField';
import { UseDateTimeRangeFieldProps } from '../internal/models';

export interface UseSingleInputDateTimeRangeFieldProps<TDate>
  extends UseDateTimeRangeFieldProps<TDate> {}

export type UseSingleInputDateTimeRangeFieldComponentProps<TDate, ChildProps extends {}> = Omit<
  ChildProps,
  'value' | 'defaultValue' | 'onChange' | 'onError'
> &
  UseSingleInputDateTimeRangeFieldProps<TDate>;

export type SingleInputDateTimeRangeFieldProps<TDate> =
  UseSingleInputDateTimeRangeFieldComponentProps<TDate, TextFieldProps>;
