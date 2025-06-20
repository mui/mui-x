import {
  DateView,
  MuiPickersAdapter,
  PickersTimezone,
  PickerValidDate,
  PickerValueType,
} from '../../models';
import { DateOrTimeViewWithMeridiem } from '../models';
import { areViewsEqual } from './views';

export const mergeDateAndTime = (
  adapter: MuiPickersAdapter,
  dateParam: PickerValidDate,
  timeParam: PickerValidDate,
): PickerValidDate => {
  let mergedDate = dateParam;
  mergedDate = adapter.setHours(mergedDate, adapter.getHours(timeParam));
  mergedDate = adapter.setMinutes(mergedDate, adapter.getMinutes(timeParam));
  mergedDate = adapter.setSeconds(mergedDate, adapter.getSeconds(timeParam));
  mergedDate = adapter.setMilliseconds(mergedDate, adapter.getMilliseconds(timeParam));

  return mergedDate;
};

interface FindClosestDateParams {
  date: PickerValidDate;
  disableFuture?: boolean;
  disablePast?: boolean;
  maxDate: PickerValidDate;
  minDate: PickerValidDate;
  isDateDisabled: (date: PickerValidDate) => boolean;
  adapter: MuiPickersAdapter;
  timezone: PickersTimezone;
}

export const findClosestEnabledDate = ({
  date,
  disableFuture,
  disablePast,
  maxDate,
  minDate,
  isDateDisabled,
  adapter,
  timezone,
}: FindClosestDateParams): PickerValidDate | null => {
  const today = mergeDateAndTime(adapter, adapter.date(undefined, timezone), date);
  if (disablePast && adapter.isBefore(minDate!, today)) {
    minDate = today;
  }

  if (disableFuture && adapter.isAfter(maxDate, today)) {
    maxDate = today;
  }

  let forward: PickerValidDate | null = date;
  let backward: PickerValidDate | null = date;
  if (adapter.isBefore(date, minDate)) {
    forward = minDate;
    backward = null;
  }

  if (adapter.isAfter(date, maxDate)) {
    if (backward) {
      backward = maxDate;
    }

    forward = null;
  }

  while (forward || backward) {
    if (forward && adapter.isAfter(forward, maxDate)) {
      forward = null;
    }
    if (backward && adapter.isBefore(backward, minDate)) {
      backward = null;
    }

    if (forward) {
      if (!isDateDisabled(forward)) {
        return forward;
      }
      forward = adapter.addDays(forward, 1);
    }

    if (backward) {
      if (!isDateDisabled(backward)) {
        return backward;
      }
      backward = adapter.addDays(backward, -1);
    }
  }

  return null;
};

export const replaceInvalidDateByNull = (
  adapter: MuiPickersAdapter,
  value: PickerValidDate | null,
): PickerValidDate | null => (!adapter.isValid(value) ? null : value);

export const applyDefaultDate = (
  adapter: MuiPickersAdapter,
  value: PickerValidDate | null | undefined,
  defaultValue: PickerValidDate,
): PickerValidDate => {
  if (value == null || !adapter.isValid(value)) {
    return defaultValue;
  }

  return value;
};

export const areDatesEqual = (
  adapter: MuiPickersAdapter,
  a: PickerValidDate | null,
  b: PickerValidDate | null,
) => {
  if (!adapter.isValid(a) && a != null && !adapter.isValid(b) && b != null) {
    return true;
  }

  return adapter.isEqual(a, b);
};

export const getMonthsInYear = (
  adapter: MuiPickersAdapter,
  year: PickerValidDate,
): PickerValidDate[] => {
  const firstMonth = adapter.startOfYear(year);
  const months = [firstMonth];

  while (months.length < 12) {
    const prevMonth = months[months.length - 1];
    months.push(adapter.addMonths(prevMonth, 1));
  }

  return months;
};

export const getTodayDate = (
  adapter: MuiPickersAdapter,
  timezone: PickersTimezone,
  valueType?: PickerValueType,
): PickerValidDate =>
  valueType === 'date'
    ? adapter.startOfDay(adapter.date(undefined, timezone))
    : adapter.date(undefined, timezone);

export const formatMeridiem = (adapter: MuiPickersAdapter, meridiem: 'am' | 'pm') => {
  const date = adapter.setHours(adapter.date(), meridiem === 'am' ? 2 : 14);
  return adapter.format(date, 'meridiem');
};

export const DATE_VIEWS = ['year', 'month', 'day'] as const;
export const isDatePickerView = (view: DateOrTimeViewWithMeridiem): view is DateView =>
  DATE_VIEWS.includes(view as any);

export const resolveDateFormat = (
  adapter: MuiPickersAdapter,
  { format, views }: { format?: string; views: readonly DateView[] },
  isInToolbar: boolean,
) => {
  if (format != null) {
    return format;
  }

  const formats = adapter.formats;
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
    return /en/.test(adapter.getCurrentLocaleCode())
      ? formats.normalDateWithWeekday
      : formats.normalDate;
  }

  return formats.keyboardDate;
};

export const getWeekdays = (
  adapter: MuiPickersAdapter,
  date: PickerValidDate,
): PickerValidDate[] => {
  const start = adapter.startOfWeek(date);
  return [0, 1, 2, 3, 4, 5, 6].map((diff) => adapter.addDays(start, diff));
};
