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
import {
  CompactEventDrawer,
  CompactEventDrawerProvider,
  useCompactEventDrawerContext,
} from '../compact-event-drawer';

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
  const { isOpen, onClose } = useCompactEventDrawerContext();
  const contentRef = React.useRef<HTMLDivElement>(null);

  // While the drawer is open, the first tap anywhere on the grid exits editing (closing the
  // drawer and disarming the resize) and is swallowed — it does NOT create an event or arm
  // another one. Only the next tap, with the drawer closed, creates or arms.
  React.useEffect(() => {
    const content = contentRef.current;
    if (!isOpen || !content) {
      return undefined;
    }
    const onClickCapture = (event: MouseEvent) => {
      // A resize gesture ends with a click on its handle — ignore it so finishing a resize
      // doesn't close the drawer or disarm the event.
      if (
        event.target instanceof Element &&
        event.target.closest(`.${eventCalendarClasses.timeGridEventResizeHandler}`)
      ) {
        return;
      }
      // Swallow the click so it reaches neither the column's create handler nor an event's
      // open trigger.
      event.stopPropagation();
      event.preventDefault();
      onClose();
    };
    content.addEventListener('click', onClickCapture, true);
    return () => {
      content.removeEventListener('click', onClickCapture, true);
    };
  }, [isOpen, onClose]);

  return (
    <DayTimeGridInternalRenderersContext.Provider value={COMPACT_RENDERERS}>
      <CompactDayTimeGridRoot>
        <CompactDayTimeGridContent ref={contentRef}>
          <DayTimeGrid ref={forwardedRef} {...props} />
        </CompactDayTimeGridContent>
        <CompactEventDrawer />
      </CompactDayTimeGridRoot>
    </DayTimeGridInternalRenderersContext.Provider>
  );
});

/**
 * Shared layout for the compact (touch) views (`CompactDayView`, `CompactThreeDayView`,
 * `CompactWeekView`).
 *
 * It reuses `DayTimeGrid` and swaps in the touch event variant through the internal renderers
 * context, stacks the mock editing drawer below the grid, and bridges the tap-to-arm / tap-to-
 * exit interactions into the dedicated `CompactEventDrawer` context. The only thing each view
 * provides is its own `days` (a 1-, 3- or 7-day range).
 */
export const CompactDayTimeGrid = React.forwardRef(function CompactDayTimeGrid(
  props: DayTimeGridProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  return (
    <CompactEventDrawerProvider>
      <CompactDayTimeGridContainer ref={forwardedRef} {...props} />
    </CompactEventDrawerProvider>
  );
});
