import * as React from 'react';
import { MuiDateSectionName, MuiPickerFieldAdapter } from '../../models';
import { PickerStateValueManager } from '../usePickerState';
import { InferError, Validator } from '../validation/useValidation';

export interface UseFieldParams<
  TInputValue,
  TValue,
  TDate,
  TSection extends FieldSection,
  TProps extends UseFieldProps<any, any, any>,
> {
  props: TProps;
  valueManager: PickerStateValueManager<TInputValue, TValue, TDate>;
  fieldValueManager: FieldValueManager<TValue, TDate, TSection, InferError<TProps>>;
  validator: Validator<TDate, UseFieldValidationProps<TInputValue, TProps>>;
}

export interface UseFieldProps<TInputValue, TValue, TError> {
  value?: TInputValue;
  onChange?: (value: TValue) => void;
  onError?: (error: TError, value: TInputValue) => void;
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
  onKeyDown?: React.KeyboardEventHandler;
  onClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export interface UseFieldResponse<TProps> {
  inputProps: Omit<TProps, keyof UseFieldProps<any, any, any>> & {
    value: string;
    onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
    onClick: () => void;
    onFocus: () => void;
    onBlur: () => void;
    error: boolean;
  };
  inputRef: React.RefObject<HTMLInputElement>;
}

export interface FieldSection {
  start: number;
  end: number;
  value: string;
  emptyValue: string;
  separator: string | null;
  dateSectionName: MuiDateSectionName;
  formatValue: string;
  query: string | null;
}

export interface FieldValueManager<TValue, TDate, TSection extends FieldSection, TError> {
  getSectionsFromValue: (
    utils: MuiPickerFieldAdapter<TDate>,
    prevSections: TSection[] | null,
    value: TValue,
    format: string,
  ) => TSection[];
  getValueStrFromSections: (sections: TSection[]) => string;
  getValueFromSections: (
    utils: MuiPickerFieldAdapter<TDate>,
    prevSections: TSection[],
    sections: TSection[],
    format: string,
  ) => { value: TValue; shouldPublish: boolean };
  getActiveDateFromActiveSection: (
    value: TValue,
    activeSection: TSection,
  ) => { value: TDate | null; update: (newActiveDate: TDate | null) => TValue };
  hasError: (error: TError) => boolean;
}

export interface UseFieldState<TValue, TSections> {
  valueStr: string;
  valueParsed: TValue;
  sections: TSections;
  selectedSectionIndexes: { start: number; end: number } | null;
}

export type UseFieldValidationProps<
  TInputValue,
  TProps extends UseFieldProps<any, any, any>,
> = Omit<TProps, 'value' | 'defaultValue'> & { value: TInputValue };

export type AvailableAdjustKeyCode =
  | 'ArrowUp'
  | 'ArrowDown'
  | 'PageUp'
  | 'PageDown'
  | 'Home'
  | 'End';
