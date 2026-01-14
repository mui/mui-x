import * as React from 'react';
import { EventCalendarParameters, useEventCalendar } from '../use-event-calendar';
import { EventCalendarStoreContext } from '../use-event-calendar-store-context';
import { SchedulerStoreContext } from '../use-scheduler-store-context/useSchedulerStoreContext';

export function EventCalendarProvider<TEvent extends object, TResource extends object>(
  props: EventCalendarProvider.Props<TEvent, TResource>,
) {
  const { children, ...parameters } = props;
  const store = useEventCalendar(parameters);

  return (
    <EventCalendarStoreContext.Provider value={store}>
      <SchedulerStoreContext.Provider value={store as any}>
        {children}
      </SchedulerStoreContext.Provider>
    </EventCalendarStoreContext.Provider>
  );
}

export namespace EventCalendarProvider {
  export interface Props<
    TEvent extends object,
    TResource extends object,
  > extends EventCalendarParameters<TEvent, TResource> {
    children: React.ReactNode;
  }
}
