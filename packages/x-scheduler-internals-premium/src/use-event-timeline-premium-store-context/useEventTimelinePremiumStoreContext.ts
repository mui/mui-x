'use client';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { EventTimelinePremiumStore } from '../use-event-timeline-premium';

export function useEventTimelinePremiumStoreContext<
  TEvent extends object,
  TResource extends object,
>() {
  const context = useSchedulerStoreContext();

  if (context.instanceName !== 'EventTimelinePremiumStore') {
    throw new Error(
      'MUI X Scheduler: useEventTimelinePremiumStoreContext must be used within an <EventTimelinePremium /> component',
    );
  }

  return context as unknown as EventTimelinePremiumStore<TEvent, TResource>;
}
