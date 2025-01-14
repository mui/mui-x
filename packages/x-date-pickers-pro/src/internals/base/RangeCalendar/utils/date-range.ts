import { PickerRangeValue } from '@mui/x-date-pickers/internals';
import { MuiPickersAdapter, PickerValidDate } from '@mui/x-date-pickers/models';

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

  const sectionMethods = getCalendarSectionMethods(utils, section);
  if (start == null) {
    const isSelected = sectionMethods.isSame(date, end!);
    return {
      isSelected,
      isSelectionStart: isSelected,
      isSelectionEnd: isSelected,
    };
  }

  if (end == null) {
    const isSelected = sectionMethods.isSame(date, start!);
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
    isSelectionStart: sectionMethods.isSame(date, start),
    isSelectionEnd: sectionMethods.isSame(date, end),
  };
}

export function getCalendarSectionMethods(
  utils: MuiPickersAdapter,
  section: 'day' | 'month' | 'year',
) {
  if (section === 'year') {
    return { isSame: utils.isSameYear, startOf: utils.startOfYear, endOf: utils.endOfYear };
  }
  if (section === 'month') {
    return { isSame: utils.isSameMonth, startOf: utils.startOfMonth, endOf: utils.endOfMonth };
  }
  return { isSame: utils.isSameDay, startOf: utils.startOfDay, endOf: utils.endOfDay };
}
