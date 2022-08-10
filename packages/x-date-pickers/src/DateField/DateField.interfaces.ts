import * as React from 'react';
import { TextFieldProps } from '@mui/material/TextField';

export type DateSectionName = 'day' | 'month' | 'year' | 'hour' | 'minute' | 'second' | 'am-pm';

export interface UseDateFieldProps<TInputDate, TDate> {
  value: TInputDate | null;
  onChange: (value: TDate | null) => void;
  /**
   * @default `adapter.formats.keyboardDate`
   */
  format?: string;
}

export interface DateFieldProps<TInputDate, TDate>
  extends Omit<TextFieldProps, 'onChange' | 'value'>,
    UseDateFieldProps<TInputDate, TDate> {}

export interface UseDateFieldResponse {
  inputProps: {
    value: string;
    onClick: React.MouseEventHandler<HTMLInputElement>;
    onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
    onFocus: () => void;
    onBlur: () => void;
  };
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
