import * as React from 'react';
import { useExtractTimelineParameters, useTimeline } from '../../primitives/use-timeline';
import { TimelineStoreContext } from '../../primitives/utils/useTimelineStoreContext';
import { TimelineProps } from './Timeline.types';
import '../index.css';

export function Timeline(props: TimelineProps) {
  const { parameters, forwardedProps } = useExtractTimelineParameters(props);
  const store = useTimeline(parameters);

  return (
    <TimelineStoreContext.Provider value={store}>
      <div {...forwardedProps}>Hello world</div>
    </TimelineStoreContext.Provider>
  );
}
