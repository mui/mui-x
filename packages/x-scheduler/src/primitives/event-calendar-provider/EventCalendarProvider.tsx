import * as React from 'react';
import { EventCalendarParameters, useEventCalendar } from '../use-event-calendar';
import { EventCalendarStoreContext } from '../utils/useEventCalendarStoreContext';

export function EventCalendarProvider(props: EventCalendarProvider.Props) {
  const { children, ...parameters } = props;
  const store = useEventCalendar(parameters);

  return (
    <EventCalendarStoreContext.Provider value={store}>
      {children}
    </EventCalendarStoreContext.Provider>
  );
}

export namespace EventCalendarProvider {
  export interface Props extends EventCalendarParameters {
    children: React.ReactNode;
  }
}
