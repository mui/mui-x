'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import {
  selectors,
  useExtractTimelineParameters,
  useTimeline,
} from '@mui/x-scheduler-headless/use-timeline';
import { TimelineStoreContext } from '@mui/x-scheduler-headless/use-timeline-store-context';
import { TimelineView } from '@mui/x-scheduler-headless/models';
import { SchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { TimelineProps } from './Timeline.types';
import { ViewSwitcher } from '../internals/components/header-toolbar/view-switcher';
import { TimelineContent } from './content';
import '../index.css';
import './Timeline.css';

export const Timeline = React.forwardRef(function Timeline<
  TEvent extends object,
  TResource extends object,
>(props: TimelineProps<TEvent, TResource>, forwardedRef: React.ForwardedRef<HTMLDivElement>) {
  const { parameters, forwardedProps } = useExtractTimelineParameters<
    TEvent,
    TResource,
    typeof props
  >(props);
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
}) as TimelineComponent;

type TimelineComponent = <TEvent extends object, TResource extends object>(
  props: TimelineProps<TEvent, TResource> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => React.JSX.Element;
