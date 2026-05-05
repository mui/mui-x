'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { useStore } from '@base-ui/utils/store';
import { SchedulerResourceId } from '@mui/x-scheduler-internals/models';
import { TimelineGrid } from '@mui/x-scheduler-internals-premium/timeline-grid';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium-store-context';
import {
  eventTimelinePremiumPresetSelectors,
  timelineOccurrencePlaceholderSelectors,
} from '@mui/x-scheduler-internals-premium/event-timeline-premium-selectors';
import { useEventOccurrencesWithTimelinePosition } from '@mui/x-scheduler-internals/use-event-occurrences-with-timeline-position';
import { schedulerNowSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useAdapterContext } from '@mui/x-scheduler-internals/use-adapter-context';
import {
  EventDialogProvider,
  EventDialogTrigger,
  useEventDialogContext,
  getCellFocusBackground,
} from '@mui/x-scheduler/internals';
import { EventTimelinePremiumHeader } from './timeline-header';
import { EventTimelinePremiumContentProps } from './EventTimelinePremiumContent.types';
import EventTimelinePremiumTitleCell from './timeline-title-cell/EventTimelinePremiumTitleCell';
import { EventTimelinePremiumEvent } from './timeline-event';
import { useEventTimelinePremiumStyledContext } from '../EventTimelinePremiumStyledContext';

const EventTimelinePremiumContentRoot = styled('section', {
  name: 'MuiEventTimeline',
  slot: 'Content',
})(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  flexGrow: 1,
  width: '100%',
  overflow: 'hidden',
}));

const EventTimelinePremiumGrid = styled(TimelineGrid.Root, {
  name: 'MuiEventTimeline',
  slot: 'Grid',
})({
  height: '100%',
  display: 'grid',
  gridTemplateColumns: 'fit-content(30%) minmax(0, 1fr)',
  gridTemplateRows: 'auto 1fr auto',
  alignItems: 'stretch',
});

const EventTimelinePremiumHeaderRow = styled(TimelineGrid.Row, {
  name: 'MuiEventTimeline',
  slot: 'HeaderRow',
})(({ theme }) => ({
  borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
  gridRow: 1,
  gridColumn: '1 / -1',
  display: 'grid',
  gridTemplateColumns: 'subgrid',
}));

const EventTimelinePremiumTitleHeaderCell = styled(TimelineGrid.Cell, {
  name: 'MuiEventTimeline',
  slot: 'TitleHeaderCell',
})(({ theme }) => ({
  fontWeight: theme.typography.fontWeightMedium,
  padding: theme.spacing(1),
  display: 'flex',
  fontSize: theme.typography.body2.fontSize,
  alignItems: 'flex-end',
  height: '100%',
  borderRight: `1px solid ${(theme.vars || theme).palette.divider}`,
  overflowX: 'hidden',
}));

const EventTimelinePremiumEventsHeaderCell = styled(TimelineGrid.Cell, {
  name: 'MuiEventTimeline',
  slot: 'EventsHeaderCell',
})({
  position: 'relative',
  overflowX: 'clip',
});

const EventTimelinePremiumEventsHeaderCellContent = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'EventsHeaderCellContent',
})({
  height: '100%',
  width: 'calc(var(--unit-count) * var(--unit-width))',
  minWidth: '100%',
  transform: 'translateX(calc(-1 * var(--events-scroll-left, 0) * 1px))',
});

const EventTimelinePremiumBodyScroller = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'BodyScroller',
})({
  gridColumn: '1 / -1',
  gridRow: 2,
  display: 'grid',
  gridTemplateColumns: 'subgrid',
  gridTemplateRows: 'repeat(var(--row-count, 0), auto) minmax(auto, 1fr)',
  overflowY: 'auto',
  overflowX: 'hidden',
  scrollbarWidth: 'thin',
});

/**
 * SubGrid with display: contents so its children (BodyRows) participate
 * directly in the body scroller's grid, while still providing CompositeList
 * and SubGridContext for keyboard navigation.
 */
const EventTimelinePremiumBodyRowSubGrid = styled(TimelineGrid.SubGrid, {
  name: 'MuiEventTimeline',
  slot: 'BodyRowSubGrid',
})({
  display: 'contents',
});

const EventTimelinePremiumBodyRowRoot = styled(TimelineGrid.BodyRow, {
  name: 'MuiEventTimeline',
  slot: 'BodyRow',
})(({ theme }) => ({
  gridColumn: '1 / -1',
  display: 'grid',
  gridTemplateColumns: 'subgrid',
  '&:not(:last-of-type)': {
    borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
  },
}));

const EventTimelinePremiumTitleSubGrid = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'TitleSubGrid',
})(({ theme }) => ({
  gridColumn: 1,
  borderRight: `1px solid ${(theme.vars || theme).palette.divider}`,
  overflow: 'hidden',
}));

const EventTimelinePremiumEventsSubGridRow = styled(TimelineGrid.EventRow, {
  name: 'MuiEventTimeline',
  slot: 'EventsSubGridRow',
})(({ theme }) => ({
  gridColumn: 2,
  overflow: 'clip',
  width: 'calc(var(--unit-count) * var(--unit-width))',
  minWidth: '100%',
  display: 'grid',
  gridTemplateRows: `repeat(var(--lane-count, 1), minmax(calc(${theme.typography.body2.lineHeight}em + ${theme.spacing(1)}), auto))`,
  rowGap: theme.spacing(0.5),
  position: 'relative',
  padding: theme.spacing(2, 0),
  alignContent: 'start',
  transform: 'translateX(calc(-1 * var(--events-scroll-left, 0) * 1px))',
  '&:focus-visible': {
    outline: 'none',
    backgroundColor: getCellFocusBackground(theme),
  },
}));

const EventTimelinePremiumCurrentTimeIndicator = styled(TimelineGrid.CurrentTimeIndicator, {
  name: 'MuiEventTimeline',
  slot: 'CurrentTimeIndicator',
})(({ theme }) => ({
  gridRow: '1 / -1',
  gridColumn: 2,
  marginLeft:
    'calc(var(--unit-count) * var(--unit-width) * var(--x-position) - var(--events-scroll-left, 0) * 1px)',
  width: 0,
  zIndex: 2,
  borderLeft: `2px solid ${(theme.vars || theme).palette.primary.main}`,
  pointerEvents: 'none',
}));

const EventTimelinePremiumCurrentTimeIndicatorCircle = styled(TimelineGrid.CurrentTimeIndicator, {
  name: 'MuiEventTimeline',
  slot: 'CurrentTimeIndicatorCircle',
})(({ theme }) => ({
  position: 'absolute',
  bottom: -5,
  // 3px = half the circle's width (4px) minus half the line's width (1px), to center the circle on the line.
  left: 'calc(var(--unit-count) * var(--unit-width) * var(--x-position) - var(--events-scroll-left, 0) * 1px - 3px)',
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: (theme.vars || theme).palette.primary.main,
  zIndex: 1,
}));

const EventTimelinePremiumEventsScrollbar = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'EventsScrollbar',
})({
  gridRow: 3,
  gridColumn: '1 / -1',
  overflowX: 'auto',
  overflowY: 'hidden',
  scrollbarWidth: 'thin',
});

function EventRowContent({
  resourceId,
  occurrences,
  placeholder,
}: {
  resourceId: SchedulerResourceId;
  occurrences: useEventOccurrencesWithTimelinePosition.EventOccurrenceWithPosition[];
  placeholder: useEventOccurrencesWithTimelinePosition.EventOccurrencePlaceholderWithPosition | null;
}) {
  const store = useEventTimelinePremiumStoreContext();
  const { schedulerId } = useEventTimelinePremiumStyledContext();
  const { onOpen: startEditing } = useEventDialogContext();
  const placeholderRef = React.useRef<HTMLDivElement | null>(null);

  const isCreatingAnEvent = useStore(
    store,
    timelineOccurrencePlaceholderSelectors.isCreatingInResource,
    resourceId,
  );

  React.useEffect(() => {
    if (!isCreatingAnEvent || !placeholder || !placeholderRef.current) {
      return;
    }
    startEditing(placeholderRef, placeholder);
  }, [isCreatingAnEvent, placeholder, startEditing]);

  return (
    <React.Fragment>
      {occurrences.map((occurrence) => (
        <EventDialogTrigger key={occurrence.key} occurrence={occurrence}>
          <EventTimelinePremiumEvent
            occurrence={occurrence}
            ariaLabelledBy={`${schedulerId}-EventTimelinePremiumTitleCell-${occurrence.resource}`}
            variant="regular"
          />
        </EventDialogTrigger>
      ))}
      {placeholder != null && (
        <EventTimelinePremiumEvent
          ref={placeholderRef}
          occurrence={placeholder}
          ariaLabelledBy={`${schedulerId}-EventTimelinePremiumTitleCell-${placeholder.resource}`}
          variant="placeholder"
        />
      )}
    </React.Fragment>
  );
}

/**
 * Syncs the events scrollbar with the `--events-scroll-left` CSS variable on the grid root,
 * and handles horizontal wheel events on the body scroller.
 */
function useEventsHorizontalScroll(
  gridRef: React.RefObject<HTMLElement | null>,
  bodyScrollerRef: React.RefObject<HTMLElement | null>,
  eventsScrollbarRef: React.RefObject<HTMLElement | null>,
) {
  // Sync scrollbar → CSS variable
  React.useEffect(() => {
    const scrollbar = eventsScrollbarRef.current;
    const grid = gridRef.current;
    if (!scrollbar || !grid) {
      return undefined;
    }

    const handleScroll = () => {
      grid.style.setProperty('--events-scroll-left', String(scrollbar.scrollLeft));
    };

    scrollbar.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollbar.removeEventListener('scroll', handleScroll);
  }, [gridRef, eventsScrollbarRef]);

  // Handle horizontal wheel events on body scroller → forward to scrollbar
  React.useEffect(() => {
    const scroller = bodyScrollerRef.current;
    const scrollbar = eventsScrollbarRef.current;
    if (!scroller || !scrollbar) {
      return undefined;
    }

    const handleWheel = (event: WheelEvent) => {
      // Only intercept primarily-horizontal scroll gestures
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) {
        return;
      }
      event.preventDefault();
      scrollbar.scrollLeft += event.deltaX;
    };

    scroller.addEventListener('wheel', handleWheel, { passive: false });
    return () => scroller.removeEventListener('wheel', handleWheel);
  }, [bodyScrollerRef, eventsScrollbarRef]);
}

export const EventTimelinePremiumContent = React.forwardRef(function EventTimelinePremiumContent(
  props: EventTimelinePremiumContentProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  // Context hooks
  const store = useEventTimelinePremiumStoreContext();
  const { classes, localeText, resourceColumnLabel } = useEventTimelinePremiumStyledContext();

  // Ref hooks
  const containerRef = React.useRef<HTMLElement | null>(null);
  const gridRef = React.useRef<HTMLDivElement | null>(null);
  const eventsHeaderCellRef = React.useRef<HTMLDivElement | null>(null);
  const bodyScrollerRef = React.useRef<HTMLDivElement | null>(null);
  const eventsScrollbarRef = React.useRef<HTMLDivElement | null>(null);
  const handleRef = useMergedRefs(forwardedRef, containerRef);

  // Selector hooks
  const adapter = useAdapterContext();
  const now = useStore(store, schedulerNowSelectors.nowUpdatedEveryMinute);
  const showCurrentTimeIndicatorSetting = useStore(
    store,
    schedulerNowSelectors.showCurrentTimeIndicator,
  );
  const presetConfig = useStore(store, eventTimelinePremiumPresetSelectors.config);
  const isNowInView = React.useMemo(
    () => adapter.isWithinRange(now, [presetConfig.start, presetConfig.end]),
    [adapter, now, presetConfig.start, presetConfig.end],
  );
  const showCurrentTimeIndicator = showCurrentTimeIndicatorSetting && isNowInView;

  // Reset horizontal scroll position when navigating to a new time period
  React.useEffect(() => {
    const scrollbar = eventsScrollbarRef.current;
    const grid = gridRef.current;
    if (scrollbar) {
      scrollbar.scrollLeft = 0;
    }
    if (grid) {
      grid.style.setProperty('--events-scroll-left', '0');
    }
  }, [presetConfig.start]);

  // Sync events horizontal scroll: scrollbar ↔ CSS variable + wheel events
  useEventsHorizontalScroll(gridRef, bodyScrollerRef, eventsScrollbarRef);

  return (
    <EventTimelinePremiumContentRoot ref={handleRef} className={classes.content} {...props}>
      <EventDialogProvider>
        <EventTimelinePremiumGrid
          ref={gridRef}
          className={classes.grid}
          style={{ '--unit-width': `${presetConfig.tickWidth}px` } as React.CSSProperties}
        >
          <EventTimelinePremiumHeaderRow className={classes.headerRow} aria-rowindex={1}>
            <EventTimelinePremiumTitleHeaderCell className={classes.titleHeaderCell}>
              {resourceColumnLabel ?? localeText.timelineResourceTitleHeader}
            </EventTimelinePremiumTitleHeaderCell>
            <EventTimelinePremiumEventsHeaderCell
              ref={eventsHeaderCellRef}
              className={classes.eventsHeaderCell}
            >
              <EventTimelinePremiumEventsHeaderCellContent
                className={classes.eventsHeaderCellContent}
              >
                <EventTimelinePremiumHeader />
              </EventTimelinePremiumEventsHeaderCellContent>
              {showCurrentTimeIndicator && (
                <EventTimelinePremiumCurrentTimeIndicatorCircle
                  className={classes.currentTimeIndicatorCircle}
                  aria-hidden
                />
              )}
            </EventTimelinePremiumEventsHeaderCell>
          </EventTimelinePremiumHeaderRow>
          <EventTimelinePremiumBodyScroller ref={bodyScrollerRef} role="presentation">
            <EventTimelinePremiumBodyRowSubGrid>
              {(resourceId) => (
                <EventTimelinePremiumBodyRowRoot key={resourceId}>
                  <EventTimelinePremiumTitleSubGrid className={classes.titleSubGrid}>
                    <EventTimelinePremiumTitleCell resourceId={resourceId} />
                  </EventTimelinePremiumTitleSubGrid>
                  <EventTimelinePremiumEventsSubGridRow
                    resourceId={resourceId}
                    className={classes.eventsSubGridRow}
                  >
                    {({ occurrences, placeholder }) => (
                      <EventRowContent
                        resourceId={resourceId}
                        occurrences={occurrences}
                        placeholder={placeholder}
                      />
                    )}
                  </EventTimelinePremiumEventsSubGridRow>
                </EventTimelinePremiumBodyRowRoot>
              )}
            </EventTimelinePremiumBodyRowSubGrid>
            {showCurrentTimeIndicator && (
              <EventTimelinePremiumCurrentTimeIndicator
                className={classes.currentTimeIndicator}
                aria-hidden
              />
            )}
          </EventTimelinePremiumBodyScroller>
          <EventTimelinePremiumEventsScrollbar ref={eventsScrollbarRef} aria-hidden>
            <div
              style={{
                width: 'calc(var(--unit-count) * var(--unit-width))',
                height: 1,
              }}
            />
          </EventTimelinePremiumEventsScrollbar>
        </EventTimelinePremiumGrid>
      </EventDialogProvider>
    </EventTimelinePremiumContentRoot>
  );
});
