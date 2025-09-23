'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useMergedRefs } from '@base-ui-components/utils/useMergedRefs';
import { useExtractTimelineParameters, useTimeline } from '../../primitives/use-timeline';
import { TimelineStoreContext } from '../../primitives/utils/useTimelineStoreContext';
import { TimelineProps, TimelineView } from './Timeline.types';
import { ViewSwitcher } from '../internals/components/header-toolbar/view-switcher';
import { TimelineContent } from './content';
import '../index.css';
import './Timeline.css';

export const Timeline = React.forwardRef(function Timeline(
  props: TimelineProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { parameters, forwardedProps, ...other } = useExtractTimelineParameters(props);
  const store = useTimeline(parameters);

  const containerRef = React.useRef<HTMLElement | null>(null);
  const handleRef = useMergedRefs(forwardedRef, containerRef);

  // TODO replace with a view state from the store
  const [view, setView] = React.useState<TimelineView>('days');
  const views: TimelineView[] = ['time', 'days', 'weeks', 'months', 'years'];

  const handleViewChange = (newView: TimelineView, _e: React.MouseEvent<HTMLElement>) => {
    setView(newView);
  };

  return (
    <TimelineStoreContext.Provider value={store}>
      <div
        ref={handleRef}
        className={clsx('TimelineViewContainer', 'mui-x-scheduler', forwardedProps.className)}
        {...forwardedProps}
        {...other}
      >
        <div className="TimelineHeaderToolbar">
          <ViewSwitcher views={views} currentView={view} onViewChange={handleViewChange} />
        </div>
        <TimelineContent view={view} />
      </div>
    </TimelineStoreContext.Provider>
  );
});
