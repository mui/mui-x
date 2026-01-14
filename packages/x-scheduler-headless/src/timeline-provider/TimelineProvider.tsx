import * as React from 'react';
import { TimelineParameters, useTimeline } from '../use-timeline';
import { TimelineStoreContext } from '../use-timeline-store-context/useTimelineStoreContext';
import { SchedulerStoreContext } from '../use-scheduler-store-context/useSchedulerStoreContext';

export function TimelineProvider<TEvent extends object, TResource extends object>(
  props: TimelineProvider.Props<TEvent, TResource>,
) {
  const { children, ...parameters } = props;
  const store = useTimeline(parameters);

  return (
    <TimelineStoreContext.Provider value={store}>
      <SchedulerStoreContext.Provider value={store as any}>
        {children}
      </SchedulerStoreContext.Provider>
    </TimelineStoreContext.Provider>
  );
}

export namespace TimelineProvider {
  export interface Props<
    TEvent extends object,
    TResource extends object,
  > extends TimelineParameters<TEvent, TResource> {
    children: React.ReactNode;
  }
}
