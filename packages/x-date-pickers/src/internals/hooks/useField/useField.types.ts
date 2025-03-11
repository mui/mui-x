import * as React from 'react';
import {
  FieldSectionType,
  FieldSection,
  FieldSelectedSections,
  MuiPickersAdapter,
  TimezoneProps,
  FieldSectionContentType,
  PickerValidDate,
  FieldRef,
  OnErrorProps,
  InferError,
  InferFieldSection,
  PickerValueType,
} from '../../../models';
import type { PickerValueManager } from '../../models';
import type { Validator } from '../../../validation';
import type { UseFieldStateResponse } from './useFieldState';
import type { UseFieldCharacterEditingResponse } from './useFieldCharacterEditing';
import { PickersSectionElement, PickersSectionListRef } from '../../../PickersSectionList';
import { FormProps, InferNonNullablePickerValue, PickerValidValue } from '../../models';
import type { ExportedPickerFieldUIProps } from '../../components/PickerFieldUI';

export interface UseFieldParams<
  TValue extends PickerValidValue,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TForwardedProps extends UseFieldCommonForwardedProps &
    UseFieldForwardedProps<TEnableAccessibleFieldDOMStructure>,
  TInternalProps extends UseFieldInternalProps<TValue, TEnableAccessibleFieldDOMStructure, any>,
> {
  forwardedProps: TForwardedProps;
  internalProps: TInternalProps;
  valueManager: PickerValueManager<TValue, InferError<TInternalProps>>;
  fieldValueManager: FieldValueManager<TValue>;
  validator: Validator<TValue, InferError<TInternalProps>, TInternalProps>;
  valueType: PickerValueType;
  getOpenPickerButtonAriaLabel: (value: TValue) => string;
}

export interface UseFieldInternalProps<
  TValue extends PickerValidValue,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TError,
> extends TimezoneProps,
    FormProps,
    OnErrorProps<TValue, TError> {
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
   * The date used to generate a part of the new value that is not present in the format when both `value` and `defaultValue` are empty.
   * For example, on time fields it will be used to determine the date to set.
   * @default The closest valid date using the validation props, except callbacks such as `shouldDisableDate`. Value is rounded to the most granular section used.
   */
  referenceDate?: PickerValidDate;
  /**
   * Callback fired when the value changes.
   * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
   * @template TError The validation error type. It will be either `string` or a `null`. It can be in `[start, end]` format in case of range value.
   * @param {TValue} value The new value.
   * @param {FieldChangeHandlerContext<TError>} context The context containing the validation result of the current value.
   */
  onChange?: FieldChangeHandler<TValue, TError>;
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
   * If `true`, the format will respect the leading zeroes (for example on dayjs, the format `M/D/YYYY` will render `8/16/2018`)
   * If `false`, the format will always add leading zeroes (for example on dayjs, the format `M/D/YYYY` will render `08/16/2018`)
   *
   * Warning n°1: Luxon is not able to respect the leading zeroes when using macro tokens (for example "DD"), so `shouldRespectLeadingZeros={true}` might lead to inconsistencies when using `AdapterLuxon`.
   *
   * Warning n°2: When `shouldRespectLeadingZeros={true}`, the field will add an invisible character on the sections containing a single digit to make sure `onChange` is fired.
   * If you need to get the clean value from the input, you can remove this character using `input.value.replace(/\u200e/g, '')`.
   *
   * Warning n°3: When used in strict mode, dayjs and moment require to respect the leading zeros.
   * This mean that when using `shouldRespectLeadingZeros={false}`, if you retrieve the value directly from the input (not listening to `onChange`) and your format contains tokens without leading zeros, the value will not be parsed by your library.
   *
   * @default false
   */
  shouldRespectLeadingZeros?: boolean;
  /**
   * The currently selected sections.
   * This prop accepts four formats:
   * 1. If a number is provided, the section at this index will be selected.
   * 2. If a string of type `FieldSectionType` is provided, the first section with that name will be selected.
   * 3. If `"all"` is provided, all the sections will be selected.
   * 4. If `null` is provided, no section will be selected.
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
  unstableFieldRef?: React.Ref<FieldRef<TValue>>;
  /**
   * @default true
   */
  enableAccessibleFieldDOMStructure?: TEnableAccessibleFieldDOMStructure;
  /**
   * If `true`, the `input` element is focused during the first mount.
   * @default false
   */
  autoFocus?: boolean;
  /**
   * If `true`, the component is displayed in focused state.
   */
  focused?: boolean;
}

export interface UseFieldCommonAdditionalProps
  extends Required<
    Pick<UseFieldInternalProps<any, any, any>, 'disabled' | 'readOnly' | 'autoFocus'>
  > {
  /**
   * The aria label to set on the button that opens the picker.
   */
  openPickerAriaLabel: string;
}

export interface UseFieldCommonForwardedProps
  extends Pick<ExportedPickerFieldUIProps, 'clearable' | 'onClear'> {
  onKeyDown?: React.KeyboardEventHandler;
  error?: boolean;
}

export type UseFieldForwardedProps<TEnableAccessibleFieldDOMStructure extends boolean> =
  UseFieldCommonForwardedProps &
    (TEnableAccessibleFieldDOMStructure extends false
      ? UseFieldV6ForwardedProps
      : UseFieldV7ForwardedProps);

export interface UseFieldV6ForwardedProps {
  inputRef?: React.Ref<HTMLInputElement>;
  onBlur?: React.FocusEventHandler;
  onClick?: React.MouseEventHandler;
  onFocus?: React.FocusEventHandler;
  onPaste?: React.ClipboardEventHandler<HTMLDivElement>;
  placeholder?: string;
}

interface UseFieldV6AdditionalProps
  extends Required<
    Pick<
      React.InputHTMLAttributes<HTMLInputElement>,
      'inputMode' | 'placeholder' | 'value' | 'onChange' | 'autoComplete'
    >
  > {
  enableAccessibleFieldDOMStructure: false;
  focused?: boolean;
}

export interface UseFieldV7ForwardedProps {
  focused?: boolean;
  sectionListRef?: React.Ref<PickersSectionListRef>;
  onBlur?: React.FocusEventHandler;
  onClick?: React.MouseEventHandler;
  onFocus?: React.FocusEventHandler;
  onInput?: React.FormEventHandler<HTMLDivElement>;
  onPaste?: React.ClipboardEventHandler<HTMLDivElement>;
}

interface UseFieldV7AdditionalProps {
  enableAccessibleFieldDOMStructure: true;
  elements: PickersSectionElement[];
  tabIndex: number | undefined;
  contentEditable: boolean;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  areAllSectionsEmpty: boolean;
  focused: boolean;
}

export type UseFieldResponse<
  TEnableAccessibleFieldDOMStructure extends boolean,
  TForwardedProps extends UseFieldCommonForwardedProps & { [key: string]: any },
> = Omit<TForwardedProps, keyof UseFieldCommonForwardedProps> &
  Required<UseFieldCommonForwardedProps> &
  UseFieldCommonAdditionalProps &
  (TEnableAccessibleFieldDOMStructure extends false
    ? UseFieldV6AdditionalProps & Required<UseFieldV6ForwardedProps>
    : UseFieldV7AdditionalProps & Required<UseFieldV7ForwardedProps>);

export type FieldSectionValueBoundaries<SectionType extends FieldSectionType> = {
  minimum: number;
  maximum: number;
} & (SectionType extends 'day' ? { longestMonth: PickerValidDate } : {});

export type FieldSectionsValueBoundaries = {
  [SectionType in FieldSectionType]: (params: {
    currentDate: PickerValidDate | null;
    format: string;
    contentType: FieldSectionContentType;
  }) => FieldSectionValueBoundaries<SectionType>;
};

export type FieldSectionsBoundaries = {
  [SectionType in FieldSectionType]: {
    minimum: number;
    maximum: number;
  };
};

export type FieldChangeHandler<TValue extends PickerValidValue, TError> = (
  value: TValue,
  context: FieldChangeHandlerContext<TError>,
) => void;

export interface FieldChangeHandlerContext<TError> {
  validationError: TError;
}

export type FieldParsedSelectedSections = number | 'all' | null;

export interface FieldValueManager<TValue extends PickerValidValue> {
  /**
   * Creates the section list from the current value.
   * The `prevSections` are used on the range fields to avoid losing the sections of a partially filled date when editing the other date.
   * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
   * @param {TValue} value The current value to generate sections from.
   * @param {(date: PickerValidDate | null) => FieldSection[]} getSectionsFromDate Returns the sections of the given date.
   * @returns {InferFieldSection<TValue>[]}  The new section list.
   */
  getSectionsFromValue: (
    value: TValue,
    getSectionsFromDate: (date: PickerValidDate | null) => FieldSection[],
  ) => InferFieldSection<TValue>[];
  /**
   * Creates the string value to render in the input based on the current section list.
   * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
   * @param {InferFieldSection<TValue>[]} sections The current section list.
   * @param {string} localizedDigits The conversion table from localized to 0-9 digits.
   * @param {boolean} isRtl `true` if the current orientation is "right to left"
   * @returns {string} The string value to render in the input.
   */
  getV6InputValueFromSections: (
    sections: InferFieldSection<TValue>[],
    localizedDigits: string[],
    isRtl: boolean,
  ) => string;
  /**
   * Creates the string value to render in the input based on the current section list.
   * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
   * @param {InferFieldSection<TValue>[]} sections The current section list.
   * @returns {string} The string value to render in the input.
   */
  getV7HiddenInputValueFromSections: (sections: InferFieldSection<TValue>[]) => string;
  /**
   * Parses a string version (most of the time coming from the input).
   * This method should only be used when the change does not come from a single section.
   * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
   * @param {string} valueStr The string value to parse.
   * @param {TValue} referenceValue The reference value currently stored in state.
   * @param {(dateStr: string, referenceDate: PickerValidDate) => PickerValidDate | null} parseDate A method to convert a string date into a parsed one.
   * @returns {TValue} The new parsed value.
   */
  parseValueStr: (
    valueStr: string,
    referenceValue: InferNonNullablePickerValue<TValue>,
    parseDate: (dateStr: string, referenceDate: PickerValidDate) => PickerValidDate | null,
  ) => TValue;
  /**
   * Update the reference value with the new value.
   * This method must make sure that no date inside the returned `referenceValue` is invalid.
   * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
   * @param {MuiPickersAdapter} utils The utils to manipulate the date.
   * @param {TValue} value The new value from which we want to take all valid dates in the `referenceValue` state.
   * @param {TValue} prevReferenceValue The previous reference value. It is used as a fallback for invalid dates in the new value.
   * @returns {TValue} The new reference value with no invalid date.
   */
  updateReferenceValue: (
    utils: MuiPickersAdapter,
    value: TValue,
    prevReferenceValue: InferNonNullablePickerValue<TValue>,
  ) => InferNonNullablePickerValue<TValue>;
  /**
   * Extract from the given value the date that contains the given section.
   * @param {TValue} value The value to extract the date from.
   * @param {InferFieldSection<TValue>} section The section to get the date from.
   * @returns {PickerValidDate | null} The date that contains the section.
   */
  getDateFromSection: (value: TValue, section: InferFieldSection<TValue>) => PickerValidDate | null;
  /**
   * Get the sections of the date that contains the given section.
   * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
   * @param  {InferFieldSection<TValue>[]} sections The sections of the full value.
   * @param {InferFieldSection<TValue>} section A section of the date from which we want to get all the sections.
   * @returns {InferFieldSection<TValue>[]} The sections of the date that contains the section.
   */
  getDateSectionsFromValue: (
    sections: InferFieldSection<TValue>[],
    section: InferFieldSection<TValue>,
  ) => InferFieldSection<TValue>[];
  /**
   * Creates a new value based on the provided date and the current value.
   * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
   * @param {TValue} value The value to update the date in.
   * @param {InferFieldSection<TValue>} section A section of the date we want to update in the value.
   * @param {PickerValidDate | null} date The date that contains the section.
   * @returns {TValue} The updated value.
   */
  updateDateInValue: (
    value: TValue,
    section: InferFieldSection<TValue>,
    date: PickerValidDate | null,
  ) => TValue;
  /**
   * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
   * @param {InferFieldSection<TValue>[]} sections The sections of the full value.
   * @param {InferFieldSection<TValue>} section A section of the date from which we want to clear all the sections.
   * @returns {InferFieldSection<TValue>[]} The sections of the full value with all the sections of the target date cleared.
   */
  clearDateSections: (
    sections: InferFieldSection<TValue>[],
    section: InferFieldSection<TValue>,
  ) => InferFieldSection<TValue>[];
}

export interface UseFieldState<TValue extends PickerValidValue> {
  /**
   * Last value returned by `useControlledValueWithTimezone`.
   */
  lastValue: TValue | undefined;
  /**
   * Last value of the parameters used to generate the sections.
   */
  lastSectionsDependencies: { format: string; isRtl: boolean; locale: any };
  /**
   * Non-nullable value used to keep trace of the timezone and the date parts not present in the format.
   * It is updated whenever we have a valid date (for the range picker we update only the portion of the range that is valid).
   */
  referenceValue: InferNonNullablePickerValue<TValue>;
  sections: InferFieldSection<TValue>[];
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

export interface UseFieldTextFieldInteractions {
  /**
   * Select the correct sections in the DOM according to the sections currently selected in state.
   */
  syncSelectionToDOM: () => void;
  /**
   * Returns the index of the active section (the first focused section).
   * If no section is active, returns `null`.
   * @returns {number | null} The index of the active section.
   */
  getActiveSectionIndexFromDOM: () => number | null;
  /**
   * Focuses the field.
   * @param {number | FieldSectionType} newSelectedSection The section to select once focused.
   */
  focusField: (newSelectedSection?: number | FieldSectionType) => void;
  setSelectedSections: (newSelectedSections: FieldSelectedSections) => void;
  isFieldFocused: () => boolean;
}

export type UseFieldTextField<TEnableAccessibleFieldDOMStructure extends boolean> = <
  TValue extends PickerValidValue,
  TForwardedProps extends TEnableAccessibleFieldDOMStructure extends false
    ? UseFieldV6ForwardedProps
    : UseFieldV7ForwardedProps,
  TInternalProps extends UseFieldInternalProps<TValue, TEnableAccessibleFieldDOMStructure, any> & {
    minutesStep?: number;
  },
>(
  params: UseFieldTextFieldParams<
    TValue,
    TEnableAccessibleFieldDOMStructure,
    TForwardedProps,
    TInternalProps
  >,
) => {
  interactions: UseFieldTextFieldInteractions;
  returnedValue: TEnableAccessibleFieldDOMStructure extends false
    ? UseFieldV6AdditionalProps & Required<UseFieldV6ForwardedProps>
    : UseFieldV7AdditionalProps & Required<UseFieldV7ForwardedProps>;
};

interface UseFieldTextFieldParams<
  TValue extends PickerValidValue,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TForwardedProps extends TEnableAccessibleFieldDOMStructure extends false
    ? UseFieldV6ForwardedProps
    : UseFieldV7ForwardedProps,
  TInternalProps extends UseFieldInternalProps<TValue, TEnableAccessibleFieldDOMStructure, any>,
> extends UseFieldParams<
      TValue,
      TEnableAccessibleFieldDOMStructure,
      TForwardedProps,
      TInternalProps
    >,
    UseFieldStateResponse<TValue>,
    UseFieldCharacterEditingResponse {
  areAllSectionsEmpty: boolean;
  sectionOrder: SectionOrdering;
}
