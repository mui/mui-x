import * as React from 'react';
import { MuiDateSectionName, MuiPickersAdapter } from '../../models';
import { PickerStateValueManager } from '../usePickerState';
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
  valueManager: PickerStateValueManager<TValue, TDate, InferError<TInternalProps>>;
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
   * @template TValue, TError
   * @param {TValue} value The new value.
   * @param {FieldChangeHandlerContext<TError>} The context containing the validation result of the current value.
   */
  onChange?: FieldChangeHandler<TValue, TError>;
  /**
   * Callback fired when the error associated to the current value changes.
   * @template TValue, TError
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
  onClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
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
   * Separator used in the input.
   * If it contains escaped characters, then it must not have the escaping characters.
   * For example, on Day.js, the `year` section of the format `YYYY [year]` has a `separator` equal to `year` not `[year]`
   */
  separator: string | null;
  dateSectionName: MuiDateSectionName;
  contentType: 'digit' | 'letter';
  formatValue: string;
  edited: boolean;
  hasTrailingZeroes: boolean;
  /**
   * If `true`, the start separator will be rendered just before this section.
   * @default false
   */
  hasStartSeparator?: boolean;
}

export type FieldBoundaries<TDate, TSection extends FieldSection> = Record<
  Exclude<MuiDateSectionName, 'empty'>,
  (currentDate: TDate | null, section: TSection) => { minimum: number; maximum: number }
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
   * @param {PickersLocaleText<TDate>} localeText The localization object to generate the placeholders.
   * @param {TSection[] | null} prevSections The last section list stored in state.
   * @param {TValue} value The current value to generate sections from.
   * @param {string} format The date format.
   * @returns {Pick<UseFieldState<TValue, TSection>, 'sections' | 'startSeparator'>}  The new section list and the start separator.
   */
  getSectionsFromValue: (
    utils: MuiPickersAdapter<TDate>,
    localeText: PickersLocaleText<TDate>,
    prevSections: TSection[] | null,
    value: TValue,
    format: string,
  ) => Pick<UseFieldState<TValue, TSection>, 'sections' | 'startSeparator'>;
  /**
   * Creates the string value to render in the input based on the current section list.
   * @template TSection
   * @param {TSection[]} sections The current section list.
   * @param {string} startSeparator The separator to insert before the first section.
   * @returns {string} The string value to render in the input.
   */
  getValueStrFromSections: (sections: TSection[], startSeparator: string) => string;
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
   * Return a description of sections display order. This description is usefull in RTL mode.
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
   * The separator to insert before the first section.
   * If it contains escaped characters, then it must not have the escaping characters.
   * For example, on Day.js, the format `[Current year:] YYYY` has a `startSeparator` equal to `Current year:` not `[Current year:]`
   */
  startSeparator: string;

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
