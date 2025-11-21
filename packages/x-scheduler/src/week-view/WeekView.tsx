'use client';
import * as React from 'react';
import { EventCalendarViewConfig } from '@mui/x-scheduler-headless/models';
import { getDayList, GetDaytListParameters } from '@mui/x-scheduler-headless/get-day-list';
import { EventCalendarProvider } from '@mui/x-scheduler-headless/event-calendar-provider';
import {
  useExtractEventCalendarParameters,
  EventCalendarState as State,
} from '@mui/x-scheduler-headless/use-event-calendar';
import { schedulerOtherSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { eventCalendarPreferenceSelectors } from '@mui/x-scheduler-headless/event-calendar-selectors';
import { useEventCalendarView } from '@mui/x-scheduler-headless/use-event-calendar-view';
import { createSelector } from '@base-ui-components/utils/store';
import { StandaloneWeekViewProps, WeekViewProps } from './WeekView.types';
import { DayTimeGrid } from '../internals/components/day-time-grid/DayTimeGrid';
import '../index.css';

const WEEK_VIEW_CONFIG: EventCalendarViewConfig<GetDaytListParameters> = {
  siblingVisibleDateGetter: ({ state, delta }) =>
    state.adapter.addWeeks(state.adapter.startOfWeek(state.visibleDate), delta),
  getVisibleDays: getDayList,
  getVisibleDayParametersSelector: createSelector(
    (state: State) => state.adapter,
    schedulerOtherSelectors.visibleDate,
    eventCalendarPreferenceSelectors.showWeekends,
    (adapter, visibleDate, showWeekends) => ({
      adapter,
      start: adapter.startOfWeek(visibleDate),
      end: adapter.endOfWeek(visibleDate),
      excludeWeekends: !showWeekends,
    }),
  ),
};

/**
 * A Week View to use inside the Event Calendar.
 */
export const WeekView = React.memo(
  React.forwardRef(function WeekView(
    props: WeekViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    // Feature hooks
    const { days } = useEventCalendarView(WEEK_VIEW_CONFIG);

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
