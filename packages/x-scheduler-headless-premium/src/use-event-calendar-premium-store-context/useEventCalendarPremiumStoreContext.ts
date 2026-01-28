'use client';
import {
  useSchedulerStoreContext,
  SchedulerStoreContext,
} from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { EventCalendarPremiumStore } from '../use-event-calendar-premium';

export { SchedulerStoreContext as EventCalendarPremiumStoreContext };

export function useEventCalendarPremiumStoreContext<
  TEvent extends object,
  TResource extends object,
>() {
  const store = useSchedulerStoreContext();

  if (store.instanceName !== 'EventCalendarPremiumStore') {
    throw new Error(
      'MUI X: useEventCalendarPremiumStoreContext must be used within <EventCalendarPremium />',
    );
  }

  return store as unknown as EventCalendarPremiumStore<TEvent, TResource>;
}
