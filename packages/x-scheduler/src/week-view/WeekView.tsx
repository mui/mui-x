'use client';
import * as React from 'react';
import { useEventCalendarView } from '@mui/x-scheduler-internals/use-event-calendar-view';
import { WeekViewProps } from './WeekView.types';
import { DayTimeGrid } from '../internals/components/day-time-grid/DayTimeGrid';
import { createDayTimeGridViewConfig } from '../internals/utils/day-time-grid-view-config';

const WEEK_VIEW_CONFIG = createDayTimeGridViewConfig(7);

/**
 * A Week View to use inside the Event Calendar.
 *
 * Events adapt to the device on their own (mouse vs. touch), so no view-level config is needed.
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
