'use client';
import * as React from 'react';
import { createSelectorMemoized } from '@base-ui/utils/store';
import { EventCalendarViewConfig } from '@mui/x-scheduler-headless/models';
import { EventCalendarState as State } from '@mui/x-scheduler-headless/use-event-calendar';
import { useEventCalendarView } from '@mui/x-scheduler-headless/use-event-calendar-view';
import { processDate } from '@mui/x-scheduler-headless/process-date';
import { schedulerOtherSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { DayViewProps } from './DayView.types';
import { DayTimeGrid } from '../internals/components/day-time-grid/DayTimeGrid';

const DAY_VIEW_CONFIG: EventCalendarViewConfig = {
  siblingVisibleDateGetter: ({ state, delta }) =>
    state.adapter.addDays(schedulerOtherSelectors.visibleDate(state), delta),
  visibleDaysSelector: createSelectorMemoized(
    schedulerOtherSelectors.visibleDate,
    (state: State) => state.adapter,
    (visibleDate, adapter) => [processDate(visibleDate, adapter)],
  ),
};

/**
 * A Day View to use inside the Event Calendar.
 */
export const DayView = React.memo(
  React.forwardRef(function DayView(
    props: DayViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    // Feature hooks
    const { days } = useEventCalendarView(DAY_VIEW_CONFIG);

    return <DayTimeGrid ref={forwardedRef} days={days} {...props} />;
  }),
);
