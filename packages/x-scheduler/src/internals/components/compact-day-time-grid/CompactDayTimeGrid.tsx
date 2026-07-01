'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import { schedulerOtherSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-internals/use-event-calendar-store-context';
import { DayTimeGrid } from '../day-time-grid/DayTimeGrid';
import type { DayTimeGridProps } from '../day-time-grid/DayTimeGrid.types';
import { CompactEventDrawer } from '../compact-event-drawer';
import { CompactEventEditingProvider, useEventEditingStyledContext } from '../event-editing';
import { EventToolbar } from '../event-toolbar';

// `position: relative` so the editing drawer can overlay the view (not the viewport) via its portal;
// `isolation: isolate` contains the overlay's stacking context so it sits above the grid events
// (which set their own `z-index`) without escaping above the rest of the page.
const CompactDayTimeGridRoot = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'CompactDayTimeGridRoot',
})(({ theme }) => ({
  position: 'relative',
  isolation: 'isolate',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  borderRadius: (theme.vars || theme).shape.borderRadius,
}));

// Holds the grid and absorbs the full height; the drawer overlays it rather than shrinking it.
const CompactDayTimeGridContent = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'CompactDayTimeGridContent',
})({
  flex: '1 1 0',
  minHeight: 0,
  display: 'flex',
});

// Docks the armed-event toolbar at the bottom of the view, above the grid events. Transparent to
// pointer events so taps around it still reach the grid to disarm; the toolbar itself re-enables them.
const CompactEventToolbarDock = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'CompactEventToolbarDock',
})(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: theme.spacing(2),
  display: 'flex',
  justifyContent: 'center',
  pointerEvents: 'none',
  zIndex: (theme.vars || theme).zIndex.fab,
  '& > *': {
    pointerEvents: 'auto',
  },
}));

const CompactDayTimeGridContainer = React.forwardRef(function CompactDayTimeGridContainer(
  props: DayTimeGridProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const store = useEventCalendarStoreContext();
  const { classes } = useEventEditingStyledContext();
  const viewRootRef = React.useRef<HTMLDivElement>(null);

  const editingMode = useStore(store, schedulerOtherSelectors.editingMode);
  const editingOccurrence = useStore(store, schedulerOtherSelectors.editingOccurrence);

  // Outside-tap dismissal for the armed state comes from `DayTimeGrid`'s `useDisarmOnOutsidePointer`;
  // the editing drawer brings its own backdrop / swipe-to-dismiss.
  return (
    <React.Fragment>
      <CompactDayTimeGridRoot ref={viewRootRef} className={classes.compactDayTimeGrid}>
        <CompactDayTimeGridContent className={classes.compactDayTimeGridContent}>
          <DayTimeGrid ref={forwardedRef} {...props} />
        </CompactDayTimeGridContent>
        {editingMode === 'armed' && editingOccurrence && (
          <CompactEventToolbarDock className={classes.compactEventToolbarDock}>
            <EventToolbar occurrence={editingOccurrence} />
          </CompactEventToolbarDock>
        )}
      </CompactDayTimeGridRoot>
      <CompactEventDrawer containerRef={viewRootRef} />
    </React.Fragment>
  );
});

/**
 * Shared layout for the compact (touch) views (`CompactDayView`, `CompactThreeDayView`,
 * `CompactWeekView`).
 *
 * Reuses `DayTimeGrid` (its events adapt to touch on their own); arming an event docks an action
 * toolbar at the bottom of the view, and its Edit opens the editing drawer overlaid on the view.
 * Each view only provides its own `days`.
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
