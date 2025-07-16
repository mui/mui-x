'use client';
import * as React from 'react';
import { useDayList } from '../../primitives/use-day-list/useDayList';
import { WeekViewProps } from './WeekView.types';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import { DayTimeGrid } from '../internals/components/day-time-grid/DayTimeGrid';
import { useEventCalendarStore } from '../internals/hooks/useEventCalendarStore';
import { useSelector } from '../../base-ui-copy/utils/store';
import { selectors } from '../event-calendar/store';

const adapter = getAdapter();

export const WeekView = React.memo(
  React.forwardRef(function WeekView(
    props: WeekViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    const store = useEventCalendarStore();
    const visibleDate = useSelector(store, selectors.visibleDate);

    const getDayList = useDayList();

    const days = React.useMemo(
      () => getDayList({ date: adapter.startOfWeek(visibleDate), amount: 7 }),
      [getDayList, visibleDate],
    );

    return <DayTimeGrid ref={forwardedRef} days={days} {...props} />;
  }),
);
