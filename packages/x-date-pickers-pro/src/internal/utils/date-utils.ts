import { MuiPickersAdapter, replaceInvalidDateByNull } from '@mui/x-date-pickers/internals';
import { DateRange, NonEmptyDateRange } from '../models';

export const replaceInvalidDatesByNull = <TDate>(
  utils: MuiPickersAdapter<TDate>,
  value: DateRange<TDate> = [null, null],
) => value.map((date) => replaceInvalidDateByNull(utils, date)) as DateRange<TDate>;

export const isRangeValid = <TDate>(
  utils: MuiPickersAdapter<TDate>,
  range: DateRange<TDate> | null,
): range is NonEmptyDateRange<TDate> => {
  return Boolean(range && range[0] && range[1] && !utils.isBefore(range[1], range[0]));
};

export const isWithinDayRange = <TDate>(
  utils: MuiPickersAdapter<TDate>,
  day: TDate,
  range: DateRange<TDate> | null,
) => {
  if (!isRangeValid(utils, range)) {
    return false
  }

  const cleanRange = [utils.startOfDay(range[0]), utils.endOfDay(range[1])] as NonEmptyDateRange<TDate>

  return utils.isWithinRange(day, cleanRange);
};

export const isStartOfRange = <TDate>(
  utils: MuiPickersAdapter<TDate>,
  day: TDate,
  range: DateRange<TDate> | null,
) => {
  return isRangeValid(utils, range) && utils.isSameDay(day, range[0]!);
};

export const isEndOfRange = <TDate>(
  utils: MuiPickersAdapter<TDate>,
  day: TDate,
  range: DateRange<TDate> | null,
) => {
  return isRangeValid(utils, range) && utils.isSameDay(day, range[1]!);
};
