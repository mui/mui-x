'use client';
import * as React from 'react';
import { useDayList } from '../../primitives/use-day-list/useDayList';
import { WeekViewProps } from './WeekView.types';
import { TimeGrid } from '../internals/components/time-grid/TimeGrid';
import { useEventCalendarStore } from '../internals/hooks/useEventCalendarStore';
import { useSelector } from '../../base-ui-copy/utils/store';
import { selectors } from '../event-calendar/store';

export const WeekView = React.memo(
  React.forwardRef(function WeekView(
    props: WeekViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    const store = useEventCalendarStore();
    const visibleDate = useSelector(store, selectors.visibleDate);

    const getDayList = useDayList();

    const days = React.useMemo(
      () => getDayList({ date: visibleDate.startOf('week'), amount: 7 }),
      [getDayList, visibleDate],
    );

    return <TimeGrid ref={forwardedRef} days={days} {...props} />;
  }),
);
