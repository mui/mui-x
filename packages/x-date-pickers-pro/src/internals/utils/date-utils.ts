import { MuiPickersAdapter, PickerValidDate } from '@mui/x-date-pickers/models';
import { PickerRangeValue } from '@mui/x-date-pickers/internals';

export const isRangeValid = (
  utils: MuiPickersAdapter,
  range: PickerRangeValue | null,
): range is [PickerValidDate, PickerValidDate] => {
  return Boolean(range && range[0] && range[1] && !utils.isBefore(range[1], range[0]));
};

export const isWithinRange = (
  utils: MuiPickersAdapter,
  day: PickerValidDate,
  range: PickerRangeValue | null,
) => {
  return isRangeValid(utils, range) && utils.isWithinRange(day, range);
};

export const isStartOfRange = (
  utils: MuiPickersAdapter,
  day: PickerValidDate,
  range: PickerRangeValue | null,
) => {
  return isRangeValid(utils, range) && utils.isSameDay(day, range[0]!);
};

export const isEndOfRange = (
  utils: MuiPickersAdapter,
  day: PickerValidDate,
  range: PickerRangeValue | null,
) => {
  return isRangeValid(utils, range) && utils.isSameDay(day, range[1]!);
};

export function getDatePositionInRange(
  utils: MuiPickersAdapter,
  date: PickerValidDate,
  range: PickerRangeValue,
) {
  const isSelectionStart = range[0] != null && utils.isSameDay(date, range[0]);
  const isSelectionEnd = range[1] != null && utils.isSameDay(date, range[1]);
  const isSelected = isRangeValid(utils, range)
    ? utils.isWithinRange(date, range)
    : isSelectionStart || isSelectionEnd;

  return { isSelectionStart, isSelectionEnd, isSelected };
}
