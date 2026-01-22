'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { useStore } from '@base-ui/utils/store';
import { Timeline as TimelinePrimitive } from '@mui/x-scheduler-headless-premium/timeline';
import { useTimelineStoreContext } from '@mui/x-scheduler-headless-premium/use-timeline-store-context';
import { timelineViewSelectors } from '@mui/x-scheduler-headless-premium/timeline-selectors';
import { DaysHeader, MonthsHeader, TimeHeader, WeeksHeader, YearsHeader } from './view-header';
import { TimelineContentProps } from './TimelineContent.types';
import TimelineTitleCell from './timeline-title-cell/TimelineTitleCell';
import { TimelineEvent } from './timeline-event';
import {
  EventDraggableDialogProvider,
  EventDraggableDialogTrigger,
} from '@mui/x-scheduler/internals';

const EventTimelineContent = styled('section', {
  name: 'MuiEventTimeline',
  slot: 'Content',
})(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  flexGrow: 1,
  width: '100%',
}));

const EventTimelineGrid = styled(TimelinePrimitive.Root, {
  name: 'MuiEventTimeline',
  slot: 'Grid',
})({
  height: '100%',
  display: 'grid',
  gridTemplateColumns: 'minmax(100px, auto) 1fr',
  gridTemplateRows: 'auto repeat(var(--row-count, 0), auto) minmax(auto, 1fr)',
  alignItems: 'stretch',
});

const EventTimelineTitleSubGridWrapper = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'TitleSubGridWrapper',
})(({ theme }) => ({
  gridColumn: 1,
  borderRight: `1px solid ${theme.palette.divider}`,
  display: 'grid',
  gridTemplateRows: 'subgrid',
  gridRow: '1 / -1',
}));

const EventTimelineTitleSubGrid = styled(TimelinePrimitive.SubGrid, {
  name: 'MuiEventTimeline',
  slot: 'TitleSubGrid',
})({
  gridColumn: 1,
  display: 'grid',
  gridTemplateRows: 'subgrid',
  gridRow: '2 / -1',
});

const EventTimelineTitleSubGridHeaderRow = styled(TimelinePrimitive.Row, {
  name: 'MuiEventTimeline',
  slot: 'TitleSubGridHeaderRow',
})(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  gridRow: 1,
  gridColumn: 1,
}));

const EventTimelineTitleSubGridHeaderCell = styled(TimelinePrimitive.Cell, {
  name: 'MuiEventTimeline',
  slot: 'TitleSubGridHeaderCell',
})(({ theme }) => ({
  fontWeight: theme.typography.fontWeightMedium,
  padding: theme.spacing(1),
  display: 'flex',
  fontSize: theme.typography.body2.fontSize,
  alignItems: 'flex-end',
  height: '100%',
}));

const EventTimelineEventsSubGridWrapper = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'EventsSubGridWrapper',
})({
  overflowX: 'auto',
  scrollbarWidth: 'thin',
  gridColumn: 2,
  display: 'grid',
  gridTemplateRows: 'subgrid',
  gridRow: '1 / -1',
});

const EventTimelineEventsSubGrid = styled(TimelinePrimitive.SubGrid, {
  name: 'MuiEventTimeline',
  slot: 'EventsSubGrid',
})({
  display: 'grid',
  gridTemplateRows: 'subgrid',
  gridRow: '2 / -1',
});

const EventTimelineEventsSubGridHeaderRow = styled(TimelinePrimitive.Row, {
  name: 'MuiEventTimeline',
  slot: 'EventsSubGridHeaderRow',
})(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  gridRow: 1,
}));

const EventTimelineEventsSubGridRow = styled(TimelinePrimitive.EventRow, {
  name: 'MuiEventTimeline',
  slot: 'EventsSubGridRow',
})(({ theme }) => ({
  width: 'calc(var(--unit-count) * var(--unit-width))',
  minWidth: '100%',
  boxSizing: 'border-box',
  display: 'grid',
  gridTemplateRows: 'repeat(var(--lane-count, 1), auto)',
  rowGap: theme.spacing(0.5),
  position: 'relative',
  padding: theme.spacing(2),
  alignContent: 'start',
  '&:not(:last-of-type)': {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

export const TimelineContent = React.forwardRef(function TimelineContent(
  props: TimelineContentProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  // Context hooks
  const store = useTimelineStoreContext();

  // Ref hooks
  const containerRef = React.useRef<HTMLElement | null>(null);
  const handleRef = useMergedRefs(forwardedRef, containerRef);

  // Selector hooks
  const view = useStore(store, timelineViewSelectors.view);

  // Feature hooks
  let header: React.ReactNode;
  switch (view) {
    case 'time':
      header = <TimeHeader />;
      break;
    case 'days':
      header = <DaysHeader />;
      break;
    case 'weeks':
      header = <WeeksHeader />;
      break;
    case 'months':
      header = <MonthsHeader />;
      break;
    case 'years':
      header = <YearsHeader />;
      break;
    default:
      header = null;
  }

  return (
    <EventTimelineContent ref={handleRef} {...props}>
      <EventDraggableDialogProvider>
        <EventTimelineGrid
          style={{ '--unit-width': `var(--${view}-cell-width)` } as React.CSSProperties}
        >
          <EventTimelineTitleSubGridWrapper>
            <EventTimelineTitleSubGridHeaderRow>
              <EventTimelineTitleSubGridHeaderCell>
                Resource title
              </EventTimelineTitleSubGridHeaderCell>
            </EventTimelineTitleSubGridHeaderRow>
            <EventTimelineTitleSubGrid>
              {(resourceId) => <TimelineTitleCell key={resourceId} resourceId={resourceId} />}
            </EventTimelineTitleSubGrid>
          </EventTimelineTitleSubGridWrapper>
          <EventTimelineEventsSubGridWrapper>
            <EventTimelineEventsSubGridHeaderRow>
              <TimelinePrimitive.Cell>{header}</TimelinePrimitive.Cell>
            </EventTimelineEventsSubGridHeaderRow>
            <EventTimelineEventsSubGrid>
              {(resourceId) => (
                <EventTimelineEventsSubGridRow key={resourceId} resourceId={resourceId}>
                  {({ occurrences, placeholder }) => (
                    <React.Fragment>
                      {occurrences.map((occurrence) => (
                        <EventDraggableDialogTrigger key={occurrence.key} occurrence={occurrence}>
                          <TimelineEvent
                            occurrence={occurrence}
                            ariaLabelledBy={`TimelineTitleCell-${occurrence.resource}`}
                            variant="regular"
                          />
                        </EventDraggableDialogTrigger>
                      ))}
                      {placeholder != null && (
                        <TimelineEvent
                          occurrence={placeholder}
                          ariaLabelledBy={`TimelineTitleCell-${placeholder.resource}`}
                          variant="placeholder"
                        />
                      )}
                    </React.Fragment>
                  )}
                </EventTimelineEventsSubGridRow>
              )}
            </EventTimelineEventsSubGrid>
          </EventTimelineEventsSubGridWrapper>
        </EventTimelineGrid>
      </EventDraggableDialogProvider>
    </EventTimelineContent>
  );
});
