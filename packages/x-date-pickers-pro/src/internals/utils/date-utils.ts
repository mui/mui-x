import { MuiPickersAdapter, PickerValidDate } from '@mui/x-date-pickers/models';
import { PickerRangeValue } from '@mui/x-date-pickers/internals';
import { DateRange, RangePosition } from '../../models';

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

interface FindRangeBoundariesParams<TDate extends PickerValidDate> {
  range: DateRange<TDate>;
  maxDate: TDate;
  minDate: TDate;
  isDateDisabled: (day: TDate | null) => boolean;
  utils: MuiPickersAdapter<TDate>;
}

export const findRangeBoundaries = <TDate extends PickerValidDate>({
  range,
  maxDate,
  minDate,
  isDateDisabled,
  utils,
}: FindRangeBoundariesParams<TDate>) => {
  const [start, end] = range;
  const rangeBoundaries: { maxDate: TDate | null; minDate: TDate | null } = {
    maxDate: null,
    minDate: null,
  };

  if (start) {
    let current = start;

    while (utils.isBefore(current, maxDate)) {
      if (isDateDisabled(current)) {
        rangeBoundaries.maxDate = utils.addDays(current, -1);
        break;
      }
      current = utils.addDays(current, 1);
    }
  }
  if (end) {
    let current = end;

    while (utils.isAfterDay(current, minDate)) {
      if (isDateDisabled(current)) {
        rangeBoundaries.minDate = utils.addDays(current, 1);
        break;
      }
      current = utils.addDays(current, -1);
    }
  }

  return rangeBoundaries;
};

export const applyDateBoundaries = <TDate extends PickerValidDate>(
  availableRangePositions: RangePosition[],
  contiguousRangeBoundary: TDate | null | undefined,
  defaultBoundary: TDate,
  disableNonContiguousDateRange: boolean | undefined,
  isDragging: boolean,
  value: DateRange<TDate>,
) => {
  const isSelectingDateTimeStart =
    availableRangePositions.length === 1 && availableRangePositions[0] === 'start';
  const [start, end] = value;

  if (
    disableNonContiguousDateRange &&
    contiguousRangeBoundary &&
    !isSelectingDateTimeStart &&
    ((start && !end) || (!start && end) || isDragging)
  ) {
    return contiguousRangeBoundary;
  }
  return defaultBoundary;
};
