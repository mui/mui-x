import { MuiPickersAdapter, PickerValidDate } from '@mui/x-date-pickers/models';
import { DateRange, NonEmptyDateRange } from '../../models';

export const isRangeValid = (
  utils: MuiPickersAdapter,
  range: DateRange | null,
): range is NonEmptyDateRange => {
  return Boolean(range && range[0] && range[1] && !utils.isBefore(range[1], range[0]));
};

export const isWithinRange = (
  utils: MuiPickersAdapter,
  day: PickerValidDate,
  range: DateRange | null,
) => {
  return isRangeValid(utils, range) && utils.isWithinRange(day, range);
};

export const isStartOfRange = (
  utils: MuiPickersAdapter,
  day: PickerValidDate,
  range: DateRange | null,
) => {
  return isRangeValid(utils, range) && utils.isSameDay(day, range[0]!);
};

export const isEndOfRange = (
  utils: MuiPickersAdapter,
  day: PickerValidDate,
  range: DateRange | null,
) => {
  return isRangeValid(utils, range) && utils.isSameDay(day, range[1]!);
};
