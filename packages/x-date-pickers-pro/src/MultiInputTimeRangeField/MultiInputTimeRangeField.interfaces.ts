import { TextFieldProps } from '@mui/material/TextField';
import { UseTimeRangeFieldProps } from '../internal/models';

export interface UseMultiInputTimeRangeFieldProps<TDate> extends UseTimeRangeFieldProps<TDate> {}

export type UseMultiInputTimeRangeFieldComponentProps<TDate, ChildProps extends {}> = Omit<
  ChildProps,
  'value' | 'defaultValue' | 'onChange' | 'onError'
> &
  UseMultiInputTimeRangeFieldProps<TDate>;

export type MultiInputTimeRangeFieldProps<TDate> = UseMultiInputTimeRangeFieldComponentProps<
  TDate,
  TextFieldProps
>;
