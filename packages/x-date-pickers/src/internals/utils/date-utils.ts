import { MuiPickersAdapter } from '../models';

interface FindClosestDateParams<TDate> {
  date: TDate;
  disableFuture: boolean;
  disablePast: boolean;
  maxDate: TDate;
  minDate: TDate;
  shouldDisableDate: (date: TDate) => boolean;
  utils: MuiPickersAdapter<TDate>;
}

export const findClosestEnabledDate = <TDate>({
  date,
  disableFuture,
  disablePast,
  maxDate,
  minDate,
  shouldDisableDate,
  utils,
}: FindClosestDateParams<TDate>) => {
  const today = utils.startOfDay(utils.date()!);

  if (disablePast && utils.isBefore(minDate!, today)) {
    minDate = today;
  }

  if (disableFuture && utils.isAfter(maxDate, today)) {
    maxDate = today;
  }

  let forward: TDate | null = date;
  let backward: TDate | null = date;
  if (utils.isBefore(date, minDate)) {
    forward = utils.date(minDate);
    backward = null;
  }

  if (utils.isAfter(date, maxDate)) {
    if (backward) {
      backward = utils.date(maxDate);
    }

    forward = null;
  }

  while (forward || backward) {
    if (forward && utils.isAfter(forward, maxDate)) {
      forward = null;
    }
    if (backward && utils.isBefore(backward, minDate)) {
      backward = null;
    }

    if (forward) {
      if (!shouldDisableDate(forward)) {
        return forward;
      }
      forward = utils.addDays(forward, 1);
    }

    if (backward) {
      if (!shouldDisableDate(backward)) {
        return backward;
      }
      backward = utils.addDays(backward, -1);
    }
  }

  return today;
};

export const parsePickerInputValue = <TDate>(
  utils: MuiPickersAdapter<TDate>,
  value: TDate,
): TDate | null => {
  const parsedValue = utils.date(value);

  return utils.isValid(parsedValue) ? parsedValue : null;
};
