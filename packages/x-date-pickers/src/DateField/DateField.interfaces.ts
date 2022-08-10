import * as React from 'react';
import { TextFieldProps } from '@mui/material/TextField';

export type DateSectionName = 'day' | 'month' | 'year' | 'hour' | 'minute' | 'second' | 'am-pm';

export interface UseDateFieldProps<TInputDate, TDate> {
  value: TInputDate | null;
  onChange: (value: TDate | null) => void;
  /**
   * @default "dd/MM/yyyy"
   */
  format?: string;
}

export interface DateFieldProps<TInputDate, TDate>
  extends Omit<TextFieldProps, 'onChange' | 'value'>,
    UseDateFieldProps<TInputDate, TDate> {}

export interface UseDateFieldResponse {
  inputProps: Pick<TextFieldProps, 'value' | 'onClick' | 'onKeyDown'>;
  inputRef: React.RefObject<HTMLInputElement>;
}

export interface DateFieldInputSection {
  start: number;
  end: number;
  value: string;
  emptyValue: string;
  separator: string | null;
  dateSectionName: DateSectionName;
  formatValue: string;
  query: string | null;
}
