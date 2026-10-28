import type { TemporalTimezone } from '@base-ui/react/internals/temporal';
import type { SchedulerProcessedDate } from '@mui/x-scheduler-internals/models';
import {
  createStartOfPlainDate,
  formatPlainDate,
  formatTime,
  toPlainDate,
} from '@mui/x-scheduler-internals/internals';
import { schedulerOtherSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import type { EventCalendarState } from '@mui/x-scheduler-internals/use-event-calendar';

/**
 * Formats the date of a processed date, read in `timezone`.
 * @example "Sunday, July 13, 2025"
 */
export function formatFullDate(
  locale: string,
  date: SchedulerProcessedDate,
  timezone: TemporalTimezone,
): string {
  return formatPlainDate(locale, toPlainDate(date.timestamp, timezone), 'fullDate');
}

/**
 * Formats the wall-clock time of a processed date.
 * @example "1:30 PM" or "13:30"
 */
export function formatProcessedDateTime(
  locale: string,
  date: SchedulerProcessedDate,
  ampm: boolean,
): string {
  return formatTime(locale, date.minutesInDay * 60_000, ampm);
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
