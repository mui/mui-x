'use client';
import * as React from 'react';
import { DayViewProps } from './DayView.types';
import { TimeGrid } from '../internals/components/time-grid/TimeGrid';
import { useSelector } from '../../base-ui-copy/utils/store';
import { useEventCalendarStore } from '../internals/hooks/useEventCalendarStore';
import { selectors } from '../event-calendar/store';

export const DayView = React.memo(
  React.forwardRef(function DayView(
    props: DayViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    const store = useEventCalendarStore();
    const visibleDate = useSelector(store, selectors.visibleDate);

    const days = React.useMemo(() => [visibleDate], [visibleDate]);

    return <TimeGrid ref={forwardedRef} days={days} {...props} />;
  }),
);
