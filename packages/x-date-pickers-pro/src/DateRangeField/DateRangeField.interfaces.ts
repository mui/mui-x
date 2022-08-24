import { TextFieldProps } from '@mui/material/TextField';
import { UseFieldProps, FieldSection } from '@mui/x-date-pickers/internals';
import { DateRange } from '../internal/models';
import {
  DateRangeValidationError,
  DateRangeValidationProps,
} from '../internal/hooks/validation/useDateRangeValidation';

export interface UseDateRangeFieldProps<TInputDate, TDate>
  extends UseFieldProps<DateRange<TInputDate>, DateRange<TDate>, DateRangeValidationError>,
    Omit<DateRangeValidationProps<TInputDate, TDate>, 'value'> {}

export type DateRangeFieldProps<TInputDate, TDate> = Omit<
  TextFieldProps,
  'value' | 'defaultValue' | 'onChange' | 'onError'
> &
  UseDateRangeFieldProps<TInputDate, TDate>;

export interface DateRangeFieldSection extends FieldSection {
  dateName: 'start' | 'end';
}
