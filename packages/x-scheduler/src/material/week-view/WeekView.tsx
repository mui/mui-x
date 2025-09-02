'use client';
import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import { useDayList } from '../../primitives/use-day-list/useDayList';
import { WeekViewProps } from './WeekView.types';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import { DayTimeGrid } from '../internals/components/day-time-grid/DayTimeGrid';
import { useEventCalendarContext } from '../internals/hooks/useEventCalendarContext';
import { selectors } from '../../primitives/use-event-calendar';
import { useInitializeView } from '../internals/hooks/useInitializeView';

const adapter = getAdapter();

export const WeekView = React.memo(
  React.forwardRef(function WeekView(
    props: WeekViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    const { store } = useEventCalendarContext();
    const visibleDate = useStore(store, selectors.visibleDate);
    const preferences = useStore(store, selectors.preferences);
    const getDayList = useDayList();

    const days = React.useMemo(
      () =>
        getDayList({
          date: adapter.startOfWeek(visibleDate),
          amount: 'week',
          excludeWeekends: preferences.hideWeekends,
        }),
      [getDayList, visibleDate, preferences.hideWeekends],
    );

    useInitializeView(() => ({
      siblingVisibleDateGetter: (date, delta) => adapter.addWeeks(adapter.startOfWeek(date), delta),
    }));

    return <DayTimeGrid ref={forwardedRef} days={days} {...props} />;
  }),
);
