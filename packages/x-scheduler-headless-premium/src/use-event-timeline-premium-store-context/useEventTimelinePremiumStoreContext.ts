'use client';
import { useSchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { EventTimelinePremiumStore } from '../use-event-timeline-premium';

export function useEventTimelinePremiumStoreContext<
  TEvent extends object,
  TResource extends object,
>() {
  const store = useSchedulerStoreContext();

  if (store.instanceName !== 'EventTimelinePremiumStore') {
    throw new Error(
      'MUI X: useEventTimelinePremiumStoreContext must be used within <EventTimelinePremium />',
    );
  }

  return store as unknown as EventTimelinePremiumStore<TEvent, TResource>;
}
