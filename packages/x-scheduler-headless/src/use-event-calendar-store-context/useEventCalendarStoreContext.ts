'use client';
import { useSchedulerStoreContext } from '../use-scheduler-store-context';
import { EventCalendarStore } from '../use-event-calendar';

export function useEventCalendarStoreContext<TEvent extends object, TResource extends object>() {
  const context = useSchedulerStoreContext();

  if (
    context.instanceName !== 'EventCalendarStore' &&
    context.instanceName !== 'EventCalendarPremiumStore'
  ) {
    throw new Error(
      'MUI: useEventCalendarStoreContext must be used within an <EventCalendar /> component',
    );
  }

  return context as unknown as EventCalendarStore<TEvent, TResource>;
}
