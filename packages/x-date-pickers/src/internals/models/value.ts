import { PickerValidDate } from '../../models/pickers';

/**
 * The type that the `value` and `defaultValue` props can receive on non-range components (date, time and date-time).
 */
export type PickerValue = PickerValidDate | null;

/**
 * The type that the `value` and `defaultValue` props can receive on range components (date-range, time-range and date-time-range).
 */
export type PickerRangeValue = [PickerValidDate | null, PickerValidDate | null];

export type PickerNonNullableRangeValue = [PickerValidDate, PickerValidDate];

export type PickerValidValue = PickerValue | PickerRangeValue;

export type InferNonNullablePickerValue<TValue extends PickerValidValue> =
  TValue extends PickerRangeValue
    ? TValue extends PickerValue
      ? PickerValidDate | PickerNonNullableRangeValue
      : PickerNonNullableRangeValue
    : PickerValidDate;
