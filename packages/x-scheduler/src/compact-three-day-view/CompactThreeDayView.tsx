'use client';
import * as React from 'react';
import { useEventCalendarView } from '@mui/x-scheduler-internals/use-event-calendar-view';
import type { CompactThreeDayViewProps } from './CompactThreeDayView.types';
import { DayTimeGrid } from '../internals/components/day-time-grid/DayTimeGrid';
import type { DayTimeGridInternalRenderers } from '../internals/components/day-time-grid/DayTimeGridInternalRenderersContext';
import { DayTimeGridInternalRenderersContext } from '../internals/components/day-time-grid/DayTimeGridInternalRenderersContext';
import { createDayTimeGridViewConfig } from '../internals/utils/day-time-grid-view-config';
import { TimeGridEventTouch } from '../internals/components/event/time-grid-event/TimeGridEventTouch';

const COMPACT_THREE_DAY_VIEW_CONFIG = createDayTimeGridViewConfig(3);

const COMPACT_THREE_DAY_VIEW_RENDERERS: DayTimeGridInternalRenderers = {
  timeGridEvent: TimeGridEventTouch,
};

/**
 * A touch-optimized 3-Day View (3 days) for narrow widths, to use inside the Event Calendar.
 */
export const CompactThreeDayView = React.memo(
  React.forwardRef(function CompactThreeDayView(
    props: CompactThreeDayViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    // Feature hooks
    const { days } = useEventCalendarView(COMPACT_THREE_DAY_VIEW_CONFIG);

    return (
      <DayTimeGridInternalRenderersContext.Provider value={COMPACT_THREE_DAY_VIEW_RENDERERS}>
        <DayTimeGrid ref={forwardedRef} days={days} {...props} />
      </DayTimeGridInternalRenderersContext.Provider>
    );
  }),
);
