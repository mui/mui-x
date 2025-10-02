'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import {
  selectors,
  useExtractTimelineParameters,
  useTimeline,
} from '../../primitives/use-timeline';
import { TimelineStoreContext } from '../../primitives/utils/useTimelineStoreContext';
import { TimelineView } from '../../primitives/models';
import { SchedulerStoreContext } from '../../primitives/utils/useSchedulerStoreContext';
import { TimelineProps } from './Timeline.types';
import { ViewSwitcher } from '../internals/components/header-toolbar/view-switcher';
import { TimelineContent } from './content';
import '../index.css';
import './Timeline.css';

export const Timeline = React.forwardRef(function Timeline(
  props: TimelineProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { parameters, forwardedProps } = useExtractTimelineParameters(props);
  const store = useTimeline(parameters);

  const view = useStore(store, selectors.view);
  const views = useStore(store, selectors.views);

  return (
    <TimelineStoreContext.Provider value={store}>
      <SchedulerStoreContext.Provider value={store as any}>
        <div
          ref={forwardedRef}
          className={clsx('TimelineViewContainer', 'mui-x-scheduler', forwardedProps.className)}
          {...forwardedProps}
        >
          <header className="TimelineHeaderToolbar">
            <ViewSwitcher<TimelineView> views={views} view={view} onViewChange={store.setView} />
          </header>
          <TimelineContent />
        </div>
      </SchedulerStoreContext.Provider>
    </TimelineStoreContext.Provider>
  );
});
