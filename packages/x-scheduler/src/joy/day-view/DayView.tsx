'use client';
import * as React from 'react';
import { useAdapter } from '../../primitives/utils/adapter/useAdapter';
import { DayViewProps } from './DayView.types';
import { TimeGridView } from '../time-grid-view/TimeGridView';

export const DayView = React.forwardRef(function DayView(
  props: DayViewProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { events, className, ...other } = props;

  const adapter = useAdapter();
  const day = adapter.date('2025-05-26');

  const dayStart = adapter.startOfDay(day);
  const dayEnd = adapter.endOfDay(day);

  const filteredEvents = events.filter((event) =>
    adapter.isWithinRange(event.start, [dayStart, dayEnd]),
  );

  return (
    <TimeGridView
      ref={forwardedRef}
      days={[day]}
      events={filteredEvents}
      className={className}
      {...other}
    />
  );
});
