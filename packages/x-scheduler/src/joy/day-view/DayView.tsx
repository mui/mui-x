'use client';
import * as React from 'react';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import { DayViewProps } from './DayView.types';
import { TimeGrid } from '../internals/components/time-grid/TimeGrid';
import { CalendarEvent, EventAction } from '../models/events';

const adapter = getAdapter();

export const DayView = React.forwardRef(function DayView(
  props: DayViewProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { events, day, className, onEventsChange, ...other } = props;

  const filteredEvents = React.useMemo(() => {
    const dayStart = adapter.startOfDay(day);
    const dayEnd = adapter.endOfDay(day);
    return events.filter((event) => adapter.isWithinRange(event.start, [dayStart, dayEnd]));
  }, [events, day]);

  const handleEventAction = (event: CalendarEvent, action: EventAction) => {
    if (!onEventsChange) {
      return;
    }

    if (action === 'edit') {
      onEventsChange(events.map((ev) => (ev.id === event.id ? event : ev)));
    }
  };

  return (
    <TimeGrid
      ref={forwardedRef}
      days={[day]}
      events={filteredEvents}
      onEventAction={handleEventAction}
      className={className}
      {...other}
    />
  );
});
