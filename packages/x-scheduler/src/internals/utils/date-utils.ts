import type { TemporalSupportedObject } from '@mui/x-scheduler-internals/models';
import type { Adapter } from '@mui/x-scheduler-internals/use-adapter';

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
): string {
  const f = adapter.formats;
  const timeFormat = ampm
    ? `${f.hours12h}:${f.minutesPadded} ${f.meridiem}`
    : `${f.hours24h}:${f.minutesPadded}`;

  return adapter.formatByString(date, timeFormat);
}

/**
 * @example "2025-07-13"
 */
export function formatIsoDate(date: TemporalSupportedObject, adapter: Adapter): string {
  const f = adapter.formats;

  return adapter.formatByString(date, `${f.yearPadded}-${f.monthPadded}-${f.dayOfMonthPadded}`);
}

/**
 * @example "2025-07-13T13:30"
 */
export function formatIsoDateTime(date: TemporalSupportedObject, adapter: Adapter): string {
  const f = adapter.formats;
  const time = adapter.formatByString(date, `${f.hours24hPadded}:${f.minutesPadded}`);

  return `${formatIsoDate(date, adapter)}T${time}`;
}
