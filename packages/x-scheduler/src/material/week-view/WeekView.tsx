'use client';
import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import { useDayList } from '../../primitives/use-day-list/useDayList';
import { WeekViewProps } from './WeekView.types';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import { DayTimeGrid } from '../internals/components/day-time-grid/DayTimeGrid';
import { useEventCalendarStoreContext } from '../../primitives/utils/useEventCalendarStoreContext';
import { otherSelectors } from '../../primitives/utils/SchedulerStore';
import { preferencesSelectors } from '../../primitives/use-event-calendar';
import { useInitializeView } from '../../primitives/utils/useInitializeView';

const adapter = getAdapter();

export const WeekView = React.memo(
  React.forwardRef(function WeekView(
    props: WeekViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    const store = useEventCalendarStoreContext();
    const visibleDate = useStore(store, otherSelectors.visibleDate);
    const showWeekends = useStore(store, preferencesSelectors.showWeekends);
    const getDayList = useDayList();

    const days = React.useMemo(
      () =>
        getDayList({
          date: adapter.startOfWeek(visibleDate),
          amount: 'week',
          excludeWeekends: !showWeekends,
        }),
      [getDayList, visibleDate, showWeekends],
    );

    useInitializeView(() => ({
      siblingVisibleDateGetter: (date, delta) => adapter.addWeeks(adapter.startOfWeek(date), delta),
    }));

    return <DayTimeGrid ref={forwardedRef} days={days} {...props} />;
  }),
);
