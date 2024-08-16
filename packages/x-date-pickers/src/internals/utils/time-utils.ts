import { MuiPickersAdapter, PickerValidDate, TimeView } from '../../models';
import { DateOrTimeViewWithMeridiem, TimeViewWithMeridiem } from '../models';
import { areViewsEqual } from './views';

const timeViews = ['hours', 'minutes', 'seconds'];
export const isTimeView = (view: DateOrTimeViewWithMeridiem) => timeViews.includes(view);

export const isInternalTimeView = (
  view: DateOrTimeViewWithMeridiem,
): view is TimeViewWithMeridiem => timeViews.includes(view) || view === 'meridiem';

export type Meridiem = 'am' | 'pm';

export const getMeridiem = <TDate extends PickerValidDate>(
  date: TDate | null,
  utils: MuiPickersAdapter<TDate>,
): Meridiem | null => {
  if (!date) {
    return null;
  }

  return utils.getHours(date) >= 12 ? 'pm' : 'am';
};

export const convertValueToMeridiem = (value: number, meridiem: Meridiem | null, ampm: boolean) => {
  if (ampm) {
    const currentMeridiem = value >= 12 ? 'pm' : 'am';
    if (currentMeridiem !== meridiem) {
      return meridiem === 'am' ? value - 12 : value + 12;
    }
  }

  return value;
};

export const convertToMeridiem = <TDate extends PickerValidDate>(
  time: TDate,
  meridiem: Meridiem,
  ampm: boolean,
  utils: MuiPickersAdapter<TDate>,
) => {
  const newHoursAmount = convertValueToMeridiem(utils.getHours(time), meridiem, ampm);
  return utils.setHours(time, newHoursAmount);
};

export const getSecondsInDay = <TDate extends PickerValidDate>(
  date: TDate,
  utils: MuiPickersAdapter<TDate>,
) => {
  return utils.getHours(date) * 3600 + utils.getMinutes(date) * 60 + utils.getSeconds(date);
};

export const createIsAfterIgnoreDatePart =
  <TDate extends PickerValidDate>(
    disableIgnoringDatePartForTimeValidation: boolean,
    utils: MuiPickersAdapter<TDate>,
  ) =>
  (dateLeft: TDate, dateRight: TDate) => {
    if (disableIgnoringDatePartForTimeValidation) {
      return utils.isAfter(dateLeft, dateRight);
    }

    return getSecondsInDay(dateLeft, utils) > getSecondsInDay(dateRight, utils);
  };

export const resolveTimeFormat = <TDate extends PickerValidDate>(
  utils: MuiPickersAdapter<TDate>,
  { format, views, ampm }: { format?: string; views: readonly TimeView[]; ampm: boolean },
) => {
  if (format != null) {
    return format;
  }

  const formats = utils.formats;
  if (areViewsEqual(views, ['hours'])) {
    return ampm ? `${formats.hours12h} ${formats.meridiem}` : formats.hours24h;
  }

  if (areViewsEqual(views, ['minutes'])) {
    return formats.minutes;
  }

  if (areViewsEqual(views, ['seconds'])) {
    return formats.seconds;
  }

  if (areViewsEqual(views, ['minutes', 'seconds'])) {
    return `${formats.minutes}:${formats.seconds}`;
  }

  if (areViewsEqual(views, ['hours', 'minutes', 'seconds'])) {
    return ampm
      ? `${formats.hours12h}:${formats.minutes}:${formats.seconds} ${formats.meridiem}`
      : `${formats.hours24h}:${formats.minutes}:${formats.seconds}`;
  }

  return ampm
    ? `${formats.hours12h}:${formats.minutes} ${formats.meridiem}`
    : `${formats.hours24h}:${formats.minutes}`;
};
