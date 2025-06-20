import { AdapterFormats, MuiPickersAdapter, PickerValidDate } from '@mui/x-date-pickers/models';
import { PickerNonNullableRangeValue, PickerRangeValue } from '@mui/x-date-pickers/internals';

export const isRangeValid = (
  adapter: MuiPickersAdapter,
  range: PickerRangeValue,
): range is PickerNonNullableRangeValue => {
  return (
    adapter.isValid(range[0]) && adapter.isValid(range[1]) && !adapter.isBefore(range[1], range[0])
  );
};

export const isWithinRange = (
  adapter: MuiPickersAdapter,
  day: PickerValidDate,
  range: PickerRangeValue,
) => {
  return isRangeValid(adapter, range) && adapter.isWithinRange(day, range);
};

export const isStartOfRange = (
  adapter: MuiPickersAdapter,
  day: PickerValidDate,
  range: PickerRangeValue,
) => {
  return isRangeValid(adapter, range) && adapter.isSameDay(day, range[0]!);
};

export const isEndOfRange = (
  adapter: MuiPickersAdapter,
  day: PickerValidDate,
  range: PickerRangeValue,
) => {
  return isRangeValid(adapter, range) && adapter.isSameDay(day, range[1]!);
};

export const formatRange = (
  adapter: MuiPickersAdapter,
  range: PickerRangeValue,
  formatKey: keyof AdapterFormats,
) => {
  if (!isRangeValid(adapter, range)) {
    return null;
  }

  return `${adapter.format(range[0]!, formatKey)} - ${adapter.format(range[1]!, formatKey)}`;
};
