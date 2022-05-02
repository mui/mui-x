import { MuiPickersAdapter } from '../models';

type Meridiem = 'am' | 'pm' | null;

export const getMeridiem = <TDate>(date: TDate, utils: MuiPickersAdapter<TDate>): Meridiem => {
  if (!date) {
    return null;
  }

  return utils.getHours(date) >= 12 ? 'pm' : 'am';
};

export const convertValueToMeridiem = (value: number, meridiem: Meridiem, ampm: boolean) => {
  if (ampm) {
    const currentMeridiem = value >= 12 ? 'pm' : 'am';
    if (currentMeridiem !== meridiem) {
      return meridiem === 'am' ? value - 12 : value + 12;
    }
  }

  return value;
};

export const convertToMeridiem = <TDate>(
  time: TDate,
  meridiem: 'am' | 'pm',
  ampm: boolean,
  utils: MuiPickersAdapter<TDate>,
) => {
  const newHoursAmount = convertValueToMeridiem(utils.getHours(time), meridiem, ampm);
  return utils.setHours(time, newHoursAmount);
};

export const getSecondsInDay = <TDate>(date: TDate, utils: MuiPickersAdapter<TDate>) => {
  return utils.getHours(date) * 3600 + utils.getMinutes(date) * 60 + utils.getSeconds(date);
};

export const createIsAfterIgnoreDatePart =
  <TDate>(
    disableIgnoringDatePartForTimeValidation: boolean = false,
    utils: MuiPickersAdapter<TDate>,
  ) =>
  (dateLeft: TDate, dateRight: TDate) => {
    if (disableIgnoringDatePartForTimeValidation) {
      return utils.isAfter(dateLeft, dateRight);
    }

    return getSecondsInDay(dateLeft, utils) > getSecondsInDay(dateRight, utils);
  };
