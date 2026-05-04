'use client';
import * as React from 'react';
import { EventCalendarViewConfig } from '@mui/x-scheduler-headless/models';
import { getDayList } from '@mui/x-scheduler-headless/get-day-list';
import type { EventCalendarState as State } from '@mui/x-scheduler-headless/use-event-calendar';
import { schedulerOtherSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { eventCalendarPreferenceSelectors } from '@mui/x-scheduler-headless/event-calendar-selectors';
import { useEventCalendarView } from '@mui/x-scheduler-headless/use-event-calendar-view';
import { createSelectorMemoized } from '@base-ui/utils/store';
import { WeekViewProps } from './WeekView.types';
import { DayTimeGrid } from '../internals/components/day-time-grid/DayTimeGrid';
import { isOccurrenceAllDayOrMultipleDay } from '../internals/utils/event-utils';

const weekVisibleDaysSelector = createSelectorMemoized(
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
);

const WEEK_VIEW_CONFIG: EventCalendarViewConfig = {
  siblingVisibleDateGetter: ({ state, delta }) =>
    state.adapter.addWeeks(
      state.adapter.startOfWeek(schedulerOtherSelectors.visibleDate(state)),
      delta,
    ),
  visibleDaysSelector: weekVisibleDaysSelector,
  dayGrid: {
    shouldAddPosition: (occurrence, adapter) =>
      isOccurrenceAllDayOrMultipleDay(occurrence, adapter),
  },
  timeGrid: {
    shouldAddPosition: (occurrence, adapter) =>
      !isOccurrenceAllDayOrMultipleDay(occurrence, adapter),
    maxSpan: Number.POSITIVE_INFINITY,
  },
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
