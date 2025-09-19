'use client';
import * as React from 'react';
import { WeekViewProps } from './WeekView.types';
import { DayTimeGrid } from '../internals/components/day-time-grid/DayTimeGrid';
import { useInitializeView } from '../../primitives/utils/useInitializeView';
import { getDayList } from '../../primitives/utils/date-utils';
import { CalendarViewConfig } from '../../primitives/models';

const viewConfig: CalendarViewConfig = {
  renderEventIn: 'every-day',
  siblingVisibleDateGetter: ({ adapter, date, delta }) =>
    adapter.addWeeks(adapter.startOfWeek(date), delta),
  getVisibleDays: ({ adapter, visibleDate, showWeekends }) =>
    getDayList({
      adapter,
      showWeekends,
      firstDay: adapter.startOfWeek(visibleDate),
      lastDay: adapter.endOfWeek(visibleDate),
    }),
};

export const WeekView = React.memo(
  React.forwardRef(function WeekView(
    props: WeekViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    const { days } = useInitializeView(viewConfig);

    return <DayTimeGrid ref={forwardedRef} days={days} {...props} />;
  }),
);
