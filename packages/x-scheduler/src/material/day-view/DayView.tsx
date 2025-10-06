'use client';
import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import { useEventCalendarStoreContext } from '../../primitives/use-event-calendar-store-context';
import { selectors } from '../../primitives/use-event-calendar';
import { useAdapter } from '../../primitives/use-adapter';
import { useEventCalendarView } from '../../primitives/use-event-calendar-view';
import { processDate } from '../../primitives/process-date';
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
