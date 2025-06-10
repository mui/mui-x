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
  const { events, className, ...other } = props;

  const day = adapter.date('2025-05-26');

  const dayStart = adapter.startOfDay(day);
  const dayEnd = adapter.endOfDay(day);

  const filteredEvents = React.useMemo(
    () => events.filter((event) => adapter.isWithinRange(event.start, [dayStart, dayEnd])),
    [events, dayStart, dayEnd],
  );

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
