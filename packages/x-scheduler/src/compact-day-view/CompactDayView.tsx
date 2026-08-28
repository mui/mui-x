'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useEventCalendarView } from '@mui/x-scheduler-internals/use-event-calendar-view';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-internals/use-event-calendar-store-context';
import { eventCalendarViewSelectors } from '@mui/x-scheduler-internals/event-calendar-selectors';
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
    // Context hooks
    const store = useEventCalendarStoreContext();

    // Feature hooks
    const { days } = useEventCalendarView(COMPACT_DAY_VIEW_DEFINITION);

    // Selector hooks
    const config = useStore(store, eventCalendarViewSelectors.timeGridConfig, 'day');

    return (
      <CompactDayTimeGrid
        ref={forwardedRef}
        days={days}
        startTime={config?.startTime}
        endTime={config?.endTime}
        hourRangeSource="viewConfig.day"
        {...props}
      />
    );
  }),
);
