'use client';
import * as React from 'react';
import { useDayList } from '@mui/x-scheduler/primitives/use-day-list';
import { useAdapter } from '../../primitives/utils/adapter/useAdapter';
import { WeekViewProps } from './WeekView.types';
import { TimeGridView } from '../time-grid-view/TimeGridView';

export const WeekView = React.forwardRef(function WeekView(
  props: WeekViewProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { events, className, ...other } = props;

  const adapter = useAdapter();
  const today = adapter.date('2025-05-26');
  const getDayList = useDayList();

  const currentWeekDays = React.useMemo(
    () => getDayList({ date: today.startOf('week'), amount: 7 }),
    [getDayList, today],
  );

  return (
    <TimeGridView
      ref={forwardedRef}
      days={currentWeekDays}
      events={events}
      className={className}
      {...other}
    />
  );
});
