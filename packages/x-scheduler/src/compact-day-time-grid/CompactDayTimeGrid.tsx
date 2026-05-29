'use client';
import * as React from 'react';
import { EventCalendarViewConfig } from '@mui/x-scheduler-internals/models';
import { useEventCalendarView } from '@mui/x-scheduler-internals/use-event-calendar-view';
import { CompactDayTimeGridDayCount, CompactDayTimeGridProps } from './CompactDayTimeGrid.types';
import { DayTimeGrid } from '../internals/components/day-time-grid/DayTimeGrid';
import {
  DayTimeGridInternalRenderers,
  DayTimeGridInternalRenderersContext,
} from '../internals/components/day-time-grid/DayTimeGridInternalRenderersContext';
import { createDayTimeGridViewConfig } from '../internals/utils/day-time-grid-view-config';
import { TimeGridEventMobile } from '../internals/components/event/time-grid-event/TimeGridEventMobile';

const COMPACT_DAY_TIME_GRID_CONFIGS: Record<CompactDayTimeGridDayCount, EventCalendarViewConfig> = {
  1: createDayTimeGridViewConfig(1),
  3: createDayTimeGridViewConfig(3),
  7: createDayTimeGridViewConfig(7),
};

const COMPACT_DAY_TIME_GRID_RENDERERS: DayTimeGridInternalRenderers = {
  timeGridEvent: TimeGridEventMobile,
};

/**
 * A compact day/time grid optimized for mobile / narrow widths.
 *
 * For now this view is opt-in and only intended for standalone usage at narrow widths.
 */
export const CompactDayTimeGrid = React.memo(
  React.forwardRef(function CompactDayTimeGrid(
    props: CompactDayTimeGridProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    const { dayCount = 3, ...other } = props;

    // Feature hooks
    const { days } = useEventCalendarView(COMPACT_DAY_TIME_GRID_CONFIGS[dayCount]);

    return (
      <DayTimeGridInternalRenderersContext.Provider value={COMPACT_DAY_TIME_GRID_RENDERERS}>
        <DayTimeGrid ref={forwardedRef} days={days} {...other} />
      </DayTimeGridInternalRenderersContext.Provider>
    );
  }),
);
