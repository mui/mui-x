import * as React from 'react';
import { MuiDateSectionName, MuiPickersAdapter } from '../../models';
import type { PickerValueManager } from '../usePicker';
import { InferError, Validator } from '../validation/useValidation';
import { PickersLocaleText } from '../../../locales/utils/pickersLocaleTextApi';

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
  valueManager: PickerValueManager<TValue, TDate, InferError<TInternalProps>>;
  fieldValueManager: FieldValueManager<TValue, TDate, TSection, InferError<TInternalProps>>;
  validator: Validator<
    TValue,
    TDate,
    InferError<TInternalProps>,
    UseFieldValidationProps<TValue, TInternalProps>
  >;
  valueType: FieldValueType;
}

export interface UseFieldInternalProps<TValue, TError> {
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
  Pick<React.HTMLAttributes<HTMLInputElement>, 'autoCorrect' | 'inputMode'> & {
    ref: React.Ref<HTMLInputElement>;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    error: boolean;
    readOnly: boolean;
  };

export interface FieldSection {
  /**
   * Start index of the section in the format
   */
  start: number;
  /**
   * End index of the section in the format
   */
  end: number;
  /**
   * Start index of the section value in the input.
   * Takes into account invisible unicode characters such as \u2069 but does not include them
   */
  startInInput: number;
  /**
   * End index of the section value in the input.
   * Takes into account invisible unicode characters such as \u2069 but does not include them
   */
  endInInput: number;
  value: string;
  placeholder: string;
  /**
   * Separator displayed before the value of the section in the input.
   * If it contains escaped characters, then it must not have the escaping characters.
   * For example, on Day.js, the `year` section of the format `YYYY [year]` has an end separator equal to `year` not `[year]`
   */
  startSeparator: string;
  /**
   * Separator displayed after the value of the section in the input.
   * If it contains escaped characters, then it must not have the escaping characters.
   * For example, on Day.js, the `year` section of the format `[year] YYYY` has a start separator equal to `[year]`
   */
  endSeparator: string;
  dateSectionName: MuiDateSectionName;
  contentType: 'digit' | 'letter';
  formatValue: string;
  edited: boolean;
  hasTrailingZeroes: boolean;
}

export type FieldSectionWithoutPosition<TSection extends FieldSection = FieldSection> = Omit<
  TSection,
  'start' | 'end' | 'startInInput' | 'endInInput'
>;

export type FieldSectionsValueBoundaries<TDate> = Record<
  MuiDateSectionName,
  (params: { currentDate: TDate | null; format: string; contentType: 'digit' | 'letter' }) => {
    minimum: number;
    maximum: number;
  }
>;

export type FieldChangeHandler<TValue, TError> = (
  value: TValue,
  context: FieldChangeHandlerContext<TError>,
) => void;

export interface FieldChangeHandlerContext<TError> {
  validationError: TError;
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

export type FieldSelectedSections =
  | number
  | MuiDateSectionName
  | null
  | 'all'
  | { startIndex: number; endIndex: number };

export interface FieldValueManager<TValue, TDate, TSection extends FieldSection, TError> {
  /**
   * Creates the section list from the current value.
   * The `prevSections` are used on the range fields to avoid losing the sections of a partially filled date when editing the other date.
   * @template TValue, TDate, TSection
   * @param {MuiPickersAdapter<TDate>} utils The utils to manipulate the date.
   * @param {PickersLocaleText<TDate>} localeText The localization object to generate the placeholders.
   * @param {TSection[] | null} prevSections The last section list stored in state.
   * @param {TValue} value The current value to generate sections from.
   * @param {string} format The date format.
   * @returns {TSection[]}  The new section list.
   */
  getSectionsFromValue: (
    utils: MuiPickersAdapter<TDate>,
    localeText: PickersLocaleText<TDate>,
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
   * @param {MuiPickersAdapter<TDate>} utils The utils to manipulate the date.
   * @param {UseFieldState<TValue, TSection>} state The current state of the field.
   * @param {TSection} activeSection The active section.
   * @returns {FieldActiveDateManager<TValue, TDate>} The manager of the active date.
   */
  getActiveDateManager: (
    utils: MuiPickersAdapter<TDate>,
    state: UseFieldState<TValue, TSection>,
    activeSection: TSection,
  ) => FieldActiveDateManager<TValue, TDate>;
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
  /**
   * Checks if the current error is empty or not.
   * @template TError
   * @param {TError} error The current error.
   * @returns {boolean} `true` if the current error is not empty.
   */
  hasError: (error: TError) => boolean;
  /**
   * Return a description of sections display order. This description is useful in RTL mode.
   * @template TDate
   * @param {MuiPickersAdapter<TDate>} utils The utils to manipulate the date.
   * @param {PickersLocaleText<TDate>} localeText The translation object.
   * @param {string} format The format from which sections are computed.
   * @param {boolean} isRTL Is the field in right-to-left orientation.
   * @returns {SectionOrdering} The description of sections order from left to right.
   */
  getSectionOrder: (
    utils: MuiPickersAdapter<TDate>,
    localeText: PickersLocaleText<TDate>,
    format: string,
    isRTL: boolean,
  ) => SectionOrdering;
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
