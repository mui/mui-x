'use client';
import * as React from 'react';
import { createSelectorMemoized } from '@base-ui/utils/store';
import { EventCalendarViewConfig } from '@mui/x-scheduler-headless/models';
import type { EventCalendarState as State } from '@mui/x-scheduler-headless/use-event-calendar';
import { useEventCalendarView } from '@mui/x-scheduler-headless/use-event-calendar-view';
import { processDate } from '@mui/x-scheduler-headless/process-date';
import { schedulerOtherSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { DayViewProps } from './DayView.types';
import { DayTimeGrid } from '../internals/components/day-time-grid/DayTimeGrid';
import { isOccurrenceAllDayOrMultipleDay } from '../internals/utils/event-utils';

const dayVisibleDaysSelector = createSelectorMemoized(
  schedulerOtherSelectors.visibleDate,
  (state: State) => state.adapter,
  (visibleDate, adapter) => [processDate(visibleDate, adapter)],
);

const DAY_VIEW_CONFIG: EventCalendarViewConfig = {
  siblingVisibleDateGetter: ({ state, delta }) =>
    state.adapter.addDays(schedulerOtherSelectors.visibleDate(state), delta),
  visibleDaysSelector: dayVisibleDaysSelector,
  dayGrid: {
    shouldAddPosition: (occurrence, adapter) => isOccurrenceAllDayOrMultipleDay(occurrence, adapter),
  },
  timeGrid: {
    shouldAddPosition: (occurrence, adapter) => !isOccurrenceAllDayOrMultipleDay(occurrence, adapter),
    maxSpan: Number.POSITIVE_INFINITY,
  },
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
