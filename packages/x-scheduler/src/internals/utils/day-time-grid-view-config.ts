import { createSelectorMemoized } from '@base-ui/utils/store';
import { EventCalendarViewConfig, SchedulerProcessedDate } from '@mui/x-scheduler-internals/models';
import type { EventCalendarState as State } from '@mui/x-scheduler-internals/use-event-calendar';
import { schedulerOtherSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { eventCalendarPreferenceSelectors } from '@mui/x-scheduler-internals/event-calendar-selectors';
import { getDayList } from '@mui/x-scheduler-internals/get-day-list';
import { getStartOfWeek, getEndOfWeek } from '@mui/x-scheduler-internals/internals';
import { processDate } from '@mui/x-scheduler-internals/process-date';

const DAYS_IN_WEEK = 7;

/**
 * Number of consecutive days a day-time-grid based view can render. Restricted to the
 * values the views actually use so the `=== 7` (week-aligned) branch below cannot be
 * reached with an out-of-domain count (`0`, negative, or fractional) that would silently
 * produce an empty or garbage day list.
 */
export type DayTimeGridDayCount = 1 | 3 | 7;

/**
 * Builds an `EventCalendarViewConfig` for a day-time-grid based view.
 *
 * When `dayCount === 7` the config is week-aligned: it snaps the visible range to
 * `startOfWeek` and honors the `showWeekends` and `weekStartsOn` preferences. For any
 * other value, the config shows `dayCount` consecutive days starting from the current
 * visible date.
 */
export function createDayTimeGridViewConfig(
  dayCount: DayTimeGridDayCount,
): EventCalendarViewConfig {
  if (dayCount === DAYS_IN_WEEK) {
    return {
      siblingVisibleDateGetter: ({ state, delta }) =>
        state.adapter.addWeeks(
          getStartOfWeek(
            state.adapter,
            schedulerOtherSelectors.visibleDate(state),
            eventCalendarPreferenceSelectors.weekStartsOn(state),
          ),
          delta,
        ),
      visibleDaysSelector: createSelectorMemoized(
        (state: State) => state.adapter,
        schedulerOtherSelectors.visibleDate,
        eventCalendarPreferenceSelectors.showWeekends,
        eventCalendarPreferenceSelectors.weekStartsOn,
        (adapter, visibleDate, showWeekends, weekStartsOn) =>
          getDayList({
            adapter,
            start: getStartOfWeek(adapter, visibleDate, weekStartsOn),
            end: getEndOfWeek(adapter, visibleDate, weekStartsOn),
            excludeWeekends: !showWeekends,
          }),
      ),
    };
  }

  return {
    siblingVisibleDateGetter: ({ state, delta }) =>
      state.adapter.addDays(schedulerOtherSelectors.visibleDate(state), delta * dayCount),
    visibleDaysSelector: createSelectorMemoized(
      (state: State) => state.adapter,
      schedulerOtherSelectors.visibleDate,
      (adapter, visibleDate): SchedulerProcessedDate[] =>
        Array.from({ length: dayCount }, (_, index) =>
          processDate(adapter.addDays(visibleDate, index), adapter),
        ),
    ),
  };
}
