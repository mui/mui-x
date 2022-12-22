import { FieldsTextFieldProps } from '@mui/x-date-pickers/internals/models/fields';
import { UseDateTimeRangeFieldProps } from '../internal/models';

export interface UseSingleInputDateTimeRangeFieldProps<TDate>
  extends UseDateTimeRangeFieldProps<TDate> {}

export type UseSingleInputDateTimeRangeFieldComponentProps<TDate, ChildProps extends {}> = Omit<
  ChildProps,
  'value' | 'defaultValue' | 'onChange' | 'onError'
> &
  UseSingleInputDateTimeRangeFieldProps<TDate>;

export type SingleInputDateTimeRangeFieldProps<TDate> =
  UseSingleInputDateTimeRangeFieldComponentProps<TDate, FieldsTextFieldProps>;
