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
  edited: boolean;
}

/**
 * Object used to access and update the active value.
 * Mainly useful in the range fields where we need to update the date containing the active section without impacting the other one.
 */
interface FieldActiveDateManager<TValue, TDate> {
  /**
   * Date containing the current active section.
   */
  activeDate: TDate | null;
  /**
   * Reference date containing the current active section.
   */
  referenceActiveDate: TDate;
  /**
   * Creates the new value and reference value based on the new active date and the current state.
   * @template TValue, TDate
   * @param {TDate | null} newActiveDate The new value of the date containing the active section.
   * @returns {Pick<UseFieldState<TValue, any>, 'value' | 'referenceValue'>} The new value and reference value to publish and store in the state.
   */
  getNewValueFromNewActiveDate: (
    newActiveDate: TDate | null,
  ) => Pick<UseFieldState<TValue, any>, 'value' | 'referenceValue'>;
  getInvalidValue: () => TValue;
}

export interface FieldValueManager<TValue, TDate, TSection extends FieldSection, TError> {
  getReferenceValue: (params: { value: TValue; prevValue: TValue }) => TValue;
  getSectionsFromValue: (
    utils: MuiPickerFieldAdapter<TDate>,
    prevSections: TSection[] | null,
    value: TValue,
    format: string,
  ) => TSection[];
  getValueStrFromSections: (sections: TSection[]) => string;
  getActiveDateSectionsFromActiveSection: (params: {
    activeSection: TSection;
    sections: TSection[];
  }) => TSection[];
  getActiveDateManager: (params: {
    state: UseFieldState<TValue, TSection>;
    activeSection: TSection;
  }) => FieldActiveDateManager<TValue, TDate>;
  hasError: (error: TError) => boolean;
  isSameError: (error: TError, prevError: TError | null) => boolean;
}

export interface UseFieldState<TValue, TSection extends FieldSection> {
  value: TValue;
  /**
   * Non-nullable value used to keep trace of the timezone and the date parts not present in the format.
   * It is updated whenever we have a valid date (for the range picker we update only the portion of the range that is valid).
   */
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
