import { mergeDateAndTime, PickerRangeValue, RangePosition } from '@mui/x-date-pickers/internals';
import { MuiPickersAdapter, PickerValidDate } from '@mui/x-date-pickers/models';
// eslint-disable-next-line no-restricted-imports
import { BaseCalendarSection } from '@mui/x-date-pickers/internals/base/utils/base-calendar/utils/types';

export function getDatePositionInRange({
  utils,
  date,
  range,
  section,
}: {
  utils: MuiPickersAdapter;
  date: PickerValidDate;
  range: PickerRangeValue;
  section: BaseCalendarSection;
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
    isSelected: utils.isWithinRange(date, [
      sectionMethods.startOf(start),
      sectionMethods.endOf(end),
    ]),
    isSelectionStart: sectionMethods.isSame(date, start),
    isSelectionEnd: sectionMethods.isSame(date, end),
  };
}

export function applySelectedDateOnRange({
  utils,
  range,
  selectedDate,
  position,
  allowRangeFlip,
  shouldMergeDateAndTime,
  referenceDate,
  section,
}: ApplySelectedDateOnRangeParameters): ApplySelectedDateOnRangeReturnValue {
  const start = !utils.isValid(range[0]) ? null : range[0];
  const end = !utils.isValid(range[1]) ? null : range[1];

  if (shouldMergeDateAndTime && selectedDate) {
    // If there is a date already selected, then we want to keep its time
    if (start && position === 'start') {
      selectedDate = mergeDateAndTime(utils, selectedDate, start);
    }
    if (end && position === 'end') {
      selectedDate = mergeDateAndTime(utils, selectedDate, end);
    }
  }

  const newSelectedDate =
    referenceDate && selectedDate && shouldMergeDateAndTime
      ? mergeDateAndTime(utils, selectedDate, referenceDate)
      : selectedDate;

  if (position === 'start') {
    const truthyResult: ApplySelectedDateOnRangeReturnValue = allowRangeFlip
      ? { position: 'start', range: [end!, newSelectedDate] }
      : { position: 'end', range: [newSelectedDate, null] };

    return Boolean(end) && utils.isAfter(newSelectedDate!, end!)
      ? truthyResult
      : { position: 'end', range: [newSelectedDate, end] };
  }

  const truthyResult: ApplySelectedDateOnRangeReturnValue = allowRangeFlip
    ? { position: 'end', range: [newSelectedDate, start!] }
    : { position: 'end', range: [newSelectedDate, null] };

  const sectionMethods = getCalendarSectionMethods(utils, section);
  return Boolean(start) && utils.isBefore(newSelectedDate!, sectionMethods.startOf(start!))
    ? truthyResult
    : { position: 'start', range: [start, newSelectedDate] };
}

interface ApplySelectedDateOnRangeParameters {
  utils: MuiPickersAdapter;
  range: PickerRangeValue;
  selectedDate: PickerValidDate;
  position: RangePosition;
  allowRangeFlip: boolean;
  shouldMergeDateAndTime: boolean;
  referenceDate: PickerValidDate;
  section: BaseCalendarSection;
}

interface ApplySelectedDateOnRangeReturnValue {
  position: RangePosition;
  range: PickerRangeValue;
}

export function createPreviewRange(parameters: CreatePreviewRangeParameters): PickerRangeValue {
  const { utils, value, hoveredDate, position } = parameters;
  if (hoveredDate == null) {
    return [null, null];
  }

  const roundedValue = getRoundedRange({
    utils,
    range: value,
    section: hoveredDate.section,
  });

  const [start, end] = roundedValue;
  const changes = applySelectedDateOnRange({
    utils,
    range: value,
    selectedDate: hoveredDate.value,
    position,
    allowRangeFlip: false,
    shouldMergeDateAndTime: false,
    referenceDate: hoveredDate.value,
    section: hoveredDate.section,
  });

  if (!start || !end) {
    return changes.range;
  }

  const [previewStart, previewEnd] = changes.range;
  return position === 'end' ? [end, previewEnd] : [previewStart, start];
}

interface CreatePreviewRangeParameters {
  utils: MuiPickersAdapter;
  value: PickerRangeValue;
  hoveredDate: { value: PickerValidDate; section: BaseCalendarSection } | null;
  position: RangePosition;
}

/**
 * Create a range going for the start of the first selected cell to the end of the last selected cell.
 * This makes sure that `isWithinRange` works with any time in the start and end day.
 */
export function getRoundedRange({
  utils,
  range,
  section,
}: {
  utils: MuiPickersAdapter;
  range: PickerRangeValue;
  section: BaseCalendarSection;
}): PickerRangeValue {
  const sectionMethods = getCalendarSectionMethods(utils, section);

  return [
    utils.isValid(range[0]) ? sectionMethods.startOf(range[0]) : null,
    utils.isValid(range[1]) ? sectionMethods.endOf(range[1]) : null,
  ];
}

export function getCalendarSectionMethods(utils: MuiPickersAdapter, section: BaseCalendarSection) {
  if (section === 'year') {
    return { isSame: utils.isSameYear, startOf: utils.startOfYear, endOf: utils.endOfYear };
  }
  if (section === 'month') {
    return { isSame: utils.isSameMonth, startOf: utils.startOfMonth, endOf: utils.endOfMonth };
  }
  return { isSame: utils.isSameDay, startOf: utils.startOfDay, endOf: utils.endOfDay };
}
