'use client';
import * as React from 'react';
import { useDayList } from '../../primitives/use-day-list/useDayList';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import { WeekViewProps } from './WeekView.types';
import { TimeGrid } from '../internals/components/time-grid/TimeGrid';
import { CalendarEvent, EventAction } from '../models/events';

const adapter = getAdapter();

export const WeekView = React.forwardRef(function WeekView(
  props: WeekViewProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { events, className, onEventsChange, ...other } = props;

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

  const handleEventAction = (event: CalendarEvent, action: EventAction) => {
    // TODO: For now, event editing is fully controlled via onEventsChange
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
      days={currentWeekDays}
      events={filteredEvents}
      onEventAction={handleEventAction}
      className={className}
      {...other}
    />
  );
});
