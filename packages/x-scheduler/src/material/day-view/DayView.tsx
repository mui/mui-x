'use client';
import * as React from 'react';
import { DayViewProps } from './DayView.types';
import { DayTimeGrid } from '../internals/components/day-time-grid/DayTimeGrid';
import { useInitializeView } from '../../primitives/utils/useInitializeView';
import { processDate } from '../../primitives/utils/event-utils';
import { CalendarViewConfig } from '../../primitives/models';

const viewConfig: CalendarViewConfig = {
  renderEventIn: 'every-day',
  siblingVisibleDateGetter: ({ adapter, date, delta }) => adapter.addDays(date, delta),
  getVisibleDays: ({ adapter, visibleDate }) => [processDate(visibleDate, adapter)],
};

export const DayView = React.memo(
  React.forwardRef(function DayView(
    props: DayViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    const { days } = useInitializeView(viewConfig);

    return <DayTimeGrid ref={forwardedRef} days={days} {...props} />;
  }),
);
