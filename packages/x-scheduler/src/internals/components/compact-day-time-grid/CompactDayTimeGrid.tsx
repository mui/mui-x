'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { DayTimeGrid } from '../day-time-grid/DayTimeGrid';
import { DayTimeGridProps } from '../day-time-grid/DayTimeGrid.types';
import { CompactEventDrawer } from '../compact-event-drawer';
import { CompactEventEditingProvider } from '../event-editing';

// Column layout: drawer sits below the grid, which shrinks to make room rather than being overlaid.
const CompactDayTimeGridRoot = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'CompactDayTimeGridRoot',
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  borderRadius: (theme.vars || theme).shape.borderRadius,
}));

// Holds the grid and absorbs the remaining height; shrinks as the drawer grows.
const CompactDayTimeGridContent = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'CompactDayTimeGridContent',
})({
  flex: '1 1 0',
  minHeight: 0,
  display: 'flex',
});

const CompactDayTimeGridContainer = React.forwardRef(function CompactDayTimeGridContainer(
  props: DayTimeGridProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  // Outside-tap dismissal comes from `DayTimeGrid` (shared with the desktop dialog), so the backdrop-less drawer gets it for free.
  return (
    <CompactDayTimeGridRoot>
      <CompactDayTimeGridContent>
        <DayTimeGrid ref={forwardedRef} {...props} />
      </CompactDayTimeGridContent>
      <CompactEventDrawer />
    </CompactDayTimeGridRoot>
  );
});

/**
 * Shared layout for the compact (touch) views (`CompactDayView`, `CompactThreeDayView`,
 * `CompactWeekView`).
 *
 * Reuses `DayTimeGrid` (its events adapt to touch on their own), stacks the editing drawer below,
 * and drives tap-to-exit through the shared editing surface. Each view only provides its own `days`.
 */
export const CompactDayTimeGrid = React.forwardRef(function CompactDayTimeGrid(
  props: DayTimeGridProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  return (
    <CompactEventEditingProvider>
      <CompactDayTimeGridContainer ref={forwardedRef} {...props} />
    </CompactEventEditingProvider>
  );
});
