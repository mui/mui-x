'use client';
import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import { useIsoLayoutEffect } from '@base-ui-components/utils/useIsoLayoutEffect';
import { DayViewProps } from './DayView.types';
import { DayTimeGrid } from '../internals/components/day-time-grid/DayTimeGrid';
import { useEventCalendarContext } from '../internals/hooks/useEventCalendarContext';
import { selectors } from '../../primitives/use-event-calendar';
import { useAdapter } from '../../primitives/utils/adapter/useAdapter';

export const DayView = React.memo(
  React.forwardRef(function DayView(
    props: DayViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    const adapter = useAdapter();
    const { store, instance } = useEventCalendarContext();
    const visibleDate = useStore(store, selectors.visibleDate);

    const days = React.useMemo(() => [visibleDate], [visibleDate]);

    useIsoLayoutEffect(() => {
      return instance.setSiblingVisibleDateSetter((date, delta) => adapter.addDays(date, delta));
    }, []);

    return <DayTimeGrid ref={forwardedRef} days={days} {...props} />;
  }),
);
