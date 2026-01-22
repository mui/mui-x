'use client';
import * as React from 'react';
import { styled, useThemeProps } from '@mui/material/styles';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useStore } from '@base-ui/utils/store';
import {
  useExtractTimelineParameters,
  useTimeline,
} from '@mui/x-scheduler-headless-premium/use-timeline';
import { timelineViewSelectors } from '@mui/x-scheduler-headless-premium/timeline-selectors';
import { TimelineStoreContext } from '@mui/x-scheduler-headless-premium/use-timeline-store-context';
import { TimelineView } from '@mui/x-scheduler-headless-premium/models';
import { SchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { TimelineProps } from './Timeline.types';
import { TimelineContent } from './content';
// TODO: Remove these CSS imports during the MUI X migration
import '../styles/index.css';
import '../styles/colors.css';
import '../styles/tokens.css';
import '../styles/utils.css';

const EventTimelineRoot = styled('div', {
  name: 'MuiEventTimeline',
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

const EventTimelineHeaderToolbar = styled('header', {
  name: 'MuiEventTimeline',
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

  const handleViewChange = (event: SelectChangeEvent) => {
    store.setView(event.target.value as TimelineView, event as Event);
  };

  return (
    <TimelineStoreContext.Provider value={store}>
      <SchedulerStoreContext.Provider value={store as any}>
        <EventTimelineRoot ref={forwardedRef} {...forwardedProps}>
          <EventTimelineHeaderToolbar>
            <Select value={view} onChange={handleViewChange} size="small">
              {views.map((viewItem) => (
                <MenuItem key={viewItem} value={viewItem}>
                  {viewItem}
                </MenuItem>
              ))}
            </Select>
          </EventTimelineHeaderToolbar>
          <TimelineContent />
        </EventTimelineRoot>
      </SchedulerStoreContext.Provider>
    </TimelineStoreContext.Provider>
  );
}) as TimelineComponent;

type TimelineComponent = <TEvent extends object, TResource extends object>(
  props: TimelineProps<TEvent, TResource> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => React.JSX.Element;
