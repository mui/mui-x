import * as React from 'react';
import { MuiPickersAdapter } from '../../models';
import { PickerStateValueManager } from '../usePickerState';

export type DateSectionName = 'day' | 'month' | 'year' | 'hour' | 'minute' | 'second' | 'am-pm';

export interface UseFieldParams<
  TInputValue,
  TValue,
  TDate,
  TSection extends FieldSection,
  TProps extends UseFieldProps<TInputValue, TValue>,
> {
  props: TProps;
  valueManager: PickerStateValueManager<TInputValue, TValue, TDate>;
  fieldValueManager: FieldValueManager<TValue, TDate, TSection>;
}

export interface UseFieldProps<TInputValue, TValue> {
  value?: TInputValue;
  onChange?: (value: TValue) => void;
  /**
   * The default value. Use when the component is not controlled.
   */
  defaultValue?: TInputValue;
  format?: string;
  /**
   * It prevents the user from changing the value of the field
   * (not from interacting with the field).
   * @default false
   */
  readOnly?: boolean;
}

export interface UseFieldResponse<TProps> {
  inputProps: Omit<TProps, keyof UseFieldProps<any, any>> & {
    value: string;
    onClick: React.MouseEventHandler<HTMLInputElement>;
    onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
    onFocus: () => void;
    onBlur: () => void;
  };
  inputRef: React.RefObject<HTMLInputElement>;
}

export interface FieldSection {
  start: number;
  end: number;
  value: string;
  emptyValue: string;
  separator: string | null;
  dateSectionName: DateSectionName;
  formatValue: string;
  query: string | null;
}

export interface FieldValueManager<TValue, TDate, TSection extends FieldSection> {
  getSectionsFromValue: (
    utils: MuiPickersAdapter<TDate>,
    prevSections: TSection[] | null,
    value: TValue,
    format: string,
  ) => TSection[];
  getValueStrFromSections: (sections: TSection[]) => string;
  getValueFromSections: (
    utils: MuiPickersAdapter<TDate>,
    prevSections: TSection[],
    sections: TSection[],
    format: string,
  ) => { value: TValue; shouldPublish: boolean };
  getActiveDateFromActiveSection: (
    value: TValue,
    activeSection: TSection,
  ) => { value: TDate | null; update: (newActiveDate: TDate | null) => TValue };
}

export interface UseFieldState<TValue, TSections> {
  valueStr: string;
  valueParsed: TValue;
  sections: TSections;
  selectedSectionIndexes: { start: number; end: number } | null;
}
