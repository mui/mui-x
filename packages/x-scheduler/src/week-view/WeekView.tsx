'use client';
import * as React from 'react';
import { useEventCalendarView } from '@mui/x-scheduler-internals/use-event-calendar-view';
import { WeekViewProps } from './WeekView.types';
import { DayTimeGrid } from '../internals/components/day-time-grid/DayTimeGrid';
import {
  DayTimeGridInternalRenderers,
  DayTimeGridInternalRenderersContext,
} from '../internals/components/day-time-grid/DayTimeGridInternalRenderersContext';
import { createDayTimeGridViewConfig } from '../internals/utils/day-time-grid-view-config';
import { TimeGridEvent } from '../internals/components/event/time-grid-event/TimeGridEvent';

const WEEK_VIEW_CONFIG = createDayTimeGridViewConfig(7);

const WEEK_VIEW_RENDERERS: DayTimeGridInternalRenderers = {
  timeGridEvent: TimeGridEvent,
};

/**
 * A Week View to use inside the Event Calendar.
 */
export const WeekView = React.memo(
  React.forwardRef(function WeekView(
    props: WeekViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    // Feature hooks
    const { days } = useEventCalendarView(WEEK_VIEW_CONFIG);

    return (
      <DayTimeGridInternalRenderersContext.Provider value={WEEK_VIEW_RENDERERS}>
        <DayTimeGrid ref={forwardedRef} days={days} {...props} />
      </DayTimeGridInternalRenderersContext.Provider>
    );
  }),
);
