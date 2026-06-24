'use client';
import * as React from 'react';
import { useEventCalendarView } from '@mui/x-scheduler-internals/use-event-calendar-view';
import { DayViewProps } from './DayView.types';
import { DayTimeGrid } from '../internals/components/day-time-grid/DayTimeGrid';
import { createDayTimeGridViewConfig } from '../internals/utils/day-time-grid-view-config';

const DAY_VIEW_CONFIG = createDayTimeGridViewConfig(1);

/**
 * A Day View to use inside the Event Calendar.
 *
 * Events adapt to the device on their own (click on a mouse, touch on a touch screen), so no
 * view-level configuration is needed here.
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
