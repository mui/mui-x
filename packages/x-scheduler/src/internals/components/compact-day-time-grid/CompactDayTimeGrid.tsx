'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { DayTimeGrid } from '../day-time-grid/DayTimeGrid';
import { DayTimeGridProps } from '../day-time-grid/DayTimeGrid.types';
import { CompactEventDrawer } from '../compact-event-drawer';
import { CompactEventEditingProvider } from '../event-editing';

// Column layout so the drawer sits below the grid and the grid shrinks to make room for it
// (rather than the drawer overlaying the grid).
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
  // Tap-to-exit-editing lives in `DayTimeGrid` (shared with the desktop dialog), so the in-flow
  // drawer — which has no backdrop of its own — gets the same outside-tap dismissal for free.
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
 * It reuses `DayTimeGrid` (whose events adapt to touch on their own), stacks the editing drawer
 * below the grid, and drives the tap-to-exit interaction through the shared editing surface. Each
 * view only provides its own `days` (a 1-, 3- or 7-day range).
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
