'use client';
import { useSchedulerStoreContext, SchedulerStoreContext } from '../use-scheduler-store-context';
import { EventCalendarStore } from '../use-event-calendar';

export { SchedulerStoreContext as EventCalendarStoreContext };

export function useEventCalendarStoreContext<TEvent extends object, TResource extends object>() {
  const store = useSchedulerStoreContext();

  if (
    store.instanceName !== 'EventCalendarStore' &&
    store.instanceName !== 'EventCalendarPremiumStore'
  ) {
    throw new Error(
      'MUI X: useEventCalendarStoreContext must be used within <EventCalendar /> or <EventCalendarPremium />',
    );
  }

  return store as unknown as EventCalendarStore<TEvent, TResource>;
}
