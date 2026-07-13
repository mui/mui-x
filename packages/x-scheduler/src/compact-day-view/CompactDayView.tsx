'use client';
import * as React from 'react';
import { useEventCalendarView } from '@mui/x-scheduler-internals/use-event-calendar-view';
import type { CompactDayViewProps } from './CompactDayView.types';
import { CompactDayTimeGrid } from '../internals/components/compact-day-time-grid';
import { createDayTimeGridViewDefinition } from '../internals/utils/day-time-grid-view-definition';

const COMPACT_DAY_VIEW_DEFINITION = createDayTimeGridViewDefinition(1);

/**
 * A touch-optimized Day View (1 day) for narrow widths, to use inside the Event Calendar.
 */
export const CompactDayView = React.memo(
  React.forwardRef(function CompactDayView(
    props: CompactDayViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    // Feature hooks
    const { days } = useEventCalendarView(COMPACT_DAY_VIEW_DEFINITION);

    return <CompactDayTimeGrid ref={forwardedRef} {...props} days={days} />;
  }),
);
