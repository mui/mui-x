import { MuiPickersAdapter, PickerValidDate } from '@mui/x-date-pickers/models';
import { DateRange, NonEmptyDateRange } from '../../models';

export const isRangeValid = <TDate extends PickerValidDate>(
  utils: MuiPickersAdapter<TDate>,
  range: DateRange<TDate> | null,
): range is NonEmptyDateRange<TDate> => {
  return Boolean(range && range[0] && range[1] && !utils.isBefore(range[1], range[0]));
};

export const isWithinRange = <TDate extends PickerValidDate>(
  utils: MuiPickersAdapter<TDate>,
  day: TDate,
  range: DateRange<TDate> | null,
) => {
  return isRangeValid(utils, range) && utils.isWithinRange(day, range);
};

export const isStartOfRange = <TDate extends PickerValidDate>(
  utils: MuiPickersAdapter<TDate>,
  day: TDate,
  range: DateRange<TDate> | null,
) => {
  return isRangeValid(utils, range) && utils.isSameDay(day, range[0]!);
};

export const isEndOfRange = <TDate extends PickerValidDate>(
  utils: MuiPickersAdapter<TDate>,
  day: TDate,
  range: DateRange<TDate> | null,
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
