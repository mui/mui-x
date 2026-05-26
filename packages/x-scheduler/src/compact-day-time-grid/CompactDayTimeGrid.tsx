'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { EventCalendarViewConfig } from '@mui/x-scheduler-internals/models';
import { useEventCalendarView } from '@mui/x-scheduler-internals/use-event-calendar-view';
import { CompactDayTimeGridDayCount, CompactDayTimeGridProps } from './CompactDayTimeGrid.types';
import { DayTimeGrid } from '../internals/components/day-time-grid/DayTimeGrid';
import { createDayTimeGridViewConfig } from '../internals/utils/day-time-grid-view-config';
import { TimeGridEventMobile } from '../internals/components/event/time-grid-event/TimeGridEventMobile';

const COMPACT_DAY_TIME_GRID_CONFIGS: Record<CompactDayTimeGridDayCount, EventCalendarViewConfig> = {
  1: createDayTimeGridViewConfig(1),
  3: createDayTimeGridViewConfig(3),
  7: createDayTimeGridViewConfig(7),
};

/**
 * A compact day/time grid optimized for mobile / narrow widths.
 *
 * For now this view is opt-in and only intended for standalone usage at narrow widths.
 */
const CompactDayTimeGrid = React.memo(
  React.forwardRef(function CompactDayTimeGrid(
    props: CompactDayTimeGridProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    const { dayCount = 3, ...other } = props;

    // Feature hooks
    const { days } = useEventCalendarView(COMPACT_DAY_TIME_GRID_CONFIGS[dayCount]);

    return (
      <DayTimeGrid
        ref={forwardedRef}
        days={days}
        slots={{ timeGridEvent: TimeGridEventMobile }}
        {...other}
      />
    );
  }),
);

CompactDayTimeGrid.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The number of days to display starting from the visible date.
   * - `1`: a single day.
   * - `3`: three consecutive days.
   * - `7`: the full week.
   * @default 3
   */
  dayCount: PropTypes.oneOf([1, 3, 7]),
} as any;

export { CompactDayTimeGrid };
