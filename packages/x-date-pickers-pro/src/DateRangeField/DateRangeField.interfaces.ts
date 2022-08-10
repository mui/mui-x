import { TextFieldProps } from '@mui/material/TextField';
import { DateFieldInputSection } from '@mui/x-date-pickers/DateField';
import { DateRange } from '../internal/models';

export interface UseDateRangeFieldProps<TInputDate, TDate> {
  value: DateRange<TInputDate>;
  onChange: (value: DateRange<TDate>) => void;
  /**
   * @default "dd/MM/yyyy"
   */
  format?: string;
}

export interface DateRangeFieldProps<TInputDate, TDate>
  extends Omit<TextFieldProps, 'onChange' | 'value'>,
    UseDateRangeFieldProps<TInputDate, TDate> {}

export interface DateRangeFieldInputSection extends DateFieldInputSection {
  dateName: 'start' | 'end';
}
