import { FieldChangeHandlerContext, UseFieldInternalProps } from '../useField';
import { Validator } from '../../../validation';
import { WrapperVariant } from '../../models/common';
import {
  FieldValueType,
  TimezoneProps,
  MuiPickersAdapter,
  PickersTimezone,
  PickerChangeHandlerContext,
  PickerValidDate,
  OnErrorProps,
  InferError,
} from '../../../models';
import { GetDefaultReferenceDateProps } from '../../utils/getDefaultReferenceDate';
import {
  PickerShortcutChangeImportance,
  PickersShortcutsItemContext,
} from '../../../PickersShortcuts';
import { InferNonNullablePickerValue, InferPickerValue } from '../../models';

export interface PickerValueManager<TIsRange extends boolean, TError> {
  /**
   * Determines if two values are equal.
   * @template TIsRange `true` if the value comes from a range picker, `false` otherwise.
   * @param {MuiPickersAdapter} utils The adapter.
   * @param {InferPickerValue<TIsRange>} valueLeft The first value to compare.
   * @param {InferPickerValue<TIsRange>} valueRight The second value to compare.
   * @returns {boolean} A boolean indicating if the two values are equal.
   */
  areValuesEqual: (
    utils: MuiPickersAdapter,
    valueLeft: InferPickerValue<TIsRange>,
    valueRight: InferPickerValue<TIsRange>,
  ) => boolean;
  /**
   * Value to set when clicking the "Clear" button.
   */
  emptyValue: InferPickerValue<TIsRange>;
  /**
   * Method returning the value to set when clicking the "Today" button
   * @template TIsRange `true` if the value comes from a range picker, `false` otherwise.
   * @param {MuiPickersAdapter} utils The adapter.
   * @param {PickersTimezone} timezone The current timezone.
   * @param {FieldValueType} valueType The type of the value being edited.
   * @returns {InferPickerValue<TIsRange>} The value to set when clicking the "Today" button.
   */
  getTodayValue: (
    utils: MuiPickersAdapter,
    timezone: PickersTimezone,
    valueType: FieldValueType,
  ) => InferPickerValue<TIsRange>;
  /**
   * @template TIsRange `true` if the value comes from a range picker, `false` otherwise.
   * Method returning the reference value to use when mounting the component.
   * @param {object} params The params of the method.
   * @param {PickerValidDate | undefined} params.referenceDate The referenceDate provided by the user.
   * @param {InferPickerValue<TIsRange>} params.value The value provided by the user.
   * @param {GetDefaultReferenceDateProps} params.props The validation props needed to compute the reference value.
   * @param {MuiPickersAdapter} params.utils The adapter.
   * @param {number} params.granularity The granularity of the selection possible on this component.
   * @param {PickersTimezone} params.timezone The current timezone.
   * @param {() => PickerValidDate} params.getTodayDate The reference date to use if no reference date is passed to the component.
   * @returns {InferPickerValue<TIsRange>} The reference value to use for non-provided dates.
   */
  getInitialReferenceValue: (params: {
    referenceDate: PickerValidDate | undefined;
    value: InferPickerValue<TIsRange>;
    props: GetDefaultReferenceDateProps;
    utils: MuiPickersAdapter;
    granularity: number;
    timezone: PickersTimezone;
    getTodayDate?: () => PickerValidDate;
  }) => InferNonNullablePickerValue<TIsRange>;
  /**
   * Method parsing the input value to replace all invalid dates by `null`.
   * @template TIsRange `true` if the value comes from a range picker, `false` otherwise.
   * @param {MuiPickersAdapter} utils The adapter.
   * @param {InferPickerValue<TIsRange>} value The value to parse.
   * @returns {InferPickerValue<TIsRange>} The value without invalid date.
   */
  cleanValue: (
    utils: MuiPickersAdapter,
    value: InferPickerValue<TIsRange>,
  ) => InferPickerValue<TIsRange>;
  /**
   * Generates the new value, given the previous value and the new proposed value.
   * @template TIsRange `true` if the value comes from a range picker, `false` otherwise.
   * @param {MuiPickersAdapter} utils The adapter.
   * @param {InferPickerValue<TIsRange>} lastValidDateValue The last valid value.
   * @param {InferPickerValue<TIsRange>} value The proposed value.
   * @returns {InferPickerValue<TIsRange>} The new value.
   */
  valueReducer?: (
    utils: MuiPickersAdapter,
    lastValidDateValue: InferPickerValue<TIsRange>,
    value: InferPickerValue<TIsRange>,
  ) => InferPickerValue<TIsRange>;
  /**
   * Compare two errors to know if they are equal.
   * @template TError
   * @param {TError} error The new error
   * @param {TError | null} prevError The previous error
   * @returns {boolean} `true` if the new error is different from the previous one.
   */
  isSameError: (error: TError, prevError: TError | null) => boolean;
  /**
   * Checks if the current error is empty or not.
   * @template TError
   * @param {TError} error The current error.
   * @returns {boolean} `true` if the current error is not empty.
   */
  hasError: (error: TError) => boolean;
  /**
   * The value identifying no error, used to initialise the error state.
   */
  defaultErrorState: TError;
  /**
   * Return the timezone of the date inside a value.
   * Throw an error on range picker if both values don't have the same timezone.
   * @template TIsRange `true` if the value comes from a range picker, `false` otherwise.
   @param {MuiPickersAdapter} utils The utils to manipulate the date.
   @param {InferPickerValue<TIsRange>} value The current value.
   @returns {string | null} The timezone of the current value.
   */
  getTimezone: (utils: MuiPickersAdapter, value: InferPickerValue<TIsRange>) => string | null;
  /**
   * Change the timezone of the dates inside a value.
   * @template TIsRange `true` if the value comes from a range picker, `false` otherwise.
   @param {MuiPickersAdapter} utils The utils to manipulate the date.
   @param {PickersTimezone} timezone The current timezone.
   @param {InferPickerValue<TIsRange>} value The value to convert.
   @returns {InferPickerValue<TIsRange>} The value with the new dates in the new timezone.
   */
  setTimezone: (
    utils: MuiPickersAdapter,
    timezone: PickersTimezone,
    value: InferPickerValue<TIsRange>,
  ) => InferPickerValue<TIsRange>;
}

export type PickerSelectionState = 'partial' | 'shallow' | 'finish';

export interface UsePickerValueState<TIsRange extends boolean> {
  /**
   * Date displayed on the views and the field.
   * It is updated whenever the user modifies something.
   */
  draft: InferPickerValue<TIsRange>;
  /**
   * Last value published (e.g: the last value for which `shouldPublishValue` returned `true`).
   * If `onChange` is defined, it's the value that was passed on the last call to this callback.
   */
  lastPublishedValue: InferPickerValue<TIsRange>;
  /**
   * Last value committed (e.g: the last value for which `shouldCommitValue` returned `true`).
   * If `onAccept` is defined, it's the value that was passed on the last call to this callback.
   */
  lastCommittedValue: InferPickerValue<TIsRange>;
  /**
   * Last value passed with `props.value`.
   * Used to update the `draft` value whenever the `value` prop changes.
   */
  lastControlledValue: InferPickerValue<TIsRange> | undefined;
  /**
   * If we never modified the value since the mount of the component,
   * Then we might want to apply some custom logic.
   *
   * For example, when the component is not controlled and `defaultValue` is defined.
   * Then clicking on "Accept", "Today" or "Clear" should fire `onAccept` with `defaultValue`, but clicking on "Cancel" or dismissing the picker should not.
   */
  hasBeenModifiedSinceMount: boolean;
}

export interface PickerValueUpdaterParams<TIsRange extends boolean, TError> {
  action: PickerValueUpdateAction<TIsRange, TError>;
  dateState: UsePickerValueState<TIsRange>;
  /**
   * Check if the new draft value has changed compared to some given value.
   * @template TIsRange `true` if the value comes from a range picker, `false` otherwise.
   * @param {InferPickerValue<TIsRange>} comparisonValue The value to compare the new draft value with.
   * @returns {boolean} `true` if the new draft value is equal to the comparison value.
   */
  hasChanged: (comparisonValue: InferPickerValue<TIsRange>) => boolean;
  isControlled: boolean;
  closeOnSelect: boolean;
}

export type PickerValueUpdateAction<TIsRange extends boolean, TError> =
  | {
      name: 'setValueFromView';
      value: InferPickerValue<TIsRange>;
      selectionState: PickerSelectionState;
    }
  | {
      name: 'setValueFromField';
      value: InferPickerValue<TIsRange>;
      context: FieldChangeHandlerContext<TError>;
    }
  | {
      name: 'setValueFromAction';
      value: InferPickerValue<TIsRange>;
      pickerAction: 'accept' | 'today' | 'cancel' | 'dismiss' | 'clear';
    }
  | {
      name: 'setValueFromShortcut';
      value: InferPickerValue<TIsRange>;
      changeImportance: PickerShortcutChangeImportance;
      shortcut: PickersShortcutsItemContext;
    };

/**
 * Props used to handle the value that are common to all pickers.
 */
export interface UsePickerValueBaseProps<TIsRange extends boolean, TError>
  extends OnErrorProps<TIsRange, TError> {
  /**
   * The selected value.
   * Used when the component is controlled.
   */
  value?: InferPickerValue<TIsRange>;
  /**
   * The default value.
   * Used when the component is not controlled.
   */
  defaultValue?: InferPickerValue<TIsRange>;
  /**
   * Callback fired when the value changes.
   * @template TIsRange `true` if the value comes from a range picker, `false` otherwise.
   * @template TError The validation error type. It will be either `string` or a `null`. It can be in `[start, end]` format in case of range value.
   * @param {InferPickerValue<TIsRange>} value The new value.
   * @param {FieldChangeHandlerContext<TError>} context The context containing the validation result of the current value.
   */
  onChange?: (
    value: InferPickerValue<TIsRange>,
    context: PickerChangeHandlerContext<TError>,
  ) => void;
  /**
   * Callback fired when the value is accepted.
   * @template TIsRange `true` if the value comes from a range picker, `false` otherwise.
   * @template TError The validation error type. It will be either `string` or a `null`. It can be in `[start, end]` format in case of range value.
   * @param {InferPickerValue<TIsRange>} value The value that was just accepted.
   * @param {FieldChangeHandlerContext<TError>} context The context containing the validation result of the current value.
   */
  onAccept?: (
    value: InferPickerValue<TIsRange>,
    context: PickerChangeHandlerContext<TError>,
  ) => void;
}

/**
 * Props used to handle the value of non-static pickers.
 */
export interface UsePickerValueNonStaticProps {
  /**
   * If `true`, the popover or modal will close after submitting the full date.
   * @default `true` for desktop, `false` for mobile (based on the chosen wrapper and `desktopModeMediaQuery` prop).
   */
  closeOnSelect?: boolean;
  /**
   * Control the popup or dialog open state.
   * @default false
   */
  open?: boolean;
  /**
   * Callback fired when the popup requests to be closed.
   * Use in controlled mode (see `open`).
   */
  onClose?: () => void;
  /**
   * Callback fired when the popup requests to be opened.
   * Use in controlled mode (see `open`).
   */
  onOpen?: () => void;
}

/**
 * Props used to handle the value of the pickers.
 */
export interface UsePickerValueProps<TIsRange extends boolean, TError>
  extends UsePickerValueBaseProps<TIsRange, TError>,
    UsePickerValueNonStaticProps,
    TimezoneProps {}

export interface UsePickerValueParams<
  TIsRange extends boolean,
  TExternalProps extends UsePickerValueProps<TIsRange, any>,
> {
  props: TExternalProps;
  valueManager: PickerValueManager<TIsRange, InferError<TExternalProps>>;
  valueType: FieldValueType;
  wrapperVariant: WrapperVariant;
  validator: Validator<TIsRange, InferError<TExternalProps>, TExternalProps>;
}

export interface UsePickerValueActions {
  onAccept: () => void;
  onClear: () => void;
  onDismiss: () => void;
  onCancel: () => void;
  onSetToday: () => void;
  onOpen: (event: React.UIEvent) => void;
  onClose: (event?: React.UIEvent) => void;
}

export type UsePickerValueFieldResponse<TIsRange extends boolean, TError> = Required<
  Pick<UseFieldInternalProps<TIsRange, any, TError>, 'value' | 'onChange'>
>;

/**
 * Props passed to `usePickerViews`.
 */
export interface UsePickerValueViewsResponse<TIsRange extends boolean> {
  value: InferPickerValue<TIsRange>;
  onChange: (value: InferPickerValue<TIsRange>, selectionState?: PickerSelectionState) => void;
  open: boolean;
  onClose: (event?: React.MouseEvent) => void;
}

/**
 * Props passed to `usePickerLayoutProps`.
 */
export interface UsePickerValueLayoutResponse<TIsRange extends boolean>
  extends UsePickerValueActions {
  value: InferPickerValue<TIsRange>;
  onChange: (newValue: InferPickerValue<TIsRange>) => void;
  onSelectShortcut: (
    newValue: InferPickerValue<TIsRange>,
    changeImportance: PickerShortcutChangeImportance,
    shortcut: PickersShortcutsItemContext,
  ) => void;
  isValid: (value: InferPickerValue<TIsRange>) => boolean;
}

export interface UsePickerValueResponse<TIsRange extends boolean, TError> {
  open: boolean;
  actions: UsePickerValueActions;
  viewProps: UsePickerValueViewsResponse<TIsRange>;
  fieldProps: UsePickerValueFieldResponse<TIsRange, TError>;
  layoutProps: UsePickerValueLayoutResponse<TIsRange>;
}
