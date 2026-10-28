import type { TemporalTimezone } from '@base-ui/react/internals/temporal';
import type { SchedulerProcessedDate } from '@mui/x-scheduler-internals/models';
import {
  createStartOfPlainDate,
  formatPlainDate,
  toPlainDate,
} from '@mui/x-scheduler-internals/internals';
import type { PlainDate, SchedulerDateFormat } from '@mui/x-scheduler-internals/internals';
import { schedulerOtherSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import type { EventCalendarState } from '@mui/x-scheduler-internals/use-event-calendar';

/**
 * Formats the date of a processed date, read in `timezone`.
 */
export function formatProcessedDate(
  locale: string,
  date: SchedulerProcessedDate,
  timezone: TemporalTimezone,
  format: SchedulerDateFormat,
): string {
  return formatPlainDate(locale, toPlainDate(date.timestamp, timezone), format);
}

/**
 * @example "Sunday 13"
 */
export function formatWeekdayAndDayOfMonth(locale: string, plainDate: PlainDate): string {
  return `${formatPlainDate(locale, plainDate, 'weekday')} ${formatPlainDate(locale, plainDate, 'dayOfMonth')}`;
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
