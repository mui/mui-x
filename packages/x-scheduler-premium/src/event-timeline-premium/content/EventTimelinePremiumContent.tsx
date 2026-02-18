'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { useStore } from '@base-ui/utils/store';
import { TimelineGrid } from '@mui/x-scheduler-headless-premium/timeline-grid';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-headless-premium/use-event-timeline-premium-store-context';
import { eventTimelinePremiumViewSelectors } from '@mui/x-scheduler-headless-premium/event-timeline-premium-selectors';
import { EventDialogProvider, EventDialogTrigger } from '@mui/x-scheduler/internals';
import { DaysHeader, MonthsHeader, TimeHeader, WeeksHeader, YearsHeader } from './view-header';
import { EventTimelinePremiumContentProps } from './EventTimelinePremiumContent.types';
import EventTimelinePremiumTitleCell from './timeline-title-cell/EventTimelinePremiumTitleCell';
import { EventTimelinePremiumEvent } from './timeline-event';
import { useEventTimelinePremiumStyledContext } from '../EventTimelinePremiumStyledContext';

const EventTimelinePremiumContentRoot = styled('section', {
  name: 'MuiEventTimeline',
  slot: 'Content',
})(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  flexGrow: 1,
  width: '100%',
}));

const EventTimelinePremiumGrid = styled(TimelineGrid.Root, {
  name: 'MuiEventTimeline',
  slot: 'Grid',
})({
  height: '100%',
  display: 'grid',
  gridTemplateColumns: 'minmax(100px, auto) 1fr',
  gridTemplateRows: 'auto repeat(var(--row-count, 0), auto) minmax(auto, 1fr)',
  alignItems: 'stretch',
});

const EventTimelinePremiumTitleSubGridWrapper = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'TitleSubGridWrapper',
})(({ theme }) => ({
  gridColumn: 1,
  borderRight: `1px solid ${theme.palette.divider}`,
  display: 'grid',
  gridTemplateRows: 'subgrid',
  gridRow: '1 / -1',
}));

const EventTimelinePremiumTitleSubGrid = styled(TimelineGrid.SubGrid, {
  name: 'MuiEventTimeline',
  slot: 'TitleSubGrid',
})({
  gridColumn: 1,
  display: 'grid',
  gridTemplateRows: 'subgrid',
  gridRow: '2 / -1',
});

const EventTimelinePremiumTitleSubGridHeaderRow = styled(TimelineGrid.Row, {
  name: 'MuiEventTimeline',
  slot: 'TitleSubGridHeaderRow',
})(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  gridRow: 1,
  gridColumn: 1,
}));

const EventTimelinePremiumTitleSubGridHeaderCell = styled(TimelineGrid.Cell, {
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

const EventTimelinePremiumEventsSubGridWrapper = styled('div', {
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

const EventTimelinePremiumEventsSubGrid = styled(TimelineGrid.SubGrid, {
  name: 'MuiEventTimeline',
  slot: 'EventsSubGrid',
})({
  display: 'grid',
  gridTemplateRows: 'subgrid',
  gridRow: '2 / -1',
});

const EventTimelinePremiumEventsSubGridHeaderRow = styled(TimelineGrid.Row, {
  name: 'MuiEventTimeline',
  slot: 'EventsSubGridHeaderRow',
})(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  gridRow: 1,
}));

const EventTimelinePremiumEventsSubGridRow = styled(TimelineGrid.EventRow, {
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

export const EventTimelinePremiumContent = React.forwardRef(function EventTimelinePremiumContent(
  props: EventTimelinePremiumContentProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  // Context hooks
  const store = useEventTimelinePremiumStoreContext();
  const { classes, localeText } = useEventTimelinePremiumStyledContext();

  // Ref hooks
  const containerRef = React.useRef<HTMLElement | null>(null);
  const handleRef = useMergedRefs(forwardedRef, containerRef);

  // Selector hooks
  const view = useStore(store, eventTimelinePremiumViewSelectors.view);

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
    <EventTimelinePremiumContentRoot ref={handleRef} className={classes.content} {...props}>
      <EventDialogProvider>
        <EventTimelinePremiumGrid
          className={classes.grid}
          style={{ '--unit-width': `var(--${view}-cell-width)` } as React.CSSProperties}
        >
          <EventTimelinePremiumTitleSubGridWrapper className={classes.titleSubGridWrapper}>
            <EventTimelinePremiumTitleSubGridHeaderRow className={classes.titleSubGridHeaderRow}>
              <EventTimelinePremiumTitleSubGridHeaderCell
                className={classes.titleSubGridHeaderCell}
              >
                {localeText.timelineResourceTitleHeader}
              </EventTimelinePremiumTitleSubGridHeaderCell>
            </EventTimelinePremiumTitleSubGridHeaderRow>
            <EventTimelinePremiumTitleSubGrid className={classes.titleSubGrid}>
              {(resourceId) => (
                <EventTimelinePremiumTitleCell key={resourceId} resourceId={resourceId} />
              )}
            </EventTimelinePremiumTitleSubGrid>
          </EventTimelinePremiumTitleSubGridWrapper>
          <EventTimelinePremiumEventsSubGridWrapper className={classes.eventsSubGridWrapper}>
            <EventTimelinePremiumEventsSubGridHeaderRow className={classes.eventsSubGridHeaderRow}>
              <TimelineGrid.Cell>{header}</TimelineGrid.Cell>
            </EventTimelinePremiumEventsSubGridHeaderRow>
            <EventTimelinePremiumEventsSubGrid className={classes.eventsSubGrid}>
              {(resourceId) => (
                <EventTimelinePremiumEventsSubGridRow
                  key={resourceId}
                  resourceId={resourceId}
                  className={classes.eventsSubGridRow}
                >
                  {({ occurrences, placeholder }) => (
                    <React.Fragment>
                      {occurrences.map((occurrence) => (
                        <EventDialogTrigger key={occurrence.key} occurrence={occurrence}>
                          <EventTimelinePremiumEvent
                            occurrence={occurrence}
                            ariaLabelledBy={`TimelineTitleCell-${occurrence.resource}`}
                            variant="regular"
                          />
                        </EventDialogTrigger>
                      ))}
                      {placeholder != null && (
                        <EventTimelinePremiumEvent
                          occurrence={placeholder}
                          ariaLabelledBy={`EventTimelinePremiumTitleCell-${placeholder.resource}`}
                          variant="placeholder"
                        />
                      )}
                    </React.Fragment>
                  )}
                </EventTimelinePremiumEventsSubGridRow>
              )}
            </EventTimelinePremiumEventsSubGrid>
          </EventTimelinePremiumEventsSubGridWrapper>
        </EventTimelinePremiumGrid>
      </EventDialogProvider>
    </EventTimelinePremiumContentRoot>
  );
});
