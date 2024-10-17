import * as React from 'react';
import {
  FieldSectionType,
  FieldSelectedSections,
  MuiPickersAdapter,
  TimezoneProps,
  FieldSectionContentType,
  PickerValidDate,
  FieldRef,
  OnErrorProps,
  PickerAnyValueManagerV8,
  PickerManagerProperties,
  InferValueFromDate,
  InferFieldSection,
} from '../../../models';
import type { PickersSectionElement } from '../../../PickersSectionList';
import { ExportedUseClearableFieldProps } from '../../../hooks/useClearableField';

export interface UseFieldParameters<
  TManager extends PickerAnyValueManagerV8,
  TForwardedProps extends UseFieldForwardedProps<
    PickerManagerProperties<TManager>['enableAccessibleFieldDOMStructure']
  >,
> {
  valueManager: TManager;
  forwardedProps: TForwardedProps;
  internalProps: PickerManagerProperties<TManager>['internalProps'];
}

export interface UseFieldInternalProps<
  TDate extends PickerValidDate,
  TIsRange extends boolean,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TError,
> extends TimezoneProps,
    OnErrorProps<InferValueFromDate<TDate, TIsRange>, TError> {
  /**
   * The selected value.
   * Used when the component is controlled.
   */
  value?: InferValueFromDate<TDate, TIsRange>;
  /**
   * The default value. Use when the component is not controlled.
   */
  defaultValue?: InferValueFromDate<TDate, TIsRange>;
  /**
   * The date used to generate a part of the new value that is not present in the format when both `value` and `defaultValue` are empty.
   * For example, on time fields it will be used to determine the date to set.
   * @default The closest valid date using the validation props, except callbacks such as `shouldDisableDate`. Value is rounded to the most granular section used.
   */
  referenceDate?: TDate;
  /**
   * Callback fired when the value changes.
   * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
   * @template TError The validation error type. It will be either `string` or a `null`. It can be in `[start, end]` format in case of range value.
   * @param {TValue} value The new value.
   * @param {FieldChangeHandlerContext<TError>} context The context containing the validation result of the current value.
   */
  onChange?: FieldChangeHandler<InferValueFromDate<TDate, TIsRange>, TError>;
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
   * If `true`, the format will respect the leading zeroes (e.g: on dayjs, the format `M/D/YYYY` will render `8/16/2018`)
   * If `false`, the format will always add leading zeroes (e.g: on dayjs, the format `M/D/YYYY` will render `08/16/2018`)
   *
   * Warning n°1: Luxon is not able to respect the leading zeroes when using macro tokens (e.g: "DD"), so `shouldRespectLeadingZeros={true}` might lead to inconsistencies when using `AdapterLuxon`.
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
   * It prevents the user from changing the value of the field
   * (not from interacting with the field).
   * @default false
   */
  readOnly?: boolean;
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
  unstableFieldRef?: React.Ref<FieldRef<InferFieldSection<TIsRange>>>;
  /**
   * @default false
   */
  enableAccessibleFieldDOMStructure?: TEnableAccessibleFieldDOMStructure;
  /**
   * If `true`, the `input` element is focused during the first mount.
   * @default false
   */
  autoFocus?: boolean;
  /**
   * If `true`, the component is disabled.
   * @default false
   */
  disabled?: boolean;
}

export interface UseFieldInternalPropsFromManager<TManager extends PickerAnyValueManagerV8>
  extends UseFieldInternalProps<
    PickerManagerProperties<TManager>['date'],
    PickerManagerProperties<TManager>['isRange'],
    PickerManagerProperties<TManager>['enableAccessibleFieldDOMStructure'],
    PickerManagerProperties<TManager>['error']
  > {}

export interface UseFieldLegacyAdditionalProps
  extends Required<
    Pick<
      React.InputHTMLAttributes<HTMLInputElement>,
      'inputMode' | 'value' | 'onChange' | 'autoComplete'
    >
  > {
  enableAccessibleFieldDOMStructure: false;
  disabled: boolean;
  readOnly: boolean;
}

export interface UseFieldAccessibleAdditionalProps {
  enableAccessibleFieldDOMStructure: true;
  elements: PickersSectionElement[];
  tabIndex: number | undefined;
  contentEditable: boolean;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  areAllSectionsEmpty: boolean;
  disabled: boolean;
  readOnly: boolean;
}

export type UseFieldForwardedProps<TEnableAccessibleFieldDOMStructure extends boolean> =
  TEnableAccessibleFieldDOMStructure extends false
    ? UseFieldLegacyForwardedProps
    : UseFieldAccessibleForwardedProps;

export interface UseFieldLegacyForwardedProps extends ExportedUseClearableFieldProps {
  inputRef?: React.Ref<HTMLInputElement>;
  onBlur?: React.FocusEventHandler;
  onClick?: React.MouseEventHandler;
  onFocus?: React.FocusEventHandler;
  onPaste?: React.ClipboardEventHandler;
  onKeyDown?: React.KeyboardEventHandler;
  placeholder?: string;
  error?: boolean;
}

export interface UseFieldAccessibleForwardedProps extends ExportedUseClearableFieldProps {
  focused?: boolean;
  autoFocus?: boolean;
  error?: boolean;
  sectionListRef?: React.Ref<UseFieldAccessibleDOMGetters>;
  onBlur?: React.FocusEventHandler;
  onClick?: React.MouseEventHandler;
  onFocus?: React.FocusEventHandler;
  onInput?: React.FormEventHandler;
  onPaste?: React.ClipboardEventHandler;
  onKeyDown?: React.KeyboardEventHandler;
}

export type UseFieldResponse<
  TEnableAccessibleFieldDOMStructure extends boolean,
  TForwardedProps extends UseFieldForwardedProps<TEnableAccessibleFieldDOMStructure>,
> =
  // The forwarded props with a default value added
  Required<UseFieldForwardedProps<TEnableAccessibleFieldDOMStructure>> &
    // The other forwarded props
    Omit<TForwardedProps, keyof UseFieldForwardedProps<TEnableAccessibleFieldDOMStructure>> &
    // The additional props
    (TEnableAccessibleFieldDOMStructure extends false
      ? UseFieldLegacyAdditionalProps
      : UseFieldAccessibleAdditionalProps);

export type FieldSectionValueBoundaries<
  TDate extends PickerValidDate,
  SectionType extends FieldSectionType,
> = {
  minimum: number;
  maximum: number;
} & (SectionType extends 'day' ? { longestMonth: TDate } : {});

export type FieldSectionsValueBoundaries<TDate extends PickerValidDate> = {
  [SectionType in FieldSectionType]: (params: {
    currentDate: TDate | null;
    format: string;
    contentType: FieldSectionContentType;
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
interface FieldActiveDateManager<TDate extends PickerValidDate, TIsRange extends boolean> {
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
  getSections: (sections: InferFieldSection<TIsRange>[]) => InferFieldSection<TIsRange>[];
  /**
   * Creates the new value and reference value based on the new active date and the current state.
   * @template TValue, TDate
   * @param {TDate | null} newActiveDate The new value of the date containing the active section.
   * @returns {Pick<UseFieldState<TValue, any>, 'value' | 'referenceValue'>} The new value and reference value to publish and store in the state.
   */
  getNewValuesFromNewActiveDate: (newActiveDate: TDate | null) => {
    value: InferValueFromDate<TDate, TIsRange>;
    referenceValue: InferValueFromDate<TDate, TIsRange>;
  };
}

export type FieldParsedSelectedSections = number | 'all' | null;

export interface FieldValueManager<TDate extends PickerValidDate, TIsRange extends boolean> {
  /**
   * Creates the section list from the current value.
   * The `prevSections` are used on the range fields to avoid losing the sections of a partially filled date when editing the other date.
   * @template TValue, TDate, TSection
   * @param {MuiPickersAdapter<TDate>} utils The utils to manipulate the date.
   * @param {TValue} value The current value to generate sections from.
   * @param {TSection[] | null} fallbackSections The sections to use as a fallback if a date is null or invalid.
   * @param {(date: TDate) => FieldSection[]} getSectionsFromDate Returns the sections of the given date.
   * @returns {TSection[]}  The new section list.
   */
  getSectionsFromValue: (
    utils: MuiPickersAdapter<TDate>,
    value: InferValueFromDate<TDate, TIsRange>,
    fallbackSections: InferFieldSection<TIsRange>[] | null,
    getSectionsFromDate: (date: TDate) => InferFieldSection<TIsRange>[],
  ) => InferFieldSection<TIsRange>[];
  /**
   * Creates the string value to render in the input based on the current section list.
   * @template TSection
   * @param {TSection[]} sections The current section list.
   * @param {string} localizedDigits The conversion table from localized to 0-9 digits.
   * @param {boolean} isRtl `true` if the current orientation is "right to left"
   * @returns {string} The string value to render in the input.
   */
  getV6InputValueFromSections: (
    sections: InferFieldSection<TIsRange>[],
    localizedDigits: string[],
    isRtl: boolean,
  ) => string;
  /**
   * Creates the string value to render in the input based on the current section list.
   * @template TSection
   * @param {TSection[]} sections The current section list.
   * @returns {string} The string value to render in the input.
   */
  getV7HiddenInputValueFromSections: (sections: InferFieldSection<TIsRange>[]) => string;
  /**
   * Returns the manager of the active date.
   * @template TDate, TIsRange
   * @param {MuiPickersAdapter<TDate>} utils The utils to manipulate the date.
   * @param {UseFieldState<TValue, TSection>} state The current state of the field.
   * @param {TSection} activeSection The active section.
   * @returns {FieldActiveDateManager<TDate, TIsRange>} The manager of the active date.
   */
  getActiveDateManager: (
    utils: MuiPickersAdapter<TDate>,
    state: UseFieldState<PickerAnyValueManagerV8>,
    activeSection: InferFieldSection<TIsRange>,
  ) => FieldActiveDateManager<TDate, TIsRange>;
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
    referenceValue: InferValueFromDate<TDate, TIsRange>,
    parseDate: (dateStr: string, referenceDate: TDate) => TDate | null,
  ) => InferValueFromDate<TDate, TIsRange>;
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
    value: InferValueFromDate<TDate, TIsRange>,
    prevReferenceValue: InferValueFromDate<TDate, TIsRange>,
  ) => InferValueFromDate<TDate, TIsRange>;
}

export interface UseFieldState<TManager extends PickerAnyValueManagerV8> {
  value: PickerManagerProperties<TManager>['value'];
  /**
   * Non-nullable value used to keep trace of the timezone and the date parts not present in the format.
   * It is updated whenever we have a valid date (for the range picker we update only the portion of the range that is valid).
   */
  referenceValue: PickerManagerProperties<TManager>['value'];
  sections: PickerManagerProperties<TManager>['section'][];
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
   *
   * TODO v9: Remove
   */
  tempValueStrAndroid: string | null;
}

export type SectionOrdering = {
  /**
   * Returns the section on the left of provided section's index.
   * @param {number} index The section to get the section left of.
   * @returns {number | null} The index of the section on the left.
   */
  getSectionOnTheLeft: (index: number) => number | null;
  /**
   * Returns the section on the right of provided section's index.
   * @param {number} index The section to get the section right of.
   * @returns {number | null} The index of the section on the right.
   */
  getSectionOnTheRight: (index: number) => number | null;
  /**
   * Index of the section displayed on the far left
   */
  startIndex: number;
  /**
   * Index of the section displayed on the far right
   */
  endIndex: number;
};

export interface UseFieldDOMInteractions {
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

export interface UseFieldAccessibleDOMGetters {
  getRoot: () => HTMLElement;
  getSectionContainer: (sectionIndex: number) => HTMLElement;
  getSectionContent: (sectionIndex: number) => HTMLElement;
  getSectionIndexFromDOMElement: (element: Element | null | undefined) => number | null;
}
