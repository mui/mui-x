'use client';
import * as React from 'react';
import { useEventCalendarView } from '@mui/x-scheduler-internals/use-event-calendar-view';
import { CompactDayViewProps } from './CompactDayView.types';
import { CompactDayTimeGrid } from '../internals/components/compact-day-time-grid';
import { createDayTimeGridViewConfig } from '../internals/utils/day-time-grid-view-config';

const COMPACT_DAY_VIEW_CONFIG = createDayTimeGridViewConfig(1);

/**
 * A touch-optimized Day View (1 day) for narrow widths, to use inside the Event Calendar.
 */
export const CompactDayView = React.memo(
  React.forwardRef(function CompactDayView(
    props: CompactDayViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    // Feature hooks
    const { days } = useEventCalendarView(COMPACT_DAY_VIEW_CONFIG);

    return <CompactDayTimeGrid ref={forwardedRef} {...props} days={days} />;
  }),
);
