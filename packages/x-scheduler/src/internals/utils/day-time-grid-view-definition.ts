import { createSelectorMemoized } from '@base-ui/utils/store';
import type { EventCalendarViewDefinition } from '@mui/x-scheduler-internals/models';
import type { EventCalendarState as State } from '@mui/x-scheduler-internals/use-event-calendar';
import { schedulerOtherSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { eventCalendarPreferenceSelectors } from '@mui/x-scheduler-internals/event-calendar-selectors';
import { getDayListFromPlainDates } from '@mui/x-scheduler-internals/get-day-list';
import {
  addToAdapterDate,
  createStartOfPlainDate,
  getPlainDateWeekStart,
} from '@mui/x-scheduler-internals/internals';

const DAYS_IN_WEEK = 7;

/**
 * Number of consecutive days a day-time-grid based view can render. Restricted to the
 * values the views actually use so the `=== 7` (week-aligned) branch below cannot be
 * reached with an out-of-domain count (`0`, negative, or fractional) that would silently
 * produce an empty or garbage day list.
 */
export type DayTimeGridDayCount = 1 | 3 | 7;

/**
 * Builds an `EventCalendarViewDefinition` for a day-time-grid based view.
 *
 * When `dayCount === 7` the definition is week-aligned: it snaps the visible range to
 * the start of the week and honors the `showWeekends` and `weekStartsOn` preferences. For any
 * other value, the definition shows `dayCount` consecutive days starting from the current
 * visible date.
 */
export function createDayTimeGridViewDefinition(
  dayCount: DayTimeGridDayCount,
): EventCalendarViewDefinition {
  if (dayCount === DAYS_IN_WEEK) {
    return {
      siblingVisibleDateGetter: ({ state, delta }) =>
        createStartOfPlainDate(
          state.adapter,
          getPlainDateWeekStart(
            state.adapter,
            schedulerOtherSelectors.visiblePlainDate(state),
            eventCalendarPreferenceSelectors.weekStartsOn(state),
            state.displayTimezone,
          ).add({ weeks: delta }),
          state.displayTimezone,
        ),
      visibleDaysSelector: createSelectorMemoized(
        (state: State) => state.adapter,
        schedulerOtherSelectors.visiblePlainDate,
        schedulerOtherSelectors.displayTimezone,
        eventCalendarPreferenceSelectors.showWeekends,
        eventCalendarPreferenceSelectors.weekStartsOn,
        (adapter, visiblePlainDate, timezone, showWeekends, weekStartsOn) => {
          const weekStart = getPlainDateWeekStart(
            adapter,
            visiblePlainDate,
            weekStartsOn,
            timezone,
          );
          return getDayListFromPlainDates({
            adapter,
            firstPlainDate: weekStart,
            lastPlainDate: weekStart.add({ days: DAYS_IN_WEEK - 1 }),
            timezone,
            excludeWeekends: !showWeekends,
          });
        },
      ),
    };
  }

  return {
    siblingVisibleDateGetter: ({ state, delta }) =>
      addToAdapterDate(state.adapter, schedulerOtherSelectors.visibleDate(state), {
        days: delta * dayCount,
      }),
    visibleDaysSelector: createSelectorMemoized(
      (state: State) => state.adapter,
      schedulerOtherSelectors.visiblePlainDate,
      schedulerOtherSelectors.displayTimezone,
      (adapter, visiblePlainDate, timezone) =>
        getDayListFromPlainDates({
          adapter,
          firstPlainDate: visiblePlainDate,
          lastPlainDate: visiblePlainDate.add({ days: dayCount - 1 }),
          timezone,
        }),
    ),
  };
}
