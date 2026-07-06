'use client';
import * as React from 'react';
import { useEventCalendarView } from '@mui/x-scheduler-internals/use-event-calendar-view';
import type { CompactDayViewProps } from './CompactDayView.types';
import { DayTimeGrid } from '../internals/components/day-time-grid/DayTimeGrid';
import type { DayTimeGridInternalRenderers } from '../internals/components/day-time-grid/DayTimeGridInternalRenderersContext';
import { DayTimeGridInternalRenderersContext } from '../internals/components/day-time-grid/DayTimeGridInternalRenderersContext';
import { createDayTimeGridViewDefinition } from '../internals/utils/day-time-grid-view-definition';
import { TimeGridEventTouch } from '../internals/components/event/time-grid-event/TimeGridEventTouch';

const COMPACT_DAY_VIEW_DEFINITION = createDayTimeGridViewDefinition(1);

const COMPACT_DAY_VIEW_RENDERERS: DayTimeGridInternalRenderers = {
  timeGridEvent: TimeGridEventTouch,
};

/**
 * A touch-optimized Day View (1 day) for narrow widths, to use inside the Event Calendar.
 *
 * @warning This component is unstable. We are actively improving the Scheduler's mobile experience,
 * so its behavior and API may change in a future release.
 */
export const CompactDayView = React.memo(
  React.forwardRef(function CompactDayView(
    props: CompactDayViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    // Feature hooks
    const { days } = useEventCalendarView(COMPACT_DAY_VIEW_DEFINITION);

    return (
      <DayTimeGridInternalRenderersContext.Provider value={COMPACT_DAY_VIEW_RENDERERS}>
        <DayTimeGrid ref={forwardedRef} days={days} {...props} />
      </DayTimeGridInternalRenderersContext.Provider>
    );
  }),
);
