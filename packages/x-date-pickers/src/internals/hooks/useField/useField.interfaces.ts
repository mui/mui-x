import * as React from 'react';
import { MuiDateSectionName, MuiPickerFieldAdapter } from '../../models';
import { PickerStateValueManager } from '../usePickerState';
import { InferError, Validator } from '../validation/useValidation';

export interface UseFieldParams<
  TValue,
  TDate,
  TSection extends FieldSection,
  TForwardedProps extends UseFieldForwardedProps,
  TInternalProps extends UseFieldInternalProps<any, any>,
> {
  forwardedProps: TForwardedProps;
  internalProps: TInternalProps;
  valueManager: PickerStateValueManager<TValue, TValue, TDate>;
  fieldValueManager: FieldValueManager<TValue, TDate, TSection, InferError<TInternalProps>>;
  validator: Validator<TDate, UseFieldValidationProps<TValue, TInternalProps>>;
}

export interface UseFieldInternalProps<TValue, TError> {
  value?: TValue;
  onChange?: (value: TValue) => void;
  onError?: (error: TError, value: TValue) => void;
  /**
   * The default value. Use when the component is not controlled.
   */
  defaultValue?: TValue;
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

export interface UseFieldResponse<TForwardedProps extends UseFieldForwardedProps> {
  inputProps: UseFieldResponseInputProps<TForwardedProps>;
  inputRef: React.RefObject<HTMLInputElement>;
}

export type UseFieldResponseInputProps<TForwardedProps extends UseFieldForwardedProps> = Omit<
  TForwardedProps,
  keyof UseFieldForwardedProps
> &
  NonNullable<UseFieldForwardedProps> & {
    value: string;
    error: boolean;
  };

export interface FieldSection {
  start: number;
  end: number;
  value: string;
  emptyValue: string;
  separator: string | null;
  dateSectionName: MuiDateSectionName;
  formatValue: string;
  query: string | null;
  edited: boolean;
}

export interface FieldValueManager<TValue, TDate, TSection extends FieldSection, TError> {
  getSectionsFromValue: (
    utils: MuiPickerFieldAdapter<TDate>,
    prevSections: TSection[] | null,
    value: TValue,
    format: string,
  ) => TSection[];
  getValueStrFromSections: (sections: TSection[]) => string;
  getValueFromSections: (params: {
    utils: MuiPickerFieldAdapter<TDate>;
    sections: TSection[];
    format: string;
  }) => TValue;
  isActiveDateValid: (params: {
    utils: MuiPickerFieldAdapter<TDate>;
    value: TValue;
    activeSection: TSection;
  }) => boolean;
  getActiveDateFromActiveSection: (params: {
    state: UseFieldState<TValue, TSection>;
    activeSection: TSection;
    publishValue: (params: { value: TValue; referenceValue: TValue }) => void;
  }) => {
    activeDate: TDate | null;
    activeDateSections: TSection[];
    referenceActiveDate: TDate;
    saveActiveDate: (date: TDate | null) => void;
  };
  hasError: (error: TError) => boolean;
  isSameError: (error: TError, prevError: TError | null) => boolean;
}

export interface UseFieldState<TValue, TSection extends FieldSection> {
  value: TValue;
  lastPublishedValue: TValue;
  referenceValue: TValue;
  sections: TSection[];
  selectedSectionIndexes: { start: number; end: number } | null;
}

export type UseFieldValidationProps<
  TValue,
  TInternalProps extends UseFieldInternalProps<any, any>,
> = Omit<TInternalProps, 'value' | 'defaultValue'> & { value: TValue };

export type AvailableAdjustKeyCode =
  | 'ArrowUp'
  | 'ArrowDown'
  | 'PageUp'
  | 'PageDown'
  | 'Home'
  | 'End';
