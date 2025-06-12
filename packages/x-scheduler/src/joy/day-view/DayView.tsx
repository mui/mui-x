'use client';
import * as React from 'react';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import { DayViewProps } from './DayView.types';
import { TimeGrid } from '../internals/components/time-grid/TimeGrid';

const adapter = getAdapter();

export const DayView = React.forwardRef(function DayView(
  props: DayViewProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { events, day, className, ...other } = props;

  const filteredEvents = React.useMemo(() => {
    const dayStart = adapter.startOfDay(day);
    const dayEnd = adapter.endOfDay(day);
    return events.filter((event) => adapter.isWithinRange(event.start, [dayStart, dayEnd]));
  }, [events, day]);

  return (
    <TimeGrid
      ref={forwardedRef}
      days={[day]}
      events={filteredEvents}
      className={className}
      {...other}
    />
  );
});
