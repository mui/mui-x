import type {
  MuiPickersAdapter,
  PickerManager,
  PickersTimezone,
  PickerValidDate,
  PickerValueType,
} from '../../models';
import type { GetDefaultReferenceDateProps } from '../utils/getDefaultReferenceDate';
import { InferNonNullablePickerValue, PickerValidValue } from './value';
import type { UseFieldInternalProps } from '../hooks/useField';

export type PickerAnyManager = PickerManager<any, any, any, any, any>;

type PickerManagerProperties<TManager extends PickerAnyManager> =
  TManager extends PickerManager<
    infer TValue,
    infer TEnableAccessibleFieldDOMStructure,
    infer TError,
    infer TValidationProps,
    infer TFieldInternalProps
  >
    ? {
        value: TValue;
        enableAccessibleFieldDOMStructure: TEnableAccessibleFieldDOMStructure;
        error: TError;
        validationProps: TValidationProps;
        fieldInternalProps: TFieldInternalProps;
      }
    : never;

export type PickerManagerValue<TManager extends PickerAnyManager> =
  PickerManagerProperties<TManager>['value'];

export type PickerManagerError<TManager extends PickerAnyManager> =
  PickerManagerProperties<TManager>['error'];

export type PickerManagerFieldInternalProps<TManager extends PickerAnyManager> =
  PickerManagerProperties<TManager>['fieldInternalProps'];

export type PickerManagerValidationProps<TManager extends PickerAnyManager> =
  PickerManagerProperties<TManager>['validationProps'];

export type PickerManagerFieldInternalPropsWithDefaults<TManager extends PickerAnyManager> =
  UseFieldInternalProps<
    PickerManagerValue<TManager>,
    PickerManagerEnableAccessibleFieldDOMStructure<TManager>,
    PickerManagerError<TManager>
  > &
    PickerManagerValidationProps<TManager>;

export type PickerManagerEnableAccessibleFieldDOMStructure<TManager extends PickerAnyManager> =
  PickerManagerProperties<TManager>['enableAccessibleFieldDOMStructure'];

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
