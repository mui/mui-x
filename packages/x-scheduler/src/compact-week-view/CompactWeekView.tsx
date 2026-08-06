'use client';
import * as React from 'react';
import { useEventCalendarView } from '@mui/x-scheduler-internals/use-event-calendar-view';
import type { CompactWeekViewProps } from './CompactWeekView.types';
import { CompactDayTimeGrid } from '../internals/components/compact-day-time-grid';
import { createDayTimeGridViewDefinition } from '../internals/utils/day-time-grid-view-definition';

const COMPACT_WEEK_VIEW_DEFINITION = createDayTimeGridViewDefinition(7);

/**
 * A touch-optimized Week View (7 days) for narrow widths, to use inside the Event Calendar.
 */
export const CompactWeekView = React.memo(
  React.forwardRef(function CompactWeekView(
    props: CompactWeekViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    // Feature hooks
    const { days } = useEventCalendarView(COMPACT_WEEK_VIEW_DEFINITION);

    return <CompactDayTimeGrid ref={forwardedRef} {...props} days={days} />;
  }),
);
