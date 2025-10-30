'use client';
import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import { useDayList } from '@mui/x-scheduler-headless/use-day-list';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { eventCalendarPreferenceSelectors } from '@mui/x-scheduler-headless/event-calendar-selectors';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { EventCalendarProvider } from '@mui/x-scheduler-headless/event-calendar-provider';
import { useExtractEventCalendarParameters } from '@mui/x-scheduler-headless/use-event-calendar';
import { schedulerOtherSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { useEventCalendarView } from '@mui/x-scheduler-headless/use-event-calendar-view';
import { StandaloneWeekViewProps, WeekViewProps } from './WeekView.types';
import { DayTimeGrid } from '../internals/components/day-time-grid/DayTimeGrid';
import '../index.css';

/**
 * A Week View to use inside the Event Calendar.
 */
export const WeekView = React.memo(
  React.forwardRef(function WeekView(
    props: WeekViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    const adapter = useAdapter();
    const store = useEventCalendarStoreContext();
    const visibleDate = useStore(store, schedulerOtherSelectors.visibleDate);
    const showWeekends = useStore(store, eventCalendarPreferenceSelectors.showWeekends);
    const getDayList = useDayList();

    const days = React.useMemo(
      () =>
        getDayList({
          date: adapter.startOfWeek(visibleDate),
          amount: 'week',
          excludeWeekends: !showWeekends,
        }),
      [adapter, getDayList, visibleDate, showWeekends],
    );

    useEventCalendarView(() => ({
      siblingVisibleDateGetter: (date, delta) => adapter.addWeeks(adapter.startOfWeek(date), delta),
    }));

    return <DayTimeGrid ref={forwardedRef} days={days} {...props} />;
  }),
);

/**
 * A Week View that can be used outside of the Event Calendar.
 */
export const StandaloneWeekView = React.forwardRef(function StandaloneWeekView<
  TEvent extends object,
  TResource extends object,
>(
  props: StandaloneWeekViewProps<TEvent, TResource>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { parameters, forwardedProps } = useExtractEventCalendarParameters<
    TEvent,
    TResource,
    typeof props
  >(props);

  return (
    <EventCalendarProvider {...parameters}>
      <WeekView ref={forwardedRef} {...forwardedProps} />
    </EventCalendarProvider>
  );
}) as StandaloneWeekViewComponent;

type StandaloneWeekViewComponent = <TEvent extends object, TResource extends object>(
  props: StandaloneWeekViewProps<TEvent, TResource> & {
    ref?: React.ForwardedRef<HTMLDivElement>;
  },
) => React.JSX.Element;
