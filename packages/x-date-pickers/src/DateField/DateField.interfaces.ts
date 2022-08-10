import { TextFieldProps } from '@mui/material/TextField';
import { FieldSection, UseFieldProps } from '../internals/hooks/useField';

export interface UseDateFieldProps<TInputDate, TDate>
  extends Pick<
    UseFieldProps<TInputDate | null, TDate | null, TDate, FieldSection>,
    'value' | 'onChange' | 'format'
  > {}

export interface DateFieldProps<TInputDate, TDate>
  extends Omit<TextFieldProps, 'onChange' | 'value'>,
    UseDateFieldProps<TInputDate, TDate> {}
