import { TextFieldProps } from '@mui/material/TextField';
import { UseFieldProps } from '../internals/hooks/useField';

export type UseDateFieldProps<TInputDate, TDate> = UseFieldProps<TInputDate | null, TDate | null>;

export interface DateFieldProps<TInputDate, TDate>
  extends Omit<TextFieldProps, 'value' | 'defaultValue' | 'onChange'>,
    UseDateFieldProps<TInputDate, TDate> {}
