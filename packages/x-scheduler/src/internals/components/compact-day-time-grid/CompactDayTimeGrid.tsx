'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { eventCalendarClasses } from '../../../event-calendar/eventCalendarClasses';
import { DayTimeGrid } from '../day-time-grid/DayTimeGrid';
import { DayTimeGridProps } from '../day-time-grid/DayTimeGrid.types';
import {
  DayTimeGridInternalRenderers,
  DayTimeGridInternalRenderersContext,
} from '../day-time-grid/DayTimeGridInternalRenderersContext';
import { TimeGridEventTouch } from '../event/time-grid-event/TimeGridEventTouch';
import { CompactEventDrawer } from '../compact-event-drawer';
import { CompactEventEditingProvider, useEventEditingContext } from '../event-editing';
import { ArmedOccurrenceProvider, useDisarmOnOutsidePointer } from '../armed-occurrence';

// Every compact (touch) view renders its events through the same touch variant.
const COMPACT_RENDERERS: DayTimeGridInternalRenderers = {
  timeGridEvent: TimeGridEventTouch,
};

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
  // Concept 2 — arming and the drawer's open state follow the editing surface (the shared modal).
  const { isOpen, data, onClose } = useEventEditingContext();
  const contentRef = React.useRef<HTMLDivElement>(null);

  // The editing surface is the current producer of arming: the open occurrence is the armed one.
  const armedKey = isOpen ? (data?.key ?? null) : null;

  // While an occurrence is armed, the first tap anywhere on the grid exits editing (disarming and
  // closing the drawer) and is swallowed — it does NOT create an event or arm another one. Only
  // the next tap, with nothing armed, creates or arms. A tap that finishes a resize gesture lands
  // on the handle and is ignored so it doesn't disarm.
  useDisarmOnOutsidePointer({
    ref: contentRef,
    active: isOpen,
    onDisarm: onClose,
    ignoreSelector: `.${eventCalendarClasses.timeGridEventResizeHandler}`,
  });

  return (
    <DayTimeGridInternalRenderersContext.Provider value={COMPACT_RENDERERS}>
      <ArmedOccurrenceProvider armedKey={armedKey} onDisarm={onClose}>
        <CompactDayTimeGridRoot>
          <CompactDayTimeGridContent ref={contentRef}>
            <DayTimeGrid ref={forwardedRef} {...props} />
          </CompactDayTimeGridContent>
          <CompactEventDrawer />
        </CompactDayTimeGridRoot>
      </ArmedOccurrenceProvider>
    </DayTimeGridInternalRenderersContext.Provider>
  );
});

/**
 * Shared layout for the compact (touch) views (`CompactDayView`, `CompactThreeDayView`,
 * `CompactWeekView`).
 *
 * It reuses `DayTimeGrid` and swaps in the touch event variant through the internal renderers
 * context, stacks the mock editing drawer below the grid, and drives the tap-to-arm / tap-to-exit
 * interactions through the shared `EventDialog` editing surface (the one stacking backbone). The
 * only thing each view provides is its own `days` (a 1-, 3- or 7-day range).
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
