import { MuiPickersAdapter, PickerValidDate } from '../../models';
import { DateOrTimeViewWithMeridiem, TimeViewWithMeridiem } from '../models';
import { areViewsEqual } from './views';

export const EXPORTED_TIME_VIEWS = ['hours', 'minutes', 'seconds'] as const;

export const TIME_VIEWS = ['hours', 'minutes', 'seconds', 'meridiem'] as const;

export const isTimeView = (view: DateOrTimeViewWithMeridiem) =>
  EXPORTED_TIME_VIEWS.includes(view as any);

export const isInternalTimeView = (
  view: DateOrTimeViewWithMeridiem,
): view is TimeViewWithMeridiem => TIME_VIEWS.includes(view as any);

export type Meridiem = 'am' | 'pm';

export const getMeridiem = (
  date: PickerValidDate | null,
  adapter: MuiPickersAdapter,
): Meridiem | null => {
  if (!date) {
    return null;
  }

  return adapter.getHours(date) >= 12 ? 'pm' : 'am';
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

export const convertToMeridiem = (
  time: PickerValidDate,
  meridiem: Meridiem,
  ampm: boolean,
  adapter: MuiPickersAdapter,
): PickerValidDate => {
  const newHoursAmount = convertValueToMeridiem(adapter.getHours(time), meridiem, ampm);
  return adapter.setHours(time, newHoursAmount);
};

export const getSecondsInDay = (date: PickerValidDate, adapter: MuiPickersAdapter) => {
  return adapter.getHours(date) * 3600 + adapter.getMinutes(date) * 60 + adapter.getSeconds(date);
};

export const createIsAfterIgnoreDatePart =
  (disableIgnoringDatePartForTimeValidation: boolean, adapter: MuiPickersAdapter) =>
  (dateLeft: PickerValidDate, dateRight: PickerValidDate) => {
    if (disableIgnoringDatePartForTimeValidation) {
      return adapter.isAfter(dateLeft, dateRight);
    }

    return getSecondsInDay(dateLeft, adapter) > getSecondsInDay(dateRight, adapter);
  };

export const resolveTimeFormat = (
  adapter: MuiPickersAdapter,
  {
    format,
    views,
    ampm,
  }: { format?: string; views: readonly TimeViewWithMeridiem[]; ampm: boolean },
) => {
  if (format != null) {
    return format;
  }

  const formats = adapter.formats;
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
