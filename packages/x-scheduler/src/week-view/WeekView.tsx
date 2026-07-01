'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useEventCalendarView } from '@mui/x-scheduler-internals/use-event-calendar-view';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-internals/use-event-calendar-store-context';
import { eventCalendarViewSelectors } from '@mui/x-scheduler-internals/event-calendar-selectors';
import type { WeekViewProps } from './WeekView.types';
import { DayTimeGrid } from '../internals/components/day-time-grid/DayTimeGrid';
import { createDayTimeGridViewDefinition } from '../internals/utils/day-time-grid-view-definition';

const WEEK_VIEW_DEFINITION = createDayTimeGridViewDefinition(7);

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
    // Context hooks
    const store = useEventCalendarStoreContext();

    // Feature hooks
    const { days } = useEventCalendarView(WEEK_VIEW_DEFINITION);

    // Selector hooks
    const config = useStore(store, eventCalendarViewSelectors.timeGridConfig, 'week');

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
