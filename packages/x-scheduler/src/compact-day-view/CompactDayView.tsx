'use client';
import * as React from 'react';
import { useEventCalendarView } from '@mui/x-scheduler-internals/use-event-calendar-view';
import { CompactDayViewProps } from './CompactDayView.types';
import { DayTimeGrid } from '../internals/components/day-time-grid/DayTimeGrid';
import {
  DayTimeGridInternalRenderers,
  DayTimeGridInternalRenderersContext,
} from '../internals/components/day-time-grid/DayTimeGridInternalRenderersContext';
import { createDayTimeGridViewConfig } from '../internals/utils/day-time-grid-view-config';
import { TimeGridEventTouch } from '../internals/components/event/time-grid-event/TimeGridEventTouch';

const COMPACT_DAY_VIEW_CONFIG = createDayTimeGridViewConfig(1);

const COMPACT_DAY_VIEW_RENDERERS: DayTimeGridInternalRenderers = {
  timeGridEvent: TimeGridEventTouch,
};

/**
 * A touch-optimized Day View (1 day) for narrow widths, to use inside the Event Calendar.
 */
export const CompactDayView = React.memo(
  React.forwardRef(function CompactDayView(
    props: CompactDayViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    // Feature hooks
    const { days } = useEventCalendarView(COMPACT_DAY_VIEW_CONFIG);

    return (
      <DayTimeGridInternalRenderersContext.Provider value={COMPACT_DAY_VIEW_RENDERERS}>
        <DayTimeGrid ref={forwardedRef} days={days} {...props} />
      </DayTimeGridInternalRenderersContext.Provider>
    );
  }),
);
