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
  valueManager: PickerStateValueManager<TValue, TDate>;
  fieldValueManager: FieldValueManager<TValue, TDate, TSection, InferError<TInternalProps>>;
  validator: Validator<
    TValue,
    TDate,
    InferError<TInternalProps>,
    UseFieldValidationProps<TValue, TInternalProps>
  >;
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
  /**
   * The currently selected sections.
   * This prop accept four formats:
   * 1. If a number is provided, the section at this index will be selected.
   * 2. If an object with a `startIndex` and `endIndex` properties are provided, the sections between those two indexes will be selected.
   * 3. If a string of type `MuiDateSectionName` is provided, the first section with that name will be selected.
   * 4. If `null` is provided, no section will be selected
   * If not provided, the selected sections will be handled internally.
   */
  selectedSectionIndexes?: FieldSelectedSections;
  /**
   * Callback fired when the selected sections change.
   * @param {FieldSelectedSections} newValue The new selected sections.
   */
  onSelectedSectionIndexesChange?: (newValue: FieldSelectedSections) => void;
  inputRef?: React.Ref<HTMLInputElement>;
}

export interface UseFieldForwardedProps {
  onKeyDown?: React.KeyboardEventHandler;
  onClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export interface UseFieldResponse<TForwardedProps extends UseFieldForwardedProps> {
  inputProps: UseFieldResponseInputProps<TForwardedProps>;
  inputRef: React.Ref<HTMLInputElement>;
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
}

export type FieldSelectedSectionsIndexes = { startIndex: number; endIndex: number };

export type FieldSelectedSections =
  | number
  | FieldSelectedSectionsIndexes
  | MuiDateSectionName
  | null;

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
  isSameError: (error: TError, prevError: TError | null) => boolean;
}

export interface UseFieldState<TValue, TSections> {
  value: TValue;
  sections: TSections;
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
