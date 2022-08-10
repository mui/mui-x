import { TextFieldProps } from '@mui/material/TextField';
import { UseFieldProps, FieldSection } from '@mui/x-date-pickers/internals';
import { DateRange } from '../internal/models';

export interface UseDateRangeFieldProps<TInputDate, TDate>
  extends Pick<
    UseFieldProps<DateRange<TInputDate>, DateRange<TDate>, TDate, DateRangeFieldSection>,
    'value' | 'onChange' | 'format'
  > {}

export interface DateRangeFieldProps<TInputDate, TDate>
  extends Omit<TextFieldProps, 'onChange' | 'value'>,
    UseDateRangeFieldProps<TInputDate, TDate> {}

export interface DateRangeFieldSection extends FieldSection {
  dateName: 'start' | 'end';
}
