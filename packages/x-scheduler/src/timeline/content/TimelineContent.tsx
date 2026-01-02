'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { useStore } from '@base-ui/utils/store';
import { Timeline as TimelinePrimitive } from '@mui/x-scheduler-headless/timeline';
import { useTimelineStoreContext } from '@mui/x-scheduler-headless/use-timeline-store-context';
import { timelineViewSelectors } from '@mui/x-scheduler-headless/timeline-selectors';
import { DaysHeader, MonthsHeader, TimeHeader, WeeksHeader, YearsHeader } from './view-header';
import { TimelineContentProps } from './TimelineContent.types';
import TimelineTitleCell from './timeline-title-cell/TimelineTitleCell';
import { TimelineEvent } from './timeline-event';
import {
  EventPopoverProvider,
  EventPopoverTrigger,
} from '../../internals/components/event-popover';

const TimelineViewContent = styled('section', {
  name: 'MuiTimeline',
  slot: 'Content',
})(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  flexGrow: 1,
  width: '100%',
}));

const TimelineRoot = styled(TimelinePrimitive.Root, {
  name: 'MuiTimeline',
  slot: 'ContentGrid',
})({
  height: '100%',
  display: 'grid',
  gridTemplateColumns: 'minmax(100px, auto) 1fr',
  gridTemplateRows: 'auto repeat(var(--row-count, 0), auto) minmax(auto, 1fr)',
  alignItems: 'stretch',
});

const TitleSubGridContainer = styled('div', {
  name: 'MuiTimeline',
  slot: 'TitleSubGridContainer',
})(({ theme }) => ({
  gridColumn: 1,
  borderRight: `1px solid ${theme.palette.divider}`,
  display: 'grid',
  gridTemplateRows: 'subgrid',
  gridRow: '1 / -1',
}));

const TitleSubGrid = styled(TimelinePrimitive.SubGrid, {
  name: 'MuiTimeline',
  slot: 'TitleSubGrid',
})({
  gridColumn: 1,
  display: 'grid',
  gridTemplateRows: 'subgrid',
  gridRow: '2 / -1',
});

const HeaderTitleRow = styled(TimelinePrimitive.Row, {
  name: 'MuiTimeline',
  slot: 'HeaderTitleRow',
})(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  gridRow: 1,
  gridColumn: 1,
}));

const HeaderTitleCell = styled(TimelinePrimitive.Cell, {
  name: 'MuiTimeline',
  slot: 'HeaderTitleCell',
})(({ theme }) => ({
  fontWeight: theme.typography.fontWeightMedium,
  padding: theme.spacing(1),
  display: 'flex',
  fontSize: theme.typography.body2.fontSize,
  alignItems: 'flex-end',
  height: '100%',
}));

const EventSubGridContainer = styled('div', {
  name: 'MuiTimeline',
  slot: 'EventSubGridContainer',
})({
  overflowX: 'auto',
  scrollbarWidth: 'thin',
  gridColumn: 2,
  display: 'grid',
  gridTemplateRows: 'subgrid',
  gridRow: '1 / -1',
});

const EventSubGrid = styled(TimelinePrimitive.SubGrid, {
  name: 'MuiTimeline',
  slot: 'EventSubGrid',
})({
  display: 'grid',
  gridTemplateRows: 'subgrid',
  gridRow: '2 / -1',
});

const HeaderRow = styled(TimelinePrimitive.Row, {
  name: 'MuiTimeline',
  slot: 'HeaderRow',
})(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  gridRow: 1,
}));

const TimelineEventRow = styled(TimelinePrimitive.EventRow, {
  name: 'MuiTimeline',
  slot: 'EventRow',
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
    <TimelineViewContent ref={handleRef} {...props}>
      <EventPopoverProvider containerRef={containerRef}>
        <TimelineRoot
          style={{ '--unit-width': `var(--${view}-cell-width)` } as React.CSSProperties}
        >
          <TitleSubGridContainer>
            <HeaderTitleRow>
              <HeaderTitleCell>Resource title</HeaderTitleCell>
            </HeaderTitleRow>
            <TitleSubGrid>
              {(resourceId) => <TimelineTitleCell key={resourceId} resourceId={resourceId} />}
            </TitleSubGrid>
          </TitleSubGridContainer>
          <EventSubGridContainer>
            <HeaderRow>
              <TimelinePrimitive.Cell>{header}</TimelinePrimitive.Cell>
            </HeaderRow>
            <EventSubGrid>
              {(resourceId) => (
                <TimelineEventRow key={resourceId} resourceId={resourceId}>
                  {({ occurrences, placeholder }) => (
                    <React.Fragment>
                      {occurrences.map((occurrence) => (
                        <EventPopoverTrigger
                          key={occurrence.key}
                          occurrence={occurrence}
                          render={
                            <TimelineEvent
                              occurrence={occurrence}
                              ariaLabelledBy={`TimelineTitleCell-${occurrence.resource}`}
                              variant="regular"
                            />
                          }
                        />
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
                </TimelineEventRow>
              )}
            </EventSubGrid>
          </EventSubGridContainer>
        </TimelineRoot>
      </EventPopoverProvider>
    </TimelineViewContent>
  );
});
