'use client';
import { useSchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { EventCalendarPremiumStore } from '../use-event-calendar-premium';

export function useEventCalendarPremiumStoreContext<
  TEvent extends object,
  TResource extends object,
>() {
  const context = useSchedulerStoreContext();

  if (context.instanceName !== 'EventCalendarPremiumStore') {
    throw new Error(
      'MUI: useEventCalendarPremiumStoreContext must be used within an <EventCalendarPremium /> component',
    );
  }

  return context as unknown as EventCalendarPremiumStore<TEvent, TResource>;
}
