import * as React from 'react';
import { useExtractTimelineParameters, useTimeline } from '../../primitives/use-timeline';
import { TimelineStoreContext } from '../../primitives/use-timeline-store-context';
import { SchedulerStoreContext } from '../../primitives/use-scheduler-store-context';
import { TimelineProps } from './Timeline.types';
import '../index.css';

export function Timeline(props: TimelineProps) {
  const { parameters, forwardedProps } = useExtractTimelineParameters(props);
  const store = useTimeline(parameters);

  return (
    <TimelineStoreContext.Provider value={store}>
      <SchedulerStoreContext.Provider value={store as any}>
        <div {...forwardedProps}>Hello world</div>
      </SchedulerStoreContext.Provider>
    </TimelineStoreContext.Provider>
  );
}
