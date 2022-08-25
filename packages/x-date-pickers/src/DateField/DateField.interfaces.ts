import { TextFieldProps } from '@mui/material/TextField';
import { UseFieldProps } from '../internals/hooks/useField';
import {
  DateValidationError,
  DateValidationProps,
} from '../internals/hooks/validation/useDateValidation';

export interface UseDateFieldProps<TInputDate, TDate>
  extends UseFieldProps<TInputDate | null, TDate | null, DateValidationError>,
    Partial<Omit<DateValidationProps<TInputDate, TDate>, 'value'>> {}

export type UseDateFieldComponentProps<TInputDate, TDate, ChildProps extends {}> = Omit<
  ChildProps,
  'value' | 'defaultValue' | 'onChange' | 'onError'
> &
  UseDateFieldProps<TInputDate, TDate>;

export type DateFieldProps<TInputDate, TDate> = UseDateFieldComponentProps<
  TInputDate,
  TDate,
  TextFieldProps
>;
