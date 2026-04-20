'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { useStore } from '@base-ui/utils/store';
import { SchedulerResourceId } from '@mui/x-scheduler-headless/models';
import { TimelineGrid } from '@mui/x-scheduler-headless-premium/timeline-grid';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-headless-premium/use-event-timeline-premium-store-context';
import {
  eventTimelinePremiumPresetSelectors,
  timelineOccurrencePlaceholderSelectors,
} from '@mui/x-scheduler-headless-premium/event-timeline-premium-selectors';
import { useEventOccurrencesWithTimelinePosition } from '@mui/x-scheduler-headless/use-event-occurrences-with-timeline-position';
import { schedulerNowSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { useAdapterContext } from '@mui/x-scheduler-headless/use-adapter-context';
import {
  EventDialogProvider,
  EventDialogTrigger,
  useEventDialogContext,
} from '@mui/x-scheduler/internals';
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
  overflowX: 'hidden',
  height: '100%',
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

const EventTimelinePremiumTitleSubGrid = styled(TimelineGrid.SubGrid, {
  name: 'MuiEventTimeline',
  slot: 'TitleSubGrid',
})(({ theme }) => ({
  gridColumn: 1,
  display: 'grid',
  gridTemplateRows: 'subgrid',
  gridRow: '1 / -1',
  borderRight: `1px solid ${(theme.vars || theme).palette.divider}`,
  overflowX: 'auto',
  overflowY: 'clip',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
}));

const EventTimelinePremiumEventsSubGridWrapper = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'EventsSubGridWrapper',
})({
  overflowX: 'auto',
  overflowY: 'clip',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
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
  gridRow: '1 / -1',
  gridColumn: 1,
});

const EventTimelinePremiumEventsSubGridRow = styled(TimelineGrid.EventRow, {
  name: 'MuiEventTimeline',
  slot: 'EventsSubGridRow',
})(({ theme }) => ({
  width: 'calc(var(--unit-count) * var(--unit-width))',
  minWidth: '100%',
  display: 'grid',
  gridTemplateRows: `repeat(var(--lane-count, 1), minmax(calc(${theme.typography.body2.lineHeight}em + ${theme.spacing(1)}), auto))`,
  rowGap: theme.spacing(0.5),
  position: 'relative',
  padding: theme.spacing(2, 0),
  alignContent: 'start',
  '&:not(:last-of-type)': {
    borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
  },
}));

const EventTimelinePremiumCurrentTimeIndicator = styled(TimelineGrid.CurrentTimeIndicator, {
  name: 'MuiEventTimeline',
  slot: 'CurrentTimeIndicator',
})(({ theme }) => ({
  gridRow: '1 / -1',
  gridColumn: 1,
  marginLeft: 'calc(var(--unit-count) * var(--unit-width) * var(--x-position))',
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

const EventTimelinePremiumTitleScrollbar = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'TitleScrollbar',
})(({ theme }) => ({
  gridRow: 3,
  gridColumn: 1,
  overflowX: 'auto',
  overflowY: 'hidden',
  scrollbarWidth: 'thin',
  borderRight: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

const EventTimelinePremiumEventsScrollbar = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'EventsScrollbar',
})({
  gridRow: 3,
  gridColumn: 2,
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
 * Sets up bi-directional scroll sync between a content area and a scrollbar widget,
 * plus an optional header element that follows the content's scrollLeft.
 */
function useSyncedHorizontalScroll(
  contentRef: React.RefObject<HTMLElement | null>,
  scrollbarRef: React.RefObject<HTMLElement | null>,
  headerRef?: React.RefObject<HTMLElement | null>,
  onScrollLeft?: (scrollLeft: number) => void,
) {
  React.useEffect(() => {
    const content = contentRef.current;
    const scrollbar = scrollbarRef.current;
    if (!content || !scrollbar) {
      return undefined;
    }

    let syncing = false;

    const header = headerRef?.current;

    const syncScrollLeft = (scrollLeft: number) => {
      if (header) {
        header.scrollLeft = scrollLeft;
      }
      onScrollLeft?.(scrollLeft);
    };

    const handleContentScroll = () => {
      if (syncing) {
        return;
      }
      syncing = true;
      const { scrollLeft } = content;
      scrollbar.scrollLeft = scrollLeft;
      syncScrollLeft(scrollLeft);
      requestAnimationFrame(() => {
        syncing = false;
      });
    };

    const handleScrollbarScroll = () => {
      if (syncing) {
        return;
      }
      syncing = true;
      const { scrollLeft } = scrollbar;
      content.scrollLeft = scrollLeft;
      syncScrollLeft(scrollLeft);
      requestAnimationFrame(() => {
        syncing = false;
      });
    };

    syncScrollLeft(content.scrollLeft);
    content.addEventListener('scroll', handleContentScroll, { passive: true });
    scrollbar.addEventListener('scroll', handleScrollbarScroll, { passive: true });
    return () => {
      content.removeEventListener('scroll', handleContentScroll);
      scrollbar.removeEventListener('scroll', handleScrollbarScroll);
    };
  }, [contentRef, scrollbarRef, headerRef, onScrollLeft]);
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
  const eventsHeaderCellRef = React.useRef<HTMLDivElement | null>(null);
  const eventsHeaderRef = React.useRef<HTMLDivElement | null>(null);
  const eventsScrollerRef = React.useRef<HTMLDivElement | null>(null);
  const eventsScrollbarRef = React.useRef<HTMLDivElement | null>(null);
  const titleHeaderRef = React.useRef<HTMLDivElement | null>(null);
  const titleSubGridRef = React.useRef<HTMLDivElement | null>(null);
  const titleScrollbarRef = React.useRef<HTMLDivElement | null>(null);
  const titleScrollbarSpacerRef = React.useRef<HTMLDivElement | null>(null);
  const handleRef = useMergedRefs(forwardedRef, containerRef);

  // Selector hooks
  const adapter = useAdapterContext();
  const preset = useStore(store, eventTimelinePremiumPresetSelectors.preset);
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

  // Track scrollLeft as CSS variable on header cell for the current time indicator circle
  const syncCircleScroll = React.useCallback((scrollLeft: number) => {
    eventsHeaderCellRef.current?.style.setProperty('--events-scroll-left', String(scrollLeft));
  }, []);

  // Reset horizontal scroll position to the left edge when navigating to a new time period
  React.useEffect(() => {
    for (const ref of [eventsScrollerRef, eventsScrollbarRef, eventsHeaderRef]) {
      if (ref.current) {
        ref.current.scrollLeft = 0;
      }
    }
  }, [presetConfig.start]);

  // Sync horizontal scroll: events body ↔ events scrollbar + events header
  useSyncedHorizontalScroll(
    eventsScrollerRef,
    eventsScrollbarRef,
    eventsHeaderRef,
    syncCircleScroll,
  );

  // Sync horizontal scroll: title body ↔ title scrollbar + title header
  useSyncedHorizontalScroll(titleSubGridRef, titleScrollbarRef, titleHeaderRef);

  // Keep title scrollbar spacer width in sync with title content width
  React.useEffect(() => {
    const subgrid = titleSubGridRef.current;
    const spacer = titleScrollbarSpacerRef.current;
    if (!subgrid || !spacer) {
      return undefined;
    }
    const updateWidth = () => {
      if (subgrid.scrollWidth > subgrid.clientWidth) {
        spacer.style.width = `${subgrid.scrollWidth}px`;
      } else {
        spacer.style.width = '';
      }
    };
    updateWidth();
    if (typeof ResizeObserver === 'undefined') {
      return undefined;
    }
    const observer = new ResizeObserver(updateWidth);
    observer.observe(subgrid);
    return () => observer.disconnect();
  }, []);

  // Feature hooks
  let header: React.ReactNode;
  switch (preset) {
    case 'dayAndHour':
      header = <TimeHeader />;
      break;
    case 'day':
      header = <DaysHeader />;
      break;
    case 'dayAndWeek':
      header = <WeeksHeader />;
      break;
    case 'monthAndYear':
      header = <MonthsHeader />;
      break;
    case 'year':
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
          style={{ '--unit-width': `var(--${preset}-cell-width)` } as React.CSSProperties}
        >
          <EventTimelinePremiumHeaderRow className={classes.headerRow}>
            <EventTimelinePremiumTitleHeaderCell
              ref={titleHeaderRef}
              className={classes.titleHeaderCell}
            >
              {resourceColumnLabel ?? localeText.timelineResourceTitleHeader}
            </EventTimelinePremiumTitleHeaderCell>
            <EventTimelinePremiumEventsHeaderCell
              ref={eventsHeaderCellRef}
              className={classes.eventsHeaderCell}
            >
              <EventTimelinePremiumEventsHeaderCellContent
                ref={eventsHeaderRef}
                className={classes.eventsHeaderCellContent}
              >
                {header}
              </EventTimelinePremiumEventsHeaderCellContent>
              {showCurrentTimeIndicator && (
                <EventTimelinePremiumCurrentTimeIndicatorCircle
                  className={classes.currentTimeIndicatorCircle}
                  aria-hidden
                />
              )}
            </EventTimelinePremiumEventsHeaderCell>
          </EventTimelinePremiumHeaderRow>
          <EventTimelinePremiumBodyScroller role="presentation">
            <EventTimelinePremiumTitleSubGrid
              ref={titleSubGridRef}
              className={classes.titleSubGrid}
            >
              {(resourceId) => (
                <EventTimelinePremiumTitleCell key={resourceId} resourceId={resourceId} />
              )}
            </EventTimelinePremiumTitleSubGrid>
            <EventTimelinePremiumEventsSubGridWrapper
              ref={eventsScrollerRef}
              role="presentation"
              className={classes.eventsSubGridWrapper}
            >
              <EventTimelinePremiumEventsSubGrid className={classes.eventsSubGrid}>
                {(resourceId) => (
                  <EventTimelinePremiumEventsSubGridRow
                    key={resourceId}
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
                )}
              </EventTimelinePremiumEventsSubGrid>
              {showCurrentTimeIndicator && (
                <EventTimelinePremiumCurrentTimeIndicator
                  className={classes.currentTimeIndicator}
                  aria-hidden
                />
              )}
            </EventTimelinePremiumEventsSubGridWrapper>
          </EventTimelinePremiumBodyScroller>
          <EventTimelinePremiumTitleScrollbar ref={titleScrollbarRef} aria-hidden>
            <div ref={titleScrollbarSpacerRef} style={{ height: 1 }} />
          </EventTimelinePremiumTitleScrollbar>
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
