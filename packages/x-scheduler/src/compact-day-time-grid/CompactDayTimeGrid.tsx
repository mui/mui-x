'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { EventCalendarViewConfig } from '@mui/x-scheduler-internals/models';
import { useEventCalendarView } from '@mui/x-scheduler-internals/use-event-calendar-view';
import { CompactDayTimeGridDayCount, CompactDayTimeGridProps } from './CompactDayTimeGrid.types';
import { eventCalendarClasses } from '../event-calendar/eventCalendarClasses';
import { DayTimeGrid } from '../internals/components/day-time-grid/DayTimeGrid';
import { createDayTimeGridViewConfig } from '../internals/utils/day-time-grid-view-config';
import { TimeGridEventMobile } from '../internals/components/event/time-grid-event/TimeGridEventMobile';
import {
  CompactEventDrawer,
  useCompactEventDrawerContext,
} from '../internals/components/compact-event-drawer';

const COMPACT_DAY_TIME_GRID_CONFIGS: Record<CompactDayTimeGridDayCount, EventCalendarViewConfig> = {
  1: createDayTimeGridViewConfig(1),
  3: createDayTimeGridViewConfig(3),
  7: createDayTimeGridViewConfig(7),
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
      <CompactDayTimeGridRoot>
        <CompactDayTimeGridContent ref={contentRef}>
          <DayTimeGrid
            ref={forwardedRef}
            days={days}
            slots={{ timeGridEvent: TimeGridEventMobile }}
            {...other}
          />
        </CompactDayTimeGridContent>
        <CompactEventDrawer />
      </CompactDayTimeGridRoot>
    );
  }),
);
