'use client';
import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import { useDayList } from '../../primitives/use-day-list/useDayList';
import { WeekViewProps } from './WeekView.types';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import { DayTimeGrid } from '../internals/components/day-time-grid/DayTimeGrid';
import { useEventCalendarContext } from '../internals/hooks/useEventCalendarContext';
import { selectors } from '../../primitives/use-event-calendar';

const adapter = getAdapter();

export const WeekView = React.memo(
  React.forwardRef(function WeekView(
    props: WeekViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    const { store } = useEventCalendarContext();
    const visibleDate = useStore(store, selectors.visibleDate);
    const settings = useStore(store, selectors.settings);
    const getDayList = useDayList();

    const days = React.useMemo(
      () =>
        getDayList({
          date: adapter.startOfWeek(visibleDate),
          amount: 'week',
          excludeWeekends: settings.hideWeekends,
        }),
      [getDayList, visibleDate, settings.hideWeekends],
    );

    return <DayTimeGrid ref={forwardedRef} days={days} {...props} />;
  }),
);
