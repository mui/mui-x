import {
  createStartOfPlainDate,
  formatDayOfMonth,
  formatWeekday,
} from '@mui/x-scheduler-internals/internals';
import type { PlainDate } from '@mui/x-scheduler-internals/internals';
import { schedulerOtherSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import type { EventCalendarState } from '@mui/x-scheduler-internals/use-event-calendar';

/**
 * @example "Sunday 13"
 */
export function formatWeekdayAndDayOfMonth(locale: string, plainDate: PlainDate): string {
  return `${formatWeekday(locale, plainDate)} ${formatDayOfMonth(locale, plainDate)}`;
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
