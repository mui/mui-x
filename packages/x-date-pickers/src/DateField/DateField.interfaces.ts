import { TextFieldProps } from '@mui/material/TextField';
import { UseFieldProps } from '../internals/hooks/useField';
import {
  DateValidationError,
  DateValidationProps,
} from '../internals/hooks/validation/useDateValidation';
import { DefaultizedProps } from '../internals/models/helpers';

export interface UseDateFieldProps<TInputDate, TDate>
  extends UseFieldProps<TInputDate | null, TDate | null, DateValidationError>,
    Partial<Omit<DateValidationProps<TInputDate, TDate>, 'value'>> {}

export type UseDateFieldDefaultizedProps<TInputDate, TDate> = DefaultizedProps<
  UseDateFieldProps<TInputDate, TDate>,
  'minDate' | 'maxDate' | 'disableFuture' | 'disablePast'
>;

export interface DateFieldProps<TInputDate, TDate>
  extends Omit<TextFieldProps, 'value' | 'defaultValue' | 'onChange' | 'onError'>,
    UseDateFieldProps<TInputDate, TDate> {}
