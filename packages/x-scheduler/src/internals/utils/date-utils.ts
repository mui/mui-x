import type { TemporalSupportedObject } from '@mui/x-scheduler-internals/models';
import type { Adapter } from '@mui/x-scheduler-internals/use-adapter';
import { createStartOfPlainDate } from '@mui/x-scheduler-internals/internals';
import { schedulerOtherSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import type { EventCalendarState } from '@mui/x-scheduler-internals/use-event-calendar';

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
 * @example "Sunday, July 13th, 2025"
 */
export function formatFullDate(date: TemporalSupportedObject, adapter: Adapter): string {
  return adapter.format(date, 'localizedDateWithFullMonthAndWeekDay');
}

/**
 * The first instant of the month `delta` months after the month of the visible date, for the
 * navigation of the views that show months.
 */
export function getSiblingMonthStart(state: EventCalendarState, delta: number) {
  return createStartOfPlainDate(
    state.adapter,
    schedulerOtherSelectors.visiblePlainDate(state).with({ day: 1 }).add({ months: delta }),
    state.displayTimezone,
  );
}
