import * as React from 'react';
import { MuiPickersAdapter } from '../../models';
import { PickerStateValueManager } from '../usePickerState';
import { InferError, Validator } from '../validation/useValidation';

export type DateSectionName = 'day' | 'month' | 'year' | 'hour' | 'minute' | 'second' | 'am-pm';

export interface UseFieldParams<
  TInputValue,
  TValue,
  TDate,
  TSection extends FieldSection,
  TForwardedProps extends UseFieldForwardedProps,
  TInternalProps extends UseFieldInternalProps<any, any, any>,
> {
  forwardedProps: TForwardedProps;
  internalProps: TInternalProps;
  valueManager: PickerStateValueManager<TInputValue, TValue, TDate>;
  fieldValueManager: FieldValueManager<TValue, TDate, TSection, InferError<TInternalProps>>;
  validator: Validator<TDate, UseFieldValidationProps<TInputValue, TInternalProps>>;
}

export interface UseFieldInternalProps<TInputValue, TValue, TError> {
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
}

export interface UseFieldForwardedProps {
  onKeyDown?: React.KeyboardEventHandler;
  onClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export interface UseFieldResponse<TForwardedProps> {
  inputProps: Omit<TForwardedProps, keyof UseFieldForwardedProps> & {
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
  dateSectionName: DateSectionName;
  formatValue: string;
  query: string | null;
}

export interface FieldValueManager<TValue, TDate, TSection extends FieldSection, TError> {
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
  TInternalProps extends UseFieldInternalProps<any, any, any>,
> = Omit<TInternalProps, 'value' | 'defaultValue'> & { value: TInputValue };

export type AvailableAdjustKeyCode =
  | 'ArrowUp'
  | 'ArrowDown'
  | 'PageUp'
  | 'PageDown'
  | 'Home'
  | 'End';
