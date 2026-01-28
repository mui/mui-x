'use client';
import { useSchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { EventCalendarPremiumStore } from '../use-event-calendar-premium';

export function useEventCalendarPremiumStoreContext<
  TEvent extends object,
  TResource extends object,
>() {
  const store = useSchedulerStoreContext();

  if (store.instanceName !== 'EventCalendarPremiumStore') {
    throw new Error(
      'MUI: useEventCalendarPremiumStoreContext must be used within <EventCalendarPremium />',
    );
  }

  return store as unknown as EventCalendarPremiumStore<TEvent, TResource>;
}
