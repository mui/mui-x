'use client';
import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import { EventCalendarViewConfig } from '@mui/x-scheduler-headless/models';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { useExtractEventCalendarParameters } from '@mui/x-scheduler-headless/use-event-calendar';
import { schedulerOtherSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { EventCalendarProvider } from '@mui/x-scheduler-headless/event-calendar-provider';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { useEventCalendarView } from '@mui/x-scheduler-headless/use-event-calendar-view';
import { processDate } from '@mui/x-scheduler-headless/process-date';
import { DayViewProps, StandaloneDayViewProps } from './DayView.types';
import { DayTimeGrid } from '../internals/components/day-time-grid/DayTimeGrid';
import '../index.css';

const DAY_VIEW_CONFIG: EventCalendarViewConfig = {
  siblingVisibleDateGetter: ({ state, delta }) => state.adapter.addDays(state.visibleDate, delta),
};

/**
 * A Day View to use inside the Event Calendar.
 */
export const DayView = React.memo(
  React.forwardRef(function DayView(
    props: DayViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    // Context hooks
    const adapter = useAdapter();
    const store = useEventCalendarStoreContext();

    // Selector hooks
    const visibleDate = useStore(store, schedulerOtherSelectors.visibleDate);

    // Feature hooks
    useEventCalendarView(DAY_VIEW_CONFIG);

    const days = React.useMemo(() => [processDate(visibleDate, adapter)], [adapter, visibleDate]);

    return <DayTimeGrid ref={forwardedRef} days={days} {...props} />;
  }),
);

/**
 * A Day View that can be used outside of the Event Calendar.
 */
export const StandaloneDayView = React.forwardRef(function StandaloneDayView<
  TEvent extends object,
  TResource extends object,
>(
  props: StandaloneDayViewProps<TEvent, TResource>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { parameters, forwardedProps } = useExtractEventCalendarParameters<
    TEvent,
    TResource,
    typeof props
  >(props);

  return (
    <EventCalendarProvider {...parameters}>
      <DayView ref={forwardedRef} {...forwardedProps} />
    </EventCalendarProvider>
  );
}) as StandaloneDayViewComponent;

type StandaloneDayViewComponent = <TEvent extends object, TResource extends object>(
  props: StandaloneDayViewProps<TEvent, TResource> & {
    ref?: React.ForwardedRef<HTMLDivElement>;
  },
) => React.JSX.Element;
