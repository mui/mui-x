import * as React from 'react';
import { SchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import type { TimelineParameters } from '../use-timeline';
import { useTimeline } from '../use-timeline';
import { TimelineStoreContext } from '../use-timeline-store-context/useTimelineStoreContext';

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
