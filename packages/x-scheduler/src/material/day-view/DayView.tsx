'use client';
import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import { DayViewProps } from './DayView.types';
import { DayTimeGrid } from '../internals/components/day-time-grid/DayTimeGrid';
import { useEventCalendarStoreContext } from '../../primitives/utils/useEventCalendarStoreContext';
import { selectors } from '../../primitives/use-event-calendar';
import { useAdapter } from '../../primitives/utils/adapter/useAdapter';
import { useInitializeView } from '../../primitives/utils/useInitializeView';
import { processDate } from '../../primitives/utils/event-utils';

export const DayView = React.memo(
  React.forwardRef(function DayView(
    props: DayViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    const adapter = useAdapter();
    const store = useEventCalendarStoreContext();
    const visibleDate = useStore(store, selectors.visibleDate);
    const days = React.useMemo(() => [processDate(visibleDate, adapter)], [adapter, visibleDate]);

    useInitializeView(() => ({
      siblingVisibleDateGetter: (date, delta) => adapter.addDays(date, delta),
    }));

    return <DayTimeGrid ref={forwardedRef} days={days} {...props} />;
  }),
);
