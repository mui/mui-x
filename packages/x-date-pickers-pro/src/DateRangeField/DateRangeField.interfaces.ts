import { TextFieldProps } from '@mui/material/TextField';
import { UseFieldProps, FieldSection } from '@mui/x-date-pickers/internals';
import { DateRange } from '../internal/models';

export type UseDateRangeFieldProps<TInputDate, TDate> = UseFieldProps<
  DateRange<TInputDate>,
  DateRange<TDate>
>;

export interface DateRangeFieldProps<TInputDate, TDate>
  extends Omit<TextFieldProps, 'value' | 'defaultValue' | 'onChange'>,
    UseDateRangeFieldProps<TInputDate, TDate> {}

export interface DateRangeFieldSection extends FieldSection {
  dateName: 'start' | 'end';
}
