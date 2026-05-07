'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { useStore } from '@base-ui/utils/store';
import useLazyRef from '@mui/utils/useLazyRef';
import { SchedulerResourceId } from '@mui/x-scheduler-internals/models';
import { useVirtualizer, LayoutDataGrid, Dimensions } from '@mui/x-virtualizer';
import { TimelineGrid } from '@mui/x-scheduler-internals-premium/timeline-grid';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium-store-context';
import {
  eventTimelinePremiumPresetSelectors,
  timelineOccurrencePlaceholderSelectors,
} from '@mui/x-scheduler-internals-premium/event-timeline-premium-selectors';
import { useEventOccurrencesWithTimelinePosition } from '@mui/x-scheduler-internals/use-event-occurrences-with-timeline-position';
import {
  schedulerNowSelectors,
  schedulerOccurrenceSelectors,
} from '@mui/x-scheduler-internals/scheduler-selectors';
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

const ROW_HEIGHT = 74;

const EventTimelinePremiumContentRoot = styled('section', {
  name: 'MuiEventTimeline',
  slot: 'Content',
})(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  flexGrow: 1,
  width: '100%',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}));

const EventTimelinePremiumGrid = styled(TimelineGrid.Root, {
  name: 'MuiEventTimeline',
  slot: 'Grid',
})({
  flex: 1,
  flexGrow: 1,
  minHeight: 0,
  height: '100%',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'scroll',

  scrollbarWidth: 'none' /* Firefox */,
  '&::-webkit-scrollbar': {
    display: 'none' /* Safari and Chrome */,
  },

  '@media print': {
    overflow: 'hidden',
  },

  // Creates a stacking context so z-indexed children (header, render zone) don't bleed outside.
  // Also https://github.com/mui/mui-x/issues/10547
  zIndex: 0,
});

const EventTimelinePremiumHeaderRow = styled(TimelineGrid.Row, {
  name: 'MuiEventTimeline',
  slot: 'HeaderRow',
})(({ theme }) => ({
  borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
  display: 'flex',
  width: 'var(--row-width)',
  position: 'relative',
  zIndex: 1,
  backgroundColor: (theme.vars || theme).palette.background.default,
}));

const EventTimelinePremiumTitleHeaderCell = styled(TimelineGrid.Cell, {
  name: 'MuiEventTimeline',
  slot: 'TitleHeaderCell',
})(({ theme }) => ({
  flex: '0 0 auto',
  width: 'var(--title-column-width)',
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
  flex: 1,
  minWidth: 0,
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

const EventTimelinePremiumScrollerContent = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'ScrollerContent',
})({
  flex: '1 0 auto',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
});

const EventTimelinePremiumViewport = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'Viewport',
})({
  display: 'inline-block',
  position: 'sticky',
  top: 0,
  left: 0,
  overflow: 'hidden',
});

const EventTimelinePremiumBodyRow = styled(TimelineGrid.BodyRow, {
  name: 'MuiEventTimeline',
  slot: 'BodyRow',
})(({ theme }) => ({
  display: 'flex',
  width: 'var(--row-width)',
  breakInside: 'avoid',
  '&:not(:last-of-type)': {
    borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
  },
}));

const EventTimelinePremiumEventsCell = styled(TimelineGrid.EventRow, {
  name: 'MuiEventTimeline',
  slot: 'EventsCell',
})(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  overflow: 'clip',
  width: 'calc(var(--unit-count) * var(--unit-width))',
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
  position: 'absolute',
  top: 0,
  bottom: 0,
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
})(({ theme }) => ({
  flexShrink: 0,
  overflowX: 'auto',
  overflowY: 'hidden',
  scrollbarWidth: 'thin',
  borderTop: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

/**
 * Render zone that wraps the visible virtualized rows.
 * Uses `transform: translate3d()` from the virtualizer to offset to the correct scroll position.
 */
const VirtualizerRenderZone = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'RenderZone',
})({
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
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
 * Measures the height of an element via ResizeObserver and returns it as state.
 */
function useElementHeight(ref: React.RefObject<HTMLElement | null>): number {
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) {
      return undefined;
    }

    if (typeof ResizeObserver === 'undefined') {
      setHeight(element.offsetHeight);
      return undefined;
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeight(entry.borderBoxSize[0].blockSize);
      }
    });

    setHeight(element.offsetHeight);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return height;
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
  const headerRowRef = React.useRef<HTMLDivElement | null>(null);
  const eventsScrollbarRef = React.useRef<HTMLDivElement | null>(null);

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

  const resources = useStore(
    store,
    schedulerOccurrenceSelectors.groupedByResourceList,
    presetConfig.start,
    presetConfig.end,
  );

  // Measure header height for the virtualizer's topPinnedHeight
  const headerHeight = useElementHeight(headerRowRef);

  // Selector hooks for virtualizer dimensions
  const titleColumnWidth = useStore(store, eventTimelinePremiumPresetSelectors.titleColumnWidth);
  const columnsTotalWidth = useStore(store, eventTimelinePremiumPresetSelectors.columnsTotalWidth);

  // Virtualizer setup
  const scrollbarVerticalRef = React.useRef<HTMLElement | null>(null);
  const scrollbarHorizontalRef = React.useRef<HTMLElement | null>(null);

  const virtualizerRefs = useLazyRef(() => ({
    container: React.createRef<HTMLDivElement>(),
    scroller: React.createRef<HTMLDivElement>(),
    scrollbarVertical: scrollbarVerticalRef,
    scrollbarHorizontal: scrollbarHorizontalRef,
  })).current;

  const layout = useLazyRef(() => new LayoutDataGrid(virtualizerRefs)).current;

  const rows = React.useMemo(
    () => resources.map(({ resource }) => ({ id: resource.id, model: resource })),
    [resources],
  );

  const range = React.useMemo(
    () => ({ firstRowIndex: 0, lastRowIndex: rows.length }),
    [rows.length],
  );

  const renderRow = React.useCallback(
    ({ id, rowIndex }: { id: any; rowIndex: number }) => (
      <EventTimelinePremiumBodyRow key={id} index={rowIndex}>
        <EventTimelinePremiumTitleCell resourceId={id} />
        <EventTimelinePremiumEventsCell resourceId={id} className={classes.eventsSubGridRow}>
          {({ occurrences, placeholder }) => (
            <EventRowContent resourceId={id} occurrences={occurrences} placeholder={placeholder} />
          )}
        </EventTimelinePremiumEventsCell>
      </EventTimelinePremiumBodyRow>
    ),
    [classes.eventsSubGridRow],
  );

  const virtualizer = useVirtualizer({
    layout,
    dimensions: {
      rowHeight: ROW_HEIGHT,
      topPinnedHeight: headerHeight,
      columnsTotalWidth,
    },
    virtualization: { layoutMode: 'controlled' },
    rows,
    range,
    rowCount: rows.length,
    renderRow,
  });

  const containerProps = virtualizer.store.use(LayoutDataGrid.selectors.containerProps);
  const scrollerProps = virtualizer.store.use(LayoutDataGrid.selectors.scrollerProps);
  const scrollerContentProps = virtualizer.store.use(LayoutDataGrid.selectors.scrollerContentProps);
  const viewportProps = virtualizer.store.use(LayoutDataGrid.selectors.viewportProps);
  const positionerProps = virtualizer.store.use(LayoutDataGrid.selectors.positionerProps);
  const rowWidth = virtualizer.store.use(Dimensions.selectors.dimensions).rowWidth;

  const containerMergedRef = useMergedRefs(
    forwardedRef,
    containerRef,
    containerProps.ref as React.Ref<HTMLDivElement>,
  );
  const gridMergedRef = useMergedRefs(scrollerProps.ref as React.Ref<HTMLDivElement>, gridRef);

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

  return (
    <EventTimelinePremiumContentRoot
      className={classes.content}
      {...props}
      {...containerProps}
      ref={containerMergedRef}
      style={
        {
          '--row-width': `${rowWidth}px`,
          '--title-column-width': `${titleColumnWidth}px`,
          '--unit-width': `${presetConfig.tickWidth}px`,
        } as React.CSSProperties
      }
    >
      <EventDialogProvider>
        <EventTimelinePremiumGrid className={classes.grid} {...scrollerProps} ref={gridMergedRef}>
          <EventTimelinePremiumScrollerContent {...scrollerContentProps}>
            <EventTimelinePremiumViewport {...viewportProps}>
              <EventTimelinePremiumHeaderRow
                ref={headerRowRef}
                className={classes.headerRow}
                aria-rowindex={1}
              >
                <EventTimelinePremiumTitleHeaderCell className={classes.titleHeaderCell}>
                  {resourceColumnLabel ?? localeText.timelineResourceTitleHeader}
                </EventTimelinePremiumTitleHeaderCell>
                <EventTimelinePremiumEventsHeaderCell className={classes.eventsHeaderCell}>
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
              <VirtualizerRenderZone role="rowgroup" {...positionerProps}>
                {virtualizer.api.getters.getRows()}
              </VirtualizerRenderZone>
            </EventTimelinePremiumViewport>
            {showCurrentTimeIndicator && (
              <EventTimelinePremiumCurrentTimeIndicator
                className={classes.currentTimeIndicator}
                aria-hidden
              />
            )}
          </EventTimelinePremiumScrollerContent>
        </EventTimelinePremiumGrid>
        <EventTimelinePremiumEventsScrollbar ref={eventsScrollbarRef} aria-hidden>
          <div
            style={{
              width: 'calc(var(--unit-count) * var(--unit-width))',
              height: 1,
            }}
          />
        </EventTimelinePremiumEventsScrollbar>
      </EventDialogProvider>
    </EventTimelinePremiumContentRoot>
  );
});
