'use client';
import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import { useDayList } from '../../primitives/use-day-list';
import { WeekViewProps } from './WeekView.types';
import { useAdapter } from '../../primitives/use-adapter';
import { useEventCalendarStoreContext } from '../../primitives/use-event-calendar-store-context';
import { selectors } from '../../primitives/use-event-calendar';
import { useEventCalendarView } from '../../primitives/use-event-calendar-view';
import { DayTimeGrid } from '../internals/components/day-time-grid/DayTimeGrid';

export const WeekView = React.memo(
  React.forwardRef(function WeekView(
    props: WeekViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    const adapter = useAdapter();
    const store = useEventCalendarStoreContext();
    const visibleDate = useStore(store, selectors.visibleDate);
    const preferences = useStore(store, selectors.preferences);
    const getDayList = useDayList();

    const days = React.useMemo(
      () =>
        getDayList({
          date: adapter.startOfWeek(visibleDate),
          amount: 'week',
          excludeWeekends: !preferences.showWeekends,
        }),
      [adapter, getDayList, visibleDate, preferences.showWeekends],
    );

    useEventCalendarView(() => ({
      siblingVisibleDateGetter: (date, delta) => adapter.addWeeks(adapter.startOfWeek(date), delta),
    }));

    return <DayTimeGrid ref={forwardedRef} days={days} {...props} />;
  }),
);
