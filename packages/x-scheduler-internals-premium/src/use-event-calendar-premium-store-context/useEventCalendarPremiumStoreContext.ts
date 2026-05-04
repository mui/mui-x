'use client';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { EventCalendarPremiumStore } from '../use-event-calendar-premium';

export function useEventCalendarPremiumStoreContext<
  TEvent extends object,
  TResource extends object,
>() {
  const context = useSchedulerStoreContext();

  if (context.instanceName !== 'EventCalendarPremiumStore') {
    throw new Error(
      'MUI X Scheduler: useEventCalendarPremiumStoreContext must be used within an <EventCalendarPremium /> component',
    );
  }

  return context as unknown as EventCalendarPremiumStore<TEvent, TResource>;
}
