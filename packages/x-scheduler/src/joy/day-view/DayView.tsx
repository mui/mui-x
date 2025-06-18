'use client';
import * as React from 'react';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import { DayViewProps } from './DayView.types';
import { TimeGrid } from '../internals/components/time-grid/TimeGrid';
import { CalendarEvent } from '../models/events';

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

  const handleEventEdit = (event: CalendarEvent) => {
    // TODO: For now, event editing is fully controlled via onEventsChange
    if (!onEventsChange) {
      return;
    }

    onEventsChange(events.map((ev) => (ev.id === event.id ? event : ev)));
  };

  return (
    <TimeGrid
      ref={forwardedRef}
      days={[day]}
      events={filteredEvents}
      onEventEdit={handleEventEdit}
      className={className}
      {...other}
    />
  );
});
