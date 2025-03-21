import { AdapterFormats, MuiPickersAdapter, PickerValidDate } from '@mui/x-date-pickers/models';
import { PickerNonNullableRangeValue, PickerRangeValue } from '@mui/x-date-pickers/internals';

export const isRangeValid = (
  utils: MuiPickersAdapter,
  range: PickerRangeValue,
): range is PickerNonNullableRangeValue => {
  return utils.isValid(range[0]) && utils.isValid(range[1]) && !utils.isBefore(range[1], range[0]);
};

export const isWithinRange = (
  utils: MuiPickersAdapter,
  day: PickerValidDate,
  range: PickerRangeValue,
) => {
  return isRangeValid(utils, range) && utils.isWithinRange(day, range);
};

export const isStartOfRange = (
  utils: MuiPickersAdapter,
  day: PickerValidDate,
  range: PickerRangeValue,
) => {
  return isRangeValid(utils, range) && utils.isSameDay(day, range[0]!);
};

export const isEndOfRange = (
  utils: MuiPickersAdapter,
  day: PickerValidDate,
  range: PickerRangeValue,
) => {
  return isRangeValid(utils, range) && utils.isSameDay(day, range[1]!);
};

export const formatRange = (
  utils: MuiPickersAdapter,
  range: PickerRangeValue,
  formatKey: keyof AdapterFormats,
) => {
  if (!isRangeValid(utils, range)) {
    return null;
  }

  return `${utils.format(range[0]!, formatKey)} - ${utils.format(range[1]!, formatKey)}`;
};
