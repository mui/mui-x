import * as React from 'react';
import { SchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import type { TimelinePremiumParameters } from '../use-timeline-premium';
import { useTimelinePremium } from '../use-timeline-premium';
import { TimelinePremiumStoreContext } from '../use-timeline-premium-store-context/useTimelinePremiumStoreContext';

export function TimelinePremiumProvider<TEvent extends object, TResource extends object>(
  props: TimelinePremiumProvider.Props<TEvent, TResource>,
) {
  const { children, ...parameters } = props;
  const store = useTimelinePremium(parameters);

  return (
    <TimelinePremiumStoreContext.Provider value={store}>
      <SchedulerStoreContext.Provider value={store as any}>
        {children}
      </SchedulerStoreContext.Provider>
    </TimelinePremiumStoreContext.Provider>
  );
}

export namespace TimelinePremiumProvider {
  export interface Props<
    TEvent extends object,
    TResource extends object,
  > extends TimelinePremiumParameters<TEvent, TResource> {
    children: React.ReactNode;
  }
}
