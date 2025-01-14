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

export function getDatePositionInRange({
  utils,
  date,
  range,
  section,
}: {
  utils: MuiPickersAdapter;
  date: PickerValidDate;
  range: PickerRangeValue;
  section: 'year' | 'month' | 'day';
}) {
  const [start, end] = range;
  if (start == null && end == null) {
    return { isSelected: false, isSelectionStart: false, isSelectionEnd: false };
  }

  let comparisonFn: (a: PickerValidDate, b: PickerValidDate) => boolean;
  if (section === 'year') {
    comparisonFn = utils.isSameYear;
  } else if (section === 'month') {
    comparisonFn = utils.isSameMonth;
  } else {
    comparisonFn = utils.isSameDay;
  }

  if (start == null) {
    const isSelected = comparisonFn(date, end!);
    return {
      isSelected,
      isSelectionStart: isSelected,
      isSelectionEnd: isSelected,
    };
  }

  if (end == null) {
    const isSelected = comparisonFn(date, start!);
    return {
      isSelected,
      isSelectionStart: isSelected,
      isSelectionEnd: isSelected,
    };
  }

  if (utils.isBefore(end, start)) {
    return {
      isSelected: false,
      isSelectionStart: false,
      isSelectionEnd: false,
    };
  }

  return {
    isSelected: utils.isWithinRange(date, [start, end]),
    isSelectionStart: comparisonFn(date, start),
    isSelectionEnd: comparisonFn(date, end),
  };
}
