import { TextFieldProps } from '@mui/material/TextField';
import { UseTimeRangeFieldProps } from '../internal/models';

export interface UseSingleInputTimeRangeFieldProps<TDate> extends UseTimeRangeFieldProps<TDate> {}

export type UseSingleInputTimeRangeFieldComponentProps<TDate, ChildProps extends {}> = Omit<
  ChildProps,
  'value' | 'defaultValue' | 'onChange' | 'onError'
> &
  UseSingleInputTimeRangeFieldProps<TDate>;

export type SingleInputTimeRangeFieldProps<TDate> = UseSingleInputTimeRangeFieldComponentProps<
  TDate,
  TextFieldProps
>;
