import { TextFieldProps } from '@mui/material/TextField';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import {
  DateValidationError,
  DateValidationProps,
} from '../internals/hooks/validation/useDateValidation';
import { DefaultizedProps } from '../internals/models/helpers';

export interface UseDateFieldProps<TInputDate, TDate>
  extends UseFieldInternalProps<TInputDate | null, TDate | null, DateValidationError>,
    Partial<Omit<DateValidationProps<TInputDate, TDate>, 'value'>> {}

export type UseDateFieldDefaultizedProps<TInputDate, TDate> = DefaultizedProps<
  UseDateFieldProps<TInputDate, TDate>,
  'minDate' | 'maxDate' | 'disableFuture' | 'disablePast'
>;

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
