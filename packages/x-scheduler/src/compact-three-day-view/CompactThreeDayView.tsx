'use client';
import * as React from 'react';
import { useEventCalendarView } from '@mui/x-scheduler-internals/use-event-calendar-view';
import { CompactThreeDayViewProps } from './CompactThreeDayView.types';
import { CompactDayTimeGrid } from '../internals/components/compact-day-time-grid';
import { createDayTimeGridViewConfig } from '../internals/utils/day-time-grid-view-config';

const COMPACT_THREE_DAY_VIEW_CONFIG = createDayTimeGridViewConfig(3);

/**
 * A touch-optimized 3-Day View (3 days) for narrow widths, to use inside the Event Calendar.
 */
export const CompactThreeDayView = React.memo(
  React.forwardRef(function CompactThreeDayView(
    props: CompactThreeDayViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    // Feature hooks
    const { days } = useEventCalendarView(COMPACT_THREE_DAY_VIEW_CONFIG);

    return <CompactDayTimeGrid ref={forwardedRef} {...props} days={days} />;
  }),
);
