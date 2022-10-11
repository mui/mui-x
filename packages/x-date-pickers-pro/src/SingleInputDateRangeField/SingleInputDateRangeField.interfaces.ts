import { TextFieldProps } from '@mui/material/TextField';
import { UseDateRangeFieldProps } from '../internal/models';

export interface UseSingleInputDateRangeFieldProps<TDate> extends UseDateRangeFieldProps<TDate> {}

export type UseSingleInputDateRangeFieldComponentProps<TDate, ChildProps extends {}> = Omit<
  ChildProps,
  'value' | 'defaultValue' | 'onChange' | 'onError'
> &
  UseSingleInputDateRangeFieldProps<TDate>;

export type SingleInputDateRangeFieldProps<TDate> = UseSingleInputDateRangeFieldComponentProps<
  TDate,
  TextFieldProps
>;
