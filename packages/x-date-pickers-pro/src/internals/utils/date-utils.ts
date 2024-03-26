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
