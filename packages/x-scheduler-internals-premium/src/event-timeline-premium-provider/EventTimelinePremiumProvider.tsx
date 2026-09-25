import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import { SchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import type { EventTimelinePremiumParameters } from '../use-event-timeline-premium';
import { useEventTimelinePremium } from '../use-event-timeline-premium';

export function EventTimelinePremiumProvider<TEvent extends object, TResource extends object>(
  props: EventTimelinePremiumProvider.Props<TEvent, TResource>,
) {
  const { children, ...parameters } = props;
  const store = useEventTimelinePremium(parameters);

  return (
    <SchedulerStoreContext.Provider value={store as any}>
      <Draggable.Provider>{children}</Draggable.Provider>
    </SchedulerStoreContext.Provider>
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
