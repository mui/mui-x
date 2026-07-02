'use client';
import * as React from 'react';
import { useEventCalendarView } from '@mui/x-scheduler-internals/use-event-calendar-view';
import type { WeekViewProps } from './WeekView.types';
import { DayTimeGrid } from '../internals/components/day-time-grid/DayTimeGrid';
import { createDayTimeGridViewConfig } from '../internals/utils/day-time-grid-view-config';

const WEEK_VIEW_CONFIG = createDayTimeGridViewConfig(7);

/**
 * A Week View to use inside the Event Calendar.
 *
 * Renders the desktop event variant, which `DayTimeGrid` resolves from the default value of
 * `DayTimeGridInternalRenderersContext` — no provider is needed here.
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
