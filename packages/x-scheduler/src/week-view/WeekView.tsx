'use client';
import * as React from 'react';
import { EventCalendarViewConfig } from '@mui/x-scheduler-internals/models';
import { getDayList } from '@mui/x-scheduler-internals/get-day-list';
import type { EventCalendarState as State } from '@mui/x-scheduler-internals/use-event-calendar';
import { schedulerOtherSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { eventCalendarPreferenceSelectors } from '@mui/x-scheduler-internals/event-calendar-selectors';
import { useEventCalendarView } from '@mui/x-scheduler-internals/use-event-calendar-view';
import { createSelectorMemoized } from '@base-ui/utils/store';
import { WeekViewProps } from './WeekView.types';
import { DayTimeGrid } from '../internals/components/day-time-grid/DayTimeGrid';

const WEEK_VIEW_CONFIG: EventCalendarViewConfig = {
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

/**
 * A Week View to use inside the Event Calendar.
 */
export const WeekView = React.memo(
  React.forwardRef(function WeekView(
    props: WeekViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    // Feature hooks
    const { days } = useEventCalendarView(WEEK_VIEW_CONFIG);

    return <DayTimeGrid ref={forwardedRef} days={days} {...props} />;
  }),
);
