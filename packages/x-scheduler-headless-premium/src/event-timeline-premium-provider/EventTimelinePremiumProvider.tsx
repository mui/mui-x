import * as React from 'react';
import { SchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import type { EventTimelinePremiumParameters } from '../use-event-timeline-premium';
import { useEventTimelinePremium } from '../use-event-timeline-premium';
import { EventTimelinePremiumStoreContext } from '../use-event-timeline-premium-store-context/useEventTimelinePremiumStoreContext';

export function EventTimelinePremiumProvider<TEvent extends object, TResource extends object>(
  props: EventTimelinePremiumProvider.Props<TEvent, TResource>,
) {
  const { children, ...parameters } = props;
  const store = useEventTimelinePremium(parameters);

  return (
    <EventTimelinePremiumStoreContext.Provider value={store}>
      <SchedulerStoreContext.Provider value={store as any}>
        {children}
      </SchedulerStoreContext.Provider>
    </EventTimelinePremiumStoreContext.Provider>
  );
}

export namespace EventTimelinePremiumProvider {
  export interface Props<
    TEvent extends object,
    TResource extends object,
  > extends EventTimelinePremiumParameters<TEvent, TResource> {
    children: React.ReactNode;
  }
}
