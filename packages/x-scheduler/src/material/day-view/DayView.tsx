'use client';
import * as React from 'react';
import { DayViewProps } from './DayView.types';
import { DayTimeGrid } from '../internals/components/day-time-grid/DayTimeGrid';
import { useSelector } from '../../base-ui-copy/utils/store';
import { useEventCalendarContext } from '../internals/hooks/useEventCalendarContext';
import { selectors } from '../../primitives/use-event-calendar';

export const DayView = React.memo(
  React.forwardRef(function DayView(
    props: DayViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    const { store } = useEventCalendarContext();
    const visibleDate = useSelector(store, selectors.visibleDate);

    const days = React.useMemo(() => [visibleDate], [visibleDate]);

    return <DayTimeGrid ref={forwardedRef} days={days} {...props} />;
  }),
);
