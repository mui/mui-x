'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useEventCalendarView } from '@mui/x-scheduler-internals/use-event-calendar-view';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-internals/use-event-calendar-store-context';
import { eventCalendarViewSelectors } from '@mui/x-scheduler-internals/event-calendar-selectors';
import type { DayViewProps } from './DayView.types';
import { DayTimeGrid } from '../internals/components/day-time-grid/DayTimeGrid';
import { createDayTimeGridViewDefinition } from '../internals/utils/day-time-grid-view-definition';

const DAY_VIEW_DEFINITION = createDayTimeGridViewDefinition(1);

/**
 * A Day View to use inside the Event Calendar.
 *
 * Events adapt to the device on their own (mouse vs. touch), so no view-level config is needed.
 */
export const DayView = React.memo(
  React.forwardRef(function DayView(
    props: DayViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    // Context hooks
    const store = useEventCalendarStoreContext();

    // Feature hooks
    const { days } = useEventCalendarView(DAY_VIEW_DEFINITION);

    // Selector hooks
    const config = useStore(store, eventCalendarViewSelectors.timeGridConfig, 'day');

    return (
      <DayTimeGrid
        ref={forwardedRef}
        days={days}
        startTime={config?.startTime}
        endTime={config?.endTime}
        {...props}
      />
    );
  }),
);
