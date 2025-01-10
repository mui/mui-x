import * as React from 'react';
import { UseFieldInternalProps } from '../useField';
import { Validator } from '../../../validation';
import {
  TimezoneProps,
  MuiPickersAdapter,
  PickersTimezone,
  PickerChangeHandlerContext,
  PickerValidDate,
  OnErrorProps,
  InferError,
  PickerValueType,
  PickerChangeImportance,
} from '../../../models';
import { GetDefaultReferenceDateProps } from '../../utils/getDefaultReferenceDate';
import type { PickersShortcutsItemContext } from '../../../PickersShortcuts';
import { InferNonNullablePickerValue, PickerValidValue } from '../../models';

export interface PickerValueManager<TValue extends PickerValidValue, TError> {
  /**
   * Determines if two values are equal.
   * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
   * @param {MuiPickersAdapter} utils The adapter.
   * @param {TValue} valueLeft The first value to compare.
   * @param {TValue} valueRight The second value to compare.
   * @returns {boolean} A boolean indicating if the two values are equal.
   */
  areValuesEqual: (utils: MuiPickersAdapter, valueLeft: TValue, valueRight: TValue) => boolean;
  /**
   * Value to set when clicking the "Clear" button.
   */
  emptyValue: TValue;
  /**
   * Method returning the value to set when clicking the "Today" button
   * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
   * @param {MuiPickersAdapter} utils The adapter.
   * @param {PickersTimezone} timezone The current timezone.
   * @param {PickerValueType} valueType The type of the value being edited.
   * @returns {TValue} The value to set when clicking the "Today" button.
   */
  getTodayValue: (
    utils: MuiPickersAdapter,
    timezone: PickersTimezone,
    valueType: PickerValueType,
  ) => TValue;
  /**
   * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
   * Method returning the reference value to use when mounting the component.
   * @param {object} params The params of the method.
   * @param {PickerValidDate | undefined} params.referenceDate The referenceDate provided by the user.
   * @param {TValue} params.value The value provided by the user.
   * @param {GetDefaultReferenceDateProps} params.props The validation props needed to compute the reference value.
   * @param {MuiPickersAdapter} params.utils The adapter.
   * @param {number} params.granularity The granularity of the selection possible on this component.
   * @param {PickersTimezone} params.timezone The current timezone.
   * @param {() => PickerValidDate} params.getTodayDate The reference date to use if no reference date is passed to the component.
   * @returns {TValue} The reference value to use for non-provided dates.
   */
  getInitialReferenceValue: (params: {
    referenceDate: PickerValidDate | undefined;
    value: TValue;
    props: GetDefaultReferenceDateProps;
    utils: MuiPickersAdapter;
    granularity: number;
    timezone: PickersTimezone;
    getTodayDate?: () => PickerValidDate;
  }) => InferNonNullablePickerValue<TValue>;
  /**
   * Method parsing the input value to replace all invalid dates by `null`.
   * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
   * @param {MuiPickersAdapter} utils The adapter.
   * @param {TValue} value The value to parse.
   * @returns {TValue} The value without invalid date.
   */
  cleanValue: (utils: MuiPickersAdapter, value: TValue) => TValue;
  /**
   * Generates the new value, given the previous value and the new proposed value.
   * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
   * @param {MuiPickersAdapter} utils The adapter.
   * @param {TValue} lastValidDateValue The last valid value.
   * @param {TValue} value The proposed value.
   * @returns {TValue} The new value.
   */
  valueReducer?: (utils: MuiPickersAdapter, lastValidDateValue: TValue, value: TValue) => TValue;
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
   * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
   @param {MuiPickersAdapter} utils The utils to manipulate the date.
   @param {TValue} value The current value.
   @returns {string | null} The timezone of the current value.
   */
  getTimezone: (utils: MuiPickersAdapter, value: TValue) => string | null;
  /**
   * Change the timezone of the dates inside a value.
   * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
   @param {MuiPickersAdapter} utils The utils to manipulate the date.
   @param {PickersTimezone} timezone The current timezone.
   @param {TValue} value The value to convert.
   @returns {TValue} The value with the new dates in the new timezone.
   */
  setTimezone: (utils: MuiPickersAdapter, timezone: PickersTimezone, value: TValue) => TValue;
}

export type PickerSelectionState = 'partial' | 'shallow' | 'finish';

export interface UsePickerValueState<TValue extends PickerValidValue> {
  /**
   * Date displayed on the views and the field.
   * It is updated whenever the user modifies something.
   */
  draft: TValue;
  /**
   * Last value published (the last value for which `shouldPublishValue` returned `true`).
   * If `onChange` is defined, it's the value that was passed on the last call to this callback.
   */
  lastPublishedValue: TValue;
  /**
   * Last value committed (the last value for which `shouldCommitValue` returned `true`).
   * If `onAccept` is defined, it's the value that was passed on the last call to this callback.
   */
  lastCommittedValue: TValue;
  /**
   * Last value passed to `props.value`.
   * Used to update the `draft` value whenever the `value` prop changes.
   */
  lastControlledValue: TValue | undefined;
  /**
   * If we never modified the value since the mount of the component,
   * Then we might want to apply some custom logic.
   *
   * For example, when the component is not controlled and `defaultValue` is defined.
   * Then clicking on "Accept", "Today" or "Clear" should fire `onAccept` with `defaultValue`, but clicking on "Cancel" or dismissing the picker should not.
   */
  hasBeenModifiedSinceMount: boolean;
}

/**
 * Props used to handle the value that are common to all pickers.
 */
export interface UsePickerValueBaseProps<TValue extends PickerValidValue, TError>
  extends OnErrorProps<TValue, TError> {
  /**
   * The selected value.
   * Used when the component is controlled.
   */
  value?: TValue;
  /**
   * The default value.
   * Used when the component is not controlled.
   */
  defaultValue?: TValue;
  /**
   * Callback fired when the value changes.
   * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
   * @template TError The validation error type. It will be either `string` or a `null`. It can be in `[start, end]` format in case of range value.
   * @param {TValue} value The new value.
   * @param {FieldChangeHandlerContext<TError>} context The context containing the validation result of the current value.
   */
  onChange?: (value: TValue, context: PickerChangeHandlerContext<TError>) => void;
  /**
   * Callback fired when the value is accepted.
   * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
   * @template TError The validation error type. It will be either `string` or a `null`. It can be in `[start, end]` format in case of range value.
   * @param {TValue} value The value that was just accepted.
   * @param {FieldChangeHandlerContext<TError>} context The context containing the validation result of the current value.
   */
  onAccept?: (value: TValue, context: PickerChangeHandlerContext<TError>) => void;
}

/**
 * Props used to handle the value of non-static pickers.
 */
export interface UsePickerValueNonStaticProps {
  /**
   * If `true`, the Picker will close after submitting the full date.
   * @default false
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
export interface UsePickerValueProps<TValue extends PickerValidValue, TError>
  extends UsePickerValueBaseProps<TValue, TError>,
    UsePickerValueNonStaticProps,
    TimezoneProps {
  // We don't add JSDoc here because we want the `referenceDate` JSDoc to be the one from the view which has more context.
  referenceDate?: PickerValidDate;
}

export interface UsePickerValueParams<
  TValue extends PickerValidValue,
  TExternalProps extends UsePickerValueProps<TValue, any>,
> {
  props: TExternalProps;
  valueManager: PickerValueManager<TValue, InferError<TExternalProps>>;
  valueType: PickerValueType;
  validator: Validator<TValue, InferError<TExternalProps>, TExternalProps>;
}

export type UsePickerValueFieldResponse<TValue extends PickerValidValue, TError> = Required<
  Pick<UseFieldInternalProps<TValue, any, TError>, 'value' | 'onChange'>
>;

/**
 * Props passed to `usePickerViews`.
 */
export interface UsePickerValueViewsResponse<TValue extends PickerValidValue> {
  value: TValue;
  onChange: (value: TValue, selectionState?: PickerSelectionState) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Params passed to `usePickerProvider`.
 */
export interface UsePickerValueProviderParams<TValue extends PickerValidValue, TError> {
  value: TValue;
  contextValue: UsePickerValueContextValue<TValue, TError>;
  actionsContextValue: UsePickerValueActionsContextValue<TValue, TError>;
  privateContextValue: UsePickerValuePrivateContextValue;
  isValidContextValue: (value: TValue) => boolean;
}

export interface UsePickerValueResponse<TValue extends PickerValidValue, TError> {
  viewProps: UsePickerValueViewsResponse<TValue>;
  provider: UsePickerValueProviderParams<TValue, TError>;
}

export interface UsePickerValueContextValue<TValue extends PickerValidValue, TError>
  extends UsePickerValueActionsContextValue<TValue, TError> {
  /**
   * The current value of the picker.
   */
  value: TValue;
  /**
   * The timezone to use when rendering the dates.
   */
  timezone: PickersTimezone;
  /**
   * `true` if the picker is open, `false` otherwise.
   */
  open: boolean;
}

export interface UsePickerValueActionsContextValue<TValue extends PickerValidValue, TError> {
  /**
   * Set the current value of the picker.
   * @param {TValue} value The new value of the picker.
   * @param {SetValueActionOptions<TError>} options The options to customize the behavior of this update.
   */
  setValue: (value: TValue, options?: SetValueActionOptions<TError>) => void;
  /**
   * Set the current open state of the Picker.
   * ```ts
   * setOpen(true); // Opens the picker.
   * setOpen(false); // Closes the picker.
   * setOpen((prevOpen) => !prevOpen); // Toggles the open state.
   * ```
   * @param {React.SetStateAction<boolean>} action The new open state of the Picker.
   * It can be a function that will receive the current open state.
   */
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /**
   * Set the current value of the picker to be empty.
   * The value will be `null` on single pickers and `[null, null]` on range pickers.
   */
  clearValue: () => void;
  /**
   * Set the current value of the picker to be the current date.
   * The value will be `today` on single pickers and `[today, today]` on range pickers.
   * With `today` being the current date, with its time set to `00:00:00` on Date Pickers and its time set to the current time on Time and Date Pickers.
   */
  setValueToToday: () => void;
  /**
   * Accept the current value of the picker.
   * Will call `onAccept` if defined.
   * If the picker is re-opened, this value will be the one used to initialize the views.
   */
  acceptValueChanges: () => void;
  /**
   * Cancel the changes made to the current value of the picker.
   * The value will be reset to the last accepted value.
   */
  cancelValueChanges: () => void;
}

export interface UsePickerValuePrivateContextValue {
  /**
   * Closes the picker and accepts the current value if it is not equal to the last accepted value.
   */
  dismissViews: () => void;
}

export interface SetValueActionOptions<TError = string | null> {
  /**
   * Importance of the change when picking a value:
   * - "accept": fires `onChange`, fires `onAccept` and closes the picker.
   * - "set": fires `onChange` but do not fire `onAccept` and does not close the picker.
   * @default "accept"
   */
  changeImportance?: PickerChangeImportance;
  /**
   * The validation error associated to the current value.
   * If not defined, the validation will be re-applied by the picker.
   */
  validationError?: TError;
  /**
   * The shortcut that triggered this change.
   * Should not be defined if the change does not come from a shortcut.
   */
  shortcut?: PickersShortcutsItemContext;
  /**
   * Decide if the value should call `onChange` and `onAccept` when the value is not controlled and has never been modified.
   * If `true`, the `onChange` and `onAccept` callback will only be fired if the value has been modified (and is not equal to the last published value).
   * If `false`, the `onChange` and `onAccept` callback will be fired when the value has never been modified (`onAccept` only if `changeImportance` is set to "accept").
   * @default false
   */
  skipPublicationIfPristine?: boolean;
}
