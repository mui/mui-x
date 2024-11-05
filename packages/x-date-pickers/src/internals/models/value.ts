import { PickerValidDate } from '../../models/pickers';

export type PickerValue = PickerValidDate | null;

export type PickerRangeValue = [PickerValidDate | null, PickerValidDate | null];

export type PickerNonNullableRangeValue = [PickerValidDate, PickerValidDate];

export type InferPickerValue<TIsRange extends boolean> = TIsRange extends true
  ? TIsRange extends false
    ? PickerValue | PickerRangeValue
    : PickerRangeValue
  : PickerValue;

export type InferNonNullablePickerValue<TIsRange extends boolean> = TIsRange extends true
  ? TIsRange extends false
    ? PickerValidDate | PickerNonNullableRangeValue
    : PickerNonNullableRangeValue
  : PickerValidDate;
