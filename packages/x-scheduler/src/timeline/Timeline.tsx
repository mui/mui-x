'use client';
import * as React from 'react';
import { styled, useThemeProps } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import { useExtractTimelineParameters, useTimeline } from '@mui/x-scheduler-headless/use-timeline';
import { timelineViewSelectors } from '@mui/x-scheduler-headless/timeline-selectors';
import { TimelineStoreContext } from '@mui/x-scheduler-headless/use-timeline-store-context';
import { TimelineView } from '@mui/x-scheduler-headless/models';
import { SchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { TimelineProps } from './Timeline.types';
import { ViewSwitcher } from '../internals/components/header-toolbar/view-switcher';
import { TimelineContent } from './content';
import '../index.css';

const TimelineViewContainer = styled('div', {
  name: 'MuiSchedulerTimeline',
  slot: 'Root',
})(({ theme }) => ({
  '--time-cell-width': '64px',
  '--days-cell-width': '120px',
  '--weeks-cell-width': '64px',
  '--months-cell-width': '180px',
  '--years-cell-width': '200px',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
  gap: theme.spacing(2),
  height: '100%',
  fontSize: theme.typography.body2.fontSize,
}));

const TimelineHeaderToolbar = styled('header', {
  name: 'MuiSchedulerTimeline',
  slot: 'HeaderToolbar',
})({
  display: 'flex',
  justifyContent: 'flex-start',
});

export const Timeline = React.forwardRef(function EventTimeline<
  TEvent extends object,
  TResource extends object,
>(inProps: TimelineProps<TEvent, TResource>, forwardedRef: React.ForwardedRef<HTMLDivElement>) {
  const props = useThemeProps({ props: inProps, name: 'MuiEventTimeline' });

  const { parameters, forwardedProps } = useExtractTimelineParameters<
    TEvent,
    TResource,
    typeof props
  >(props);
  const store = useTimeline(parameters);

  const view = useStore(store, timelineViewSelectors.view);
  const views = useStore(store, timelineViewSelectors.views);

  return (
    <TimelineStoreContext.Provider value={store}>
      <SchedulerStoreContext.Provider value={store as any}>
        <TimelineViewContainer ref={forwardedRef} className="mui-x-scheduler" {...forwardedProps}>
          <TimelineHeaderToolbar>
            <ViewSwitcher<TimelineView> views={views} view={view} onViewChange={store.setView} />
          </TimelineHeaderToolbar>
          <TimelineContent />
        </TimelineViewContainer>
      </SchedulerStoreContext.Provider>
    </TimelineStoreContext.Provider>
  );
}) as TimelineComponent;

type TimelineComponent = <TEvent extends object, TResource extends object>(
  props: TimelineProps<TEvent, TResource> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => React.JSX.Element;
