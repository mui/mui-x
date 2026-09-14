import * as React from 'react';
import type { EventCalendarParameters, EventCalendarStoreConstructor } from '../use-event-calendar';
import { useEventCalendar } from '../use-event-calendar';
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
     * A premium store reads parameters this interface does not declare (`dataSource`); they reach
     * its constructor through the JSX spread, which skips excess-property checks.
     * @default EventCalendarStore
     */
    storeClass?: EventCalendarStoreConstructor<TEvent, TResource>;
  }
}
