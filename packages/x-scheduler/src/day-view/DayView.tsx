'use client';
import * as React from 'react';
import { createSelectorMemoized } from '@base-ui/utils/store';
import { EventCalendarViewConfig } from '@mui/x-scheduler-headless/models';
import {
  useExtractEventCalendarParameters,
  EventCalendarState as State,
} from '@mui/x-scheduler-headless/use-event-calendar';
import { useEventCalendarView } from '@mui/x-scheduler-headless/use-event-calendar-view';
import { processDate } from '@mui/x-scheduler-headless/process-date';
import { schedulerOtherSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { DayViewProps, StandaloneDayViewProps } from './DayView.types';
import { EventCalendarProvider } from '../internals/components/EventCalendarProvider';
import { DayTimeGrid } from '../internals/components/day-time-grid/DayTimeGrid';
import '../index.css';
import { EventDraggableDialogProvider } from '../internals/components/event-draggable-dialog';

const DAY_VIEW_CONFIG: EventCalendarViewConfig = {
  siblingVisibleDateGetter: ({ state, delta }) =>
    state.adapter.addDays(schedulerOtherSelectors.visibleDate(state), delta),
  visibleDaysSelector: createSelectorMemoized(
    schedulerOtherSelectors.visibleDate,
    (state: State) => state.adapter,
    (visibleDate, adapter) => [processDate(visibleDate, adapter)],
  ),
};

/**
 * A Day View to use inside the Event Calendar.
 */
export const DayView = React.memo(
  React.forwardRef(function DayView(
    props: DayViewProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    // Feature hooks
    const { days } = useEventCalendarView(DAY_VIEW_CONFIG);

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
      <EventDraggableDialogProvider>
        <DayView ref={forwardedRef} {...forwardedProps} />
      </EventDraggableDialogProvider>
    </EventCalendarProvider>
  );
}) as StandaloneDayViewComponent;

type StandaloneDayViewComponent = <TEvent extends object, TResource extends object>(
  props: StandaloneDayViewProps<TEvent, TResource> & {
    ref?: React.ForwardedRef<HTMLDivElement>;
  },
) => React.JSX.Element;
