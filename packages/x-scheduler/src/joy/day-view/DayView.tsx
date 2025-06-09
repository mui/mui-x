'use client';
import * as React from 'react';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import { DayViewProps } from './DayView.types';
import { TimeGridView } from '../time-grid-view/TimeGridView';

const adapter = getAdapter();

export const DayView = React.forwardRef(function DayView(
  props: DayViewProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { events, className, ...other } = props;

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
