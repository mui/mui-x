'use client';
import * as React from 'react';
import { useDayList } from '../../primitives/use-day-list/useDayList';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import { WeekViewProps } from './WeekView.types';
import { TimeGrid } from '../internals/components/time-grid/TimeGrid';

const adapter = getAdapter();

export const WeekView = React.forwardRef(function WeekView(
  props: WeekViewProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { events, className, ...other } = props;

  const today = adapter.date('2025-05-26');
  const getDayList = useDayList();

  const currentWeekDays = React.useMemo(
    () => getDayList({ date: today.startOf('week'), amount: 7 }),
    [getDayList, today],
  );

  const filteredEvents = React.useMemo(() => {
    const weekStart = adapter.startOfDay(currentWeekDays[0]);
    const weekEnd = adapter.endOfDay(currentWeekDays[6]);
    return events.filter((event) => adapter.isWithinRange(event.start, [weekStart, weekEnd]));
  }, [events, currentWeekDays]);

  return (
    <TimeGrid
      ref={forwardedRef}
      days={currentWeekDays}
      events={filteredEvents}
      className={className}
      {...other}
    />
  );
});
