import {
  DateView,
  FieldValueType,
  MuiPickersAdapter,
  PickersTimezone,
  PickerValidDate,
} from '../../models';
import { DateOrTimeViewWithMeridiem } from '../models';
import { areViewsEqual } from './views';

export const mergeDateAndTime = <TDate extends PickerValidDate>(
  utils: MuiPickersAdapter<TDate>,
  dateParam: TDate,
  timeParam: TDate,
) => {
  let mergedDate = dateParam;
  mergedDate = utils.setHours(mergedDate, utils.getHours(timeParam));
  mergedDate = utils.setMinutes(mergedDate, utils.getMinutes(timeParam));
  mergedDate = utils.setSeconds(mergedDate, utils.getSeconds(timeParam));
  mergedDate = utils.setMilliseconds(mergedDate, utils.getMilliseconds(timeParam));

  return mergedDate;
};

interface FindClosestDateParams<TDate extends PickerValidDate> {
  date: TDate;
  disableFuture?: boolean;
  disablePast?: boolean;
  maxDate: TDate;
  minDate: TDate;
  isDateDisabled: (date: TDate) => boolean;
  utils: MuiPickersAdapter<TDate>;
  timezone: PickersTimezone;
}

export const findClosestEnabledDate = <TDate extends PickerValidDate>({
  date,
  disableFuture,
  disablePast,
  maxDate,
  minDate,
  isDateDisabled,
  utils,
  timezone,
}: FindClosestDateParams<TDate>) => {
  const today = mergeDateAndTime(utils, utils.date(undefined, timezone), date);
  if (disablePast && utils.isBefore(minDate!, today)) {
    minDate = today;
  }

  if (disableFuture && utils.isAfter(maxDate, today)) {
    maxDate = today;
  }

  let forward: TDate | null = date;
  let backward: TDate | null = date;
  if (utils.isBefore(date, minDate)) {
    forward = minDate;
    backward = null;
  }

  if (utils.isAfter(date, maxDate)) {
    if (backward) {
      backward = maxDate;
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
      if (!isDateDisabled(forward)) {
        return forward;
      }
      forward = utils.addDays(forward, 1);
    }

    if (backward) {
      if (!isDateDisabled(backward)) {
        return backward;
      }
      backward = utils.addDays(backward, -1);
    }
  }

  return null;
};

export const replaceInvalidDateByNull = <TDate extends PickerValidDate>(
  utils: MuiPickersAdapter<TDate>,
  value: TDate | null,
) => (value == null || !utils.isValid(value) ? null : value);

export const applyDefaultDate = <TDate extends PickerValidDate>(
  utils: MuiPickersAdapter<TDate>,
  value: TDate | null | undefined,
  defaultValue: TDate,
): TDate => {
  if (value == null || !utils.isValid(value)) {
    return defaultValue;
  }

  return value;
};

export const areDatesEqual = <TDate extends PickerValidDate>(
  utils: MuiPickersAdapter<TDate>,
  a: TDate,
  b: TDate,
) => {
  if (!utils.isValid(a) && a != null && !utils.isValid(b) && b != null) {
    return true;
  }

  return utils.isEqual(a, b);
};

export const getMonthsInYear = <TDate extends PickerValidDate>(
  utils: MuiPickersAdapter<TDate>,
  year: TDate,
) => {
  const firstMonth = utils.startOfYear(year);
  const months = [firstMonth];

  while (months.length < 12) {
    const prevMonth = months[months.length - 1];
    months.push(utils.addMonths(prevMonth, 1));
  }

  return months;
};

export const getTodayDate = <TDate extends PickerValidDate>(
  utils: MuiPickersAdapter<TDate>,
  timezone: PickersTimezone,
  valueType?: FieldValueType,
) =>
  valueType === 'date'
    ? utils.startOfDay(utils.date(undefined, timezone))
    : utils.date(undefined, timezone);

export const formatMeridiem = <TDate extends PickerValidDate>(
  utils: MuiPickersAdapter<TDate>,
  meridiem: 'am' | 'pm',
) => {
  const date = utils.setHours(utils.date(), meridiem === 'am' ? 2 : 14);
  return utils.format(date, 'meridiem');
};

const dateViews = ['year', 'month', 'day'];
export const isDatePickerView = (view: DateOrTimeViewWithMeridiem): view is DateView =>
  dateViews.includes(view);

export const resolveDateFormat = <TDate extends PickerValidDate>(
  utils: MuiPickersAdapter<TDate>,
  { format, views }: { format?: string; views: readonly DateView[] },
  isInToolbar: boolean,
) => {
  if (format != null) {
    return format;
  }

  const formats = utils.formats;
  if (areViewsEqual(views, ['year'])) {
    return formats.year;
  }

  if (areViewsEqual(views, ['month'])) {
    return formats.month;
  }

  if (areViewsEqual(views, ['day'])) {
    return formats.dayOfMonth;
  }

  if (areViewsEqual(views, ['month', 'year'])) {
    return `${formats.month} ${formats.year}`;
  }

  if (areViewsEqual(views, ['day', 'month'])) {
    return `${formats.month} ${formats.dayOfMonth}`;
  }

  if (isInToolbar) {
    // Little localization hack (Google is doing the same for android native pickers):
    // For english localization it is convenient to include weekday into the date "Mon, Jun 1".
    // For other locales using strings like "June 1", without weekday.
    return /en/.test(utils.getCurrentLocaleCode())
      ? formats.normalDateWithWeekday
      : formats.normalDate;
  }

  return formats.keyboardDate;
};

export const getWeekdays = <TDate extends PickerValidDate>(
  utils: MuiPickersAdapter<TDate>,
  date: TDate,
) => {
  const start = utils.startOfWeek(date);
  return [0, 1, 2, 3, 4, 5, 6].map((diff) => utils.addDays(start, diff));
};
