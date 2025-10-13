'use client';
import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { selectors } from '@mui/x-scheduler-headless/use-event-calendar';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { useEventCalendarView } from '@mui/x-scheduler-headless/use-event-calendar-view';
import { processDate } from '@mui/x-scheduler-headless/process-date';
import { DayViewProps } from './DayView.types';
import { DayTimeGrid } from '../internals/components/day-time-grid/DayTimeGrid';

export const DayView = React.memo(
  React.forwardRef(function DayView(
    props: DayViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    const adapter = useAdapter();
    const store = useEventCalendarStoreContext();
    const visibleDate = useStore(store, selectors.visibleDate);
    const days = React.useMemo(() => [processDate(visibleDate, adapter)], [adapter, visibleDate]);

    useEventCalendarView(() => ({
      siblingVisibleDateGetter: (date, delta) => adapter.addDays(date, delta),
    }));

    return <DayTimeGrid ref={forwardedRef} days={days} {...props} />;
  }),
);
