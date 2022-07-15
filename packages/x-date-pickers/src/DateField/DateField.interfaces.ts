import * as React from 'react';
import { TextFieldProps } from '@mui/material/TextField';

export type DateSectionName = 'day' | 'month' | 'year';

export interface UseDateFieldProps<TInputDate, TDate> {
  value: TInputDate | null;
  onChange: (value: TDate) => void;
}

export interface DateFieldProps<TInputDate, TDate>
  extends Omit<TextFieldProps, 'onChange' | 'value'>,
    UseDateFieldProps<TInputDate, TDate> {}

export interface UseDateFieldResponse {
  inputProps: Pick<TextFieldProps, 'value' | 'onClick' | 'onKeyDown'>;
  inputRef: React.RefObject<HTMLInputElement>;
}

export type DateFieldInputSection = {
  start: number;
  value: string;
  dateSectionName: DateSectionName;
};
