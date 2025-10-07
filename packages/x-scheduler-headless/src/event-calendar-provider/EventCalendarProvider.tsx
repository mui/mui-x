import * as React from 'react';
import { EventCalendarParameters, useEventCalendar } from '../use-event-calendar';
import { EventCalendarStoreContext } from '../use-event-calendar-store-context';
import { SchedulerStoreContext } from '../use-scheduler-store-context/useSchedulerStoreContext';

export function EventCalendarProvider(props: EventCalendarProvider.Props) {
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
  export interface Props extends EventCalendarParameters {
    children: React.ReactNode;
  }
}
