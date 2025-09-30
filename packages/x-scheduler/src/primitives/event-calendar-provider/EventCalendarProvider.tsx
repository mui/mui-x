import * as React from 'react';
import { EventCalendarParameters, useEventCalendar } from '../use-event-calendar';
import { EventCalendarStoreContext } from '../utils/useEventCalendarStoreContext';
import { SchedulerStoreContext } from '../utils/useSchedulerStoreContext';

export function EventCalendarProvider(props: EventCalendarProvider.Props) {
  const { children, ...parameters } = props;
  const store = useEventCalendar(parameters);

  return (
    <EventCalendarStoreContext.Provider value={store}>
      <SchedulerStoreContext.Provider value={store}>{children}</SchedulerStoreContext.Provider>
    </EventCalendarStoreContext.Provider>
  );
}

export namespace EventCalendarProvider {
  export interface Props extends EventCalendarParameters {
    children: React.ReactNode;
  }
}
