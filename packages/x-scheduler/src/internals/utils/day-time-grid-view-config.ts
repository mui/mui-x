import { createSelectorMemoized } from '@base-ui/utils/store';
import { EventCalendarViewConfig, SchedulerProcessedDate } from '@mui/x-scheduler-internals/models';
import type { EventCalendarState as State } from '@mui/x-scheduler-internals/use-event-calendar';
import { schedulerOtherSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { eventCalendarPreferenceSelectors } from '@mui/x-scheduler-internals/event-calendar-selectors';
import { getDayList } from '@mui/x-scheduler-internals/get-day-list';
import { processDate } from '@mui/x-scheduler-internals/process-date';

const DAYS_IN_WEEK = 7;

/**
 * Builds an `EventCalendarViewConfig` for a day-time-grid based view.
 *
 * When `dayCount === 7` the config is week-aligned: it snaps the visible range to
 * `startOfWeek` and honors the `showWeekends` preference. For any other value, the
 * config shows `dayCount` consecutive days starting from the current visible date.
 */
export function createDayTimeGridViewConfig(dayCount: number): EventCalendarViewConfig {
  if (dayCount === DAYS_IN_WEEK) {
    return {
      siblingVisibleDateGetter: ({ state, delta }) =>
        state.adapter.addWeeks(
          state.adapter.startOfWeek(schedulerOtherSelectors.visibleDate(state)),
          delta,
        ),
      visibleDaysSelector: createSelectorMemoized(
        (state: State) => state.adapter,
        schedulerOtherSelectors.visibleDate,
        eventCalendarPreferenceSelectors.showWeekends,
        (adapter, visibleDate, showWeekends) =>
          getDayList({
            adapter,
            start: adapter.startOfWeek(visibleDate),
            end: adapter.endOfWeek(visibleDate),
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
