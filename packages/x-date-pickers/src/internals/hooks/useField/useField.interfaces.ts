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
  inputRef?: React.Ref<HTMLInputElement>;
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
  supportedDateSections: MuiDateSectionName[];
}

export interface UseFieldInternalProps<TValue, TError> {
  value?: TValue;
  onChange?: (value: TValue) => void;
  onError?: (error: TError, value: TValue) => void;
  /**
   * The default value. Use when the component is not controlled.
   */
  defaultValue?: TValue;
  format: string;
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
  selectedSections?: FieldSelectedSections;
  /**
   * Callback fired when the selected sections change.
   * @param {FieldSelectedSections} newValue The new selected sections.
   */
  onSelectedSectionsChange?: (newValue: FieldSelectedSections) => void;
}

export interface UseFieldForwardedProps {
  onKeyDown?: React.KeyboardEventHandler;
  onMouseUp?: React.MouseEventHandler;
  onClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export type UseFieldResponse<TForwardedProps extends UseFieldForwardedProps> = Omit<
  TForwardedProps,
  keyof UseFieldForwardedProps
> &
  Required<UseFieldForwardedProps> & {
    ref: React.Ref<HTMLInputElement>;
    value: string;
    onChange: () => void;
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
  /**
   * Creates a value with an invalid active date (represented by a `null`) without losing any other date on the range fields.
   * @template TValue
   * @returns {TValue} The value containing the invalid date.
   */
  setActiveDateAsInvalid: () => TValue;
}

export type FieldSelectedSectionsIndexes = { startIndex: number; endIndex: number };

export type FieldSelectedSections =
  | number
  | FieldSelectedSectionsIndexes
  | MuiDateSectionName
  | null;

export interface FieldValueManager<TValue, TDate, TSection extends FieldSection, TError> {
  /**
   * Creates the section list from the current value.
   * The `prevSections` are used on the range fields to avoid losing the sections of a partially filled date when editing the other date.
   * @template TValue, TDate, TSection
   * @param {MuiPickersAdapter<TDate>} utils The utils to manipulate the date.
   * @param {TSection[] | null} prevSections The last section list stored in state.
   * @param {TValue} value The current value to generate sections from.
   * @param {string} format The date format.
   * @returns {TSection[]}  The new section list.
   */
  getSectionsFromValue: (
    utils: MuiPickerFieldAdapter<TDate>,
    prevSections: TSection[] | null,
    value: TValue,
    format: string,
  ) => TSection[];
  /**
   * Creates the string value to render in the input based on the current section list.
   * @template TSection
   * @param {TSection[]} sections The current section list.
   * @returns {string} The string value to render in the input.
   */
  getValueStrFromSections: (sections: TSection[]) => string;
  /**
   * Filter the section list to only keep the sections in the same date as the active section.
   * On a single date field does nothing.
   * On a range date range, returns the sections of the start date if editing the start date and the end date otherwise.
   * @template TSection
   * @param {TSection[]} sections The full section list.
   * @param {TSection} activeSection The active section.
   * @returns {TSection[]} The sections in the same date as the active section.
   */
  getActiveDateSections: (sections: TSection[], activeSection: TSection) => TSection[];
  /**
   * Returns the manager of the active date.
   * @template TValue, TDate, TSection
   * @param {UseFieldState<TValue, TSection>} state The current state of the field.
   * @param {TSection} activeSection The active section.
   * @returns {FieldActiveDateManager<TValue, TDate>} The manager of the active date.
   */
  getActiveDateManager: (
    state: UseFieldState<TValue, TSection>,
    activeSection: TSection,
  ) => FieldActiveDateManager<TValue, TDate>;
  /**
   * Update the reference value with the new value.
   * This method must make sure that no date inside the returned `referenceValue` is invalid.
   * @template TValue, TDate
   * @param {MuiPickersAdapter<TDate>} utils The utils to manipulate the date.
   * @param {TValue} value The new value from which we want to take all valid dates in the `referenceValue` state.
   * @param {TValue} prevReferenceValue The previous reference value. It is used as a fallback for invalid dates in the new value.
   * @returns {TValue} The new reference value with no invalid date.
   */
  updateReferenceValue: (
    utils: MuiPickerFieldAdapter<TDate>,
    value: TValue,
    prevReferenceValue: TValue,
  ) => TValue;
  /**
   * Checks if the current error is empty or not.
   * @template TError
   * @param {TError} error The current error.
   * @returns {boolean} `true` if the current error is not empty.
   */
  hasError: (error: TError) => boolean;
  /**
   * Compare two errors to know if they are equal.
   * @template TError
   * @param {TError} error The new error
   * @param {TError | null} prevError The previous error
   * @returns {boolean} `true` if the new error is different from the previous one.
   */
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
