'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { eventCalendarClasses } from '../../../event-calendar/eventCalendarClasses';
import { DayTimeGrid } from '../day-time-grid/DayTimeGrid';
import { DayTimeGridProps } from '../day-time-grid/DayTimeGrid.types';
import { CompactEventDrawer } from '../compact-event-drawer';
import { CompactEventEditingProvider, useEventEditingContext } from '../event-editing';
import { useDisarmOnOutsidePointer } from '../armed-occurrence';

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
  // The in-flow drawer has no outside-click dismissal of its own, so close it (which also disarms
  // the event, since arming follows the editing state) when a tap lands outside the open event.
  const { isOpen, onClose } = useEventEditingContext();
  const contentRef = React.useRef<HTMLDivElement>(null);

  // While editing, the first tap on the grid exits editing (closing the drawer) without creating or
  // arming another event; the next tap creates or arms. The resize handle is ignored so finishing a
  // resize gesture doesn't disarm.
  useDisarmOnOutsidePointer({
    ref: contentRef,
    active: isOpen,
    onDisarm: onClose,
    ignoreSelector: `.${eventCalendarClasses.timeGridEventResizeHandler}`,
  });

  return (
    <CompactDayTimeGridRoot>
      <CompactDayTimeGridContent ref={contentRef}>
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
