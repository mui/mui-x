'use client';
import * as React from 'react';
import { useEventCalendarView } from '@mui/x-scheduler-internals/use-event-calendar-view';
import type { CompactThreeDayViewProps } from './CompactThreeDayView.types';
import { CompactDayTimeGrid } from '../internals/components/compact-day-time-grid';
import { createDayTimeGridViewDefinition } from '../internals/utils/day-time-grid-view-definition';

const COMPACT_THREE_DAY_VIEW_DEFINITION = createDayTimeGridViewDefinition(3);

/**
 * A touch-optimized 3-Day View (3 days) for narrow widths, to use inside the Event Calendar.
 */
export const CompactThreeDayView = React.memo(
  React.forwardRef(function CompactThreeDayView(
    props: CompactThreeDayViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    // Feature hooks
    const { days } = useEventCalendarView(COMPACT_THREE_DAY_VIEW_DEFINITION);

    return <CompactDayTimeGrid ref={forwardedRef} {...props} days={days} />;
  }),
);
