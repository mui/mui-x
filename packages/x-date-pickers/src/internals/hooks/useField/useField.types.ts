import * as React from 'react';
import {
  FieldSectionType,
  FieldSection,
  FieldSelectedSections,
  MuiPickersAdapter,
} from '../../../models';
import type { PickerValueManager } from '../usePicker';
import { InferError, Validator } from '../validation/useValidation';

export interface UseFieldParams<
  TValue,
  TDate,
  TSection extends FieldSection,
  TForwardedProps extends UseFieldForwardedProps,
  TInternalProps extends UseFieldInternalProps<any, any, any>,
> {
  inputRef?: React.Ref<HTMLInputElement>;
  forwardedProps: TForwardedProps;
  internalProps: TInternalProps;
  valueManager: PickerValueManager<TValue, TDate, InferError<TInternalProps>>;
  fieldValueManager: FieldValueManager<TValue, TDate, TSection>;
  validator: Validator<
    TValue,
    TDate,
    InferError<TInternalProps>,
    UseFieldValidationProps<TValue, TInternalProps>
  >;
  valueType: FieldValueType;
}

export interface UseFieldInternalProps<TValue, TSection extends FieldSection, TError> {
  /**
   * The selected value.
   * Used when the component is controlled.
   */
  value?: TValue;
  /**
   * The default value. Use when the component is not controlled.
   */
  defaultValue?: TValue;
  /**
   * Callback fired when the value changes.
   * @template TValue The value type. Will be either the same type as `value` or `null`. Can be in `[start, end]` format in case of range value.
   * @template TError The validation error type. Will be either `string` or a `null`. Can be in `[start, end]` format in case of range value.
   * @param {TValue} value The new value.
   * @param {FieldChangeHandlerContext<TError>} context The context containing the validation result of the current value.
   */
  onChange?: FieldChangeHandler<TValue, TError>;
  /**
   * Callback fired when the error associated to the current value changes.
   * @template TValue The value type. Will be either the same type as `value` or `null`. Can be in `[start, end]` format in case of range value.
   * @template TError The validation error type. Will be either `string` or a `null`. Can be in `[start, end]` format in case of range value.
   * @param {TError} error The new error.
   * @param {TValue} value The value associated to the error.
   */
  onError?: (error: TError, value: TValue) => void;
  /**
   * Format of the date when rendered in the input(s).
   */
  format: string;
  /**
   * Density of the format when rendered in the input.
   * Setting `formatDensity` to `"spacious"` will add a space before and after each `/`, `-` and `.` character.
   * @default "dense"
   */
  formatDensity?: 'dense' | 'spacious';
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
   * 3. If a string of type `FieldSectionType` is provided, the first section with that name will be selected.
   * 4. If `null` is provided, no section will be selected
   * If not provided, the selected sections will be handled internally.
   */
  selectedSections?: FieldSelectedSections;
  /**
   * Callback fired when the selected sections change.
   * @param {FieldSelectedSections} newValue The new selected sections.
   */
  onSelectedSectionsChange?: (newValue: FieldSelectedSections) => void;
  /**
   * The ref object used to imperatively interact with the field.
   */
  unstableFieldRef?: React.Ref<FieldRef<TSection>>;
}

export interface FieldRef<TSection extends FieldSection> {
  /**
   * Returns the sections of the current value.
   * @returns {TSection[]} The sections of the current value.
   */
  getSections: () => TSection[];
  /**
   * Returns the index of the active section (the first focused section).
   * If no section is active, returns `null`.
   * @returns {number | null} The index of the active section.
   */
  getActiveSectionIndex: () => number | null;
  /**
   * Updates the selected sections.
   * @param {FieldSelectedSections} selectedSections The sections to select.
   */
  setSelectedSections: (selectedSections: FieldSelectedSections) => void;
}

export interface UseFieldForwardedProps {
  onKeyDown?: React.KeyboardEventHandler;
  onMouseUp?: React.MouseEventHandler;
  onPaste?: React.ClipboardEventHandler<HTMLInputElement>;
  onClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  error?: boolean;
}

export type UseFieldResponse<TForwardedProps extends UseFieldForwardedProps> = Omit<
  TForwardedProps,
  keyof UseFieldForwardedProps
> &
  Required<UseFieldForwardedProps> &
  Pick<React.HTMLAttributes<HTMLInputElement>, 'autoCorrect' | 'inputMode' | 'placeholder'> & {
    ref: React.Ref<HTMLInputElement>;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    error: boolean;
    readOnly: boolean;
    autoComplete: 'off';
  };

export type FieldSectionWithoutPosition<TSection extends FieldSection = FieldSection> = Omit<
  TSection,
  'start' | 'end' | 'startInInput' | 'endInInput'
>;

export type FieldSectionValueBoundaries<TDate, SectionType extends FieldSectionType> = {
  minimum: number;
  maximum: number;
} & (SectionType extends 'day' ? { longestMonth: TDate } : {});

export type FieldSectionsValueBoundaries<TDate> = {
  [SectionType in FieldSectionType]: (params: {
    currentDate: TDate | null;
    format: string;
    contentType: 'digit' | 'letter';
  }) => FieldSectionValueBoundaries<TDate, SectionType>;
};

export type FieldChangeHandler<TValue, TError> = (
  value: TValue,
  context: FieldChangeHandlerContext<TError>,
) => void;

export interface FieldChangeHandlerContext<TError> {
  validationError: TError;
}

/**
 * Object used to access and update the active date (i.e: the date containing the active section).
 * Mainly useful in the range fields where we need to update the date containing the active section without impacting the other one.
 */
interface FieldActiveDateManager<TValue, TDate, TSection extends FieldSection> {
  /**
   * Active date from `state.value`.
   */
  date: TDate | null;
  /**
   * Active date from the `state.referenceValue`.
   */
  referenceDate: TDate;
  /**
   * @template TSection
   * @param  {TSection[]} sections The sections of the full value.
   * @returns {TSection[]} The sections of the active date.
   * Get the sections of the active date.
   */
  getSections: (sections: TSection[]) => TSection[];
  /**
   * Creates the new value and reference value based on the new active date and the current state.
   * @template TValue, TDate
   * @param {TDate | null} newActiveDate The new value of the date containing the active section.
   * @returns {Pick<UseFieldState<TValue, any>, 'value' | 'referenceValue'>} The new value and reference value to publish and store in the state.
   */
  getNewValuesFromNewActiveDate: (
    newActiveDate: TDate | null,
  ) => Pick<UseFieldState<TValue, any>, 'value' | 'referenceValue'>;
}

export type FieldSelectedSectionsIndexes = {
  startIndex: number;
  endIndex: number;
  /**
   * If `true`, the selectors at the very beginning and very end of the input will be selected.
   * @default false
   */
  shouldSelectBoundarySelectors?: boolean;
};

export interface FieldValueManager<TValue, TDate, TSection extends FieldSection> {
  /**
   * Creates the section list from the current value.
   * The `prevSections` are used on the range fields to avoid losing the sections of a partially filled date when editing the other date.
   * @template TValue, TDate, TSection
   * @param {MuiPickersAdapter<TDate>} utils The utils to manipulate the date.
   * @param {TValue} value The current value to generate sections from.
   * @param {TSection[] | null} fallbackSections The sections to use as a fallback if a date is null or invalid.
   * @param {boolean} isRTL `true` if the direction is "right to left".
   * @param {(date: TDate) => FieldSectionWithoutPosition[]} getSectionsFromDate Returns the sections of the given date.
   * @returns {TSection[]}  The new section list.
   */
  getSectionsFromValue: (
    utils: MuiPickersAdapter<TDate>,
    value: TValue,
    fallbackSections: TSection[] | null,
    isRTL: boolean,
    getSectionsFromDate: (date: TDate) => FieldSectionWithoutPosition[],
  ) => TSection[];
  /**
   * Creates the string value to render in the input based on the current section list.
   * @template TSection
   * @param {TSection[]} sections The current section list.
   * @param {boolean} isRTL `true` is the current orientation is "right to left"
   * @returns {string} The string value to render in the input.
   */
  getValueStrFromSections: (sections: TSection[], isRTL: boolean) => string;
  /**
   * Returns the manager of the active date.
   * @template TValue, TDate, TSection
   * @param {MuiPickersAdapter<TDate>} utils The utils to manipulate the date.
   * @param {UseFieldState<TValue, TSection>} state The current state of the field.
   * @param {TSection} activeSection The active section.
   * @returns {FieldActiveDateManager<TValue, TDate, TSection>} The manager of the active date.
   */
  getActiveDateManager: (
    utils: MuiPickersAdapter<TDate>,
    state: UseFieldState<TValue, TSection>,
    activeSection: TSection,
  ) => FieldActiveDateManager<TValue, TDate, TSection>;
  /**
   * Parses a string version (most of the time coming from the input).
   * This method should only be used when the change does not come from a single section.
   * @template TValue, TDate
   * @param {string} valueStr The string value to parse.
   * @param {TValue} referenceValue The reference value currently stored in state.
   * @param {(dateStr: string, referenceDate: TDate) => TDate | null} parseDate A method to convert a string date into a parsed one.
   * @returns {TValue} The new parsed value.
   */
  parseValueStr: (
    valueStr: string,
    referenceValue: TValue,
    parseDate: (dateStr: string, referenceDate: TDate) => TDate | null,
  ) => TValue;
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
    utils: MuiPickersAdapter<TDate>,
    value: TValue,
    prevReferenceValue: TValue,
  ) => TValue;
}

export interface UseFieldState<TValue, TSection extends FieldSection> {
  value: TValue;
  /**
   * Non-nullable value used to keep trace of the timezone and the date parts not present in the format.
   * It is updated whenever we have a valid date (for the range picker we update only the portion of the range that is valid).
   */
  referenceValue: TValue;
  sections: TSection[];
  /**
   * Android `onChange` behavior when the input selection is not empty is quite different from a desktop behavior.
   * There are two `onChange` calls:
   * 1. A call with the selected content removed.
   * 2. A call with the key pressed added to the value.
   **
   * For instance, if the input value equals `month / day / year` and `day` is selected.
   * The pressing `1` will have the following behavior:
   * 1. A call with `month /  / year`.
   * 2. A call with `month / 1 / year`.
   *
   * But if you don't update the input with the value passed on the first `onChange`.
   * Then the second `onChange` will add the key press at the beginning of the selected value.
   * 1. A call with `month / / year` that we don't set into state.
   * 2. A call with `month / 1day / year`.
   *
   * The property below allows us to set the first `onChange` value into state waiting for the second one.
   */
  tempValueStrAndroid: string | null;
}

export type UseFieldValidationProps<
  TValue,
  TInternalProps extends { value?: TValue; defaultValue?: TValue },
> = Omit<TInternalProps, 'value' | 'defaultValue'> & { value: TValue };

export type AvailableAdjustKeyCode =
  | 'ArrowUp'
  | 'ArrowDown'
  | 'PageUp'
  | 'PageDown'
  | 'Home'
  | 'End';

export type FieldValueType = 'date' | 'time' | 'date-time';

export type SectionNeighbors = {
  [sectionIndex: number]: {
    /**
     * Index of the next section displayed on the left. `null` if it's the leftmost section.
     */
    leftIndex: number | null;
    /**
     * Index of the next section displayed on the right. `null` if it's the rightmost section.
     */
    rightIndex: number | null;
  };
};

export type SectionOrdering = {
  /**
   * For each section index provide the index of the section displayed on the left and on the right.
   */
  neighbors: SectionNeighbors;
  /**
   * Index of the section displayed on the far left
   */
  startIndex: number;
  /**
   * Index of the section displayed on the far right
   */
  endIndex: number;
};
