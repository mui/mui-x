import * as React from 'react';
import {
  EventCalendarParameters,
  EventCalendarStoreConstructor,
  useEventCalendar,
} from '../use-event-calendar';
import { SchedulerStoreContext } from '../use-scheduler-store-context/useSchedulerStoreContext';

export function EventCalendarProvider<TEvent extends object, TResource extends object>(
  props: EventCalendarProvider.Props<TEvent, TResource>,
) {
  const { children, storeClass, ...parameters } = props;
  const store = useEventCalendar(parameters, storeClass);

  return (
    <SchedulerStoreContext.Provider value={store as any}>{children}</SchedulerStoreContext.Provider>
  );
}

export namespace EventCalendarProvider {
  export interface Props<
    TEvent extends object,
    TResource extends object,
  > extends EventCalendarParameters<TEvent, TResource> {
    children: React.ReactNode;
    /**
     * The store class to use for this provider.
     * @default EventCalendarStore
     */
    storeClass?: EventCalendarStoreConstructor<TEvent, TResource>;
  }
}
