'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useEventCalendarView } from '@mui/x-scheduler-internals/use-event-calendar-view';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-internals/use-event-calendar-store-context';
import { eventCalendarViewSelectors } from '@mui/x-scheduler-internals/event-calendar-selectors';
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
    // Context hooks
    const store = useEventCalendarStoreContext();

    // Feature hooks
    const { days } = useEventCalendarView(COMPACT_WEEK_VIEW_DEFINITION);

    // Selector hooks
    const config = useStore(store, eventCalendarViewSelectors.timeGridConfig, 'week');

    return (
      <CompactDayTimeGrid
        ref={forwardedRef}
        days={days}
        startTime={config?.startTime}
        endTime={config?.endTime}
        {...props}
      />
    );
  }),
);
