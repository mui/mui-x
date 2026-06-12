'use client';
import * as React from 'react';
import { useEventCalendarView } from '@mui/x-scheduler-internals/use-event-calendar-view';
import { DayViewProps } from './DayView.types';
import { DayTimeGrid } from '../internals/components/day-time-grid/DayTimeGrid';
import {
  DayTimeGridInternalRenderers,
  DayTimeGridInternalRenderersContext,
} from '../internals/components/day-time-grid/DayTimeGridInternalRenderersContext';
import { createDayTimeGridViewConfig } from '../internals/utils/day-time-grid-view-config';
import { TimeGridEvent } from '../internals/components/event/time-grid-event/TimeGridEvent';

const DAY_VIEW_CONFIG = createDayTimeGridViewConfig(1);

const DAY_VIEW_RENDERERS: DayTimeGridInternalRenderers = {
  timeGridEvent: TimeGridEvent,
};

/**
 * A Day View to use inside the Event Calendar.
 */
export const DayView = React.memo(
  React.forwardRef(function DayView(
    props: DayViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    // Feature hooks
    const { days } = useEventCalendarView(DAY_VIEW_CONFIG);

    return (
      <DayTimeGridInternalRenderersContext.Provider value={DAY_VIEW_RENDERERS}>
        <DayTimeGrid ref={forwardedRef} days={days} {...props} />
      </DayTimeGridInternalRenderersContext.Provider>
    );
  }),
);
