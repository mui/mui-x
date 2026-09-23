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
