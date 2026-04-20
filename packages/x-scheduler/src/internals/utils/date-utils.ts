import { TemporalSupportedObject } from '@mui/x-scheduler-headless/models';
import { Adapter } from '@mui/x-scheduler-headless/use-adapter';

/**
 * @example "Sun, Jul 13"
 */
export function formatWeekDayMonthAndDayOfMonth(date: TemporalSupportedObject, adapter: Adapter) {
  const f = adapter.formats;
  const dateFormat = `${f.weekday3Letters}, ${f.month3Letters} ${f.dayOfMonth}`;

  return adapter.formatByString(date, dateFormat);
}

/**
 * @example "Jul 13"
 */
export function formatMonthAndDayOfMonth(date: TemporalSupportedObject, adapter: Adapter) {
  const f = adapter.formats;
  const dateFormat = `${f.month3Letters} ${f.dayOfMonth}`;

  return adapter.formatByString(date, dateFormat);
}

/**
 * @example "13 December"
 */
export function formatDayOfMonthAndMonthFullLetter(
  date: TemporalSupportedObject,
  adapter: Adapter,
) {
  const f = adapter.formats;
  const dateFormat = `${f.dayOfMonth} ${f.monthFullLetter}`;

  return adapter.formatByString(date, dateFormat);
}

export function formatMonthFullLetterAndYear(date: TemporalSupportedObject, adapter: Adapter) {
  const f = adapter.formats;
  const dateFormat = `${f.monthFullLetter} ${f.yearPadded}`;

  return adapter.formatByString(date, dateFormat);
}

/**
 * @example "1:30 PM" or "13:30"
 */
export function formatHourAndMinutes(
  date: TemporalSupportedObject,
  adapter: Adapter,
  ampm: boolean,
) {
  const f = adapter.formats;
  const timeFormat = ampm
    ? `${f.hours12h}:${f.minutesPadded} ${f.meridiem}`
    : `${f.hours24h}:${f.minutesPadded}`;

  return adapter.formatByString(date, timeFormat);
}
