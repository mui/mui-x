import { TextFieldProps } from '@mui/material/TextField';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import {
  DateValidationError,
  DateComponentValidationProps,
} from '../internals/hooks/validation/useDateValidation';
import { DefaultizedProps } from '../internals/models/helpers';

export interface UseDateFieldProps<TDate>
  extends UseFieldInternalProps<TDate | null, DateValidationError>,
    Partial<Omit<DateComponentValidationProps<TDate>, 'value'>> {}

export type UseDateFieldDefaultizedProps<TDate> = DefaultizedProps<
  UseDateFieldProps<TDate>,
  'minDate' | 'maxDate' | 'disableFuture' | 'disablePast'
>;

export type UseDateFieldComponentProps<TDate, ChildProps extends {}> = Omit<
  ChildProps,
  'value' | 'defaultValue' | 'onChange' | 'onError'
> &
  UseDateFieldProps<TDate>;

export type DateFieldProps<TDate> = UseDateFieldComponentProps<TDate, TextFieldProps>;
