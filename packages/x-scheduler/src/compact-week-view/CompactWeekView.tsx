'use client';
import * as React from 'react';
import { useEventCalendarView } from '@mui/x-scheduler-internals/use-event-calendar-view';
import type { CompactWeekViewProps } from './CompactWeekView.types';
import { CompactDayTimeGrid } from '../internals/components/compact-day-time-grid';
import { createDayTimeGridViewConfig } from '../internals/utils/day-time-grid-view-config';

const COMPACT_WEEK_VIEW_CONFIG = createDayTimeGridViewConfig(7);

/**
 * A touch-optimized Week View (7 days) for narrow widths, to use inside the Event Calendar.
 */
export const CompactWeekView = React.memo(
  React.forwardRef(function CompactWeekView(
    props: CompactWeekViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    // Feature hooks
    const { days } = useEventCalendarView(COMPACT_WEEK_VIEW_CONFIG);

    return <CompactDayTimeGrid ref={forwardedRef} {...props} days={days} />;
  }),
);
