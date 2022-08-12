import { TextFieldProps } from '@mui/material/TextField';
import { UseFieldProps } from '../internals/hooks/useField';
import {
  DateValidationError,
  DateValidationProps,
} from '../internals/hooks/validation/useDateValidation';

export interface UseDateFieldProps<TInputDate, TDate>
  extends UseFieldProps<TInputDate | null, TDate | null, DateValidationError>,
    Omit<DateValidationProps<TInputDate, TDate>, 'value'> {}

export interface DateFieldProps<TInputDate, TDate>
  extends Omit<TextFieldProps, 'value' | 'defaultValue' | 'onChange' | 'onError'>,
    UseDateFieldProps<TInputDate, TDate> {}
