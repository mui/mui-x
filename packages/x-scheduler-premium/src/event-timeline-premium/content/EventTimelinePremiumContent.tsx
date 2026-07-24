'use client';
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { useStore } from '@base-ui/utils/store';
import useLazyRef from '@mui/utils/useLazyRef';
import type { SchedulerResourceId } from '@mui/x-scheduler-internals/models';
import type { ColumnWithWidth, PinnedColumns } from '@mui/x-virtualizer';
import { useVirtualizer, LayoutDataGrid, Dimensions, Virtualization } from '@mui/x-virtualizer';
import { TimelineGrid } from '@mui/x-scheduler-internals-premium/timeline-grid';
import { filterOccurrencesVisibleOnTimelineAxis } from '@mui/x-scheduler-internals-premium/internals';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium-store-context';
import {
  eventTimelinePremiumPresetSelectors,
  timelineOccurrencePlaceholderSelectors,
} from '@mui/x-scheduler-internals-premium/event-timeline-premium-selectors';
import type { useEventOccurrencesWithTimelinePosition } from '@mui/x-scheduler-internals/use-event-occurrences-with-timeline-position';
import { computeOccurrencesMaxIndex } from '@mui/x-scheduler-internals/use-event-occurrences-with-timeline-position';
import {
  schedulerNowSelectors,
  schedulerOccurrenceSelectors,
  schedulerOtherSelectors,
  schedulerResourceSelectors,
} from '@mui/x-scheduler-internals/scheduler-selectors';
import { useAdapterContext } from '@mui/x-scheduler-internals/use-adapter-context';
import {
  EventDialogProvider,
  EventDialogTrigger,
  EventSkeleton,
  useEventDialogContext,
  getCellFocusBackground,
} from '@mui/x-scheduler/internals';
import {
  computeElementPositionInCollection,
  useTimelineDragAutoScroll,
} from '@mui/x-scheduler-internals/internals';
import { PREMIUM_EVENT_DIALOG_OPTIONAL_RENDERERS } from '../../internals/eventDialogOptionalRenderers';
import { EventTimelinePremiumHeader } from './timeline-header';
import type { EventTimelinePremiumContentProps } from './EventTimelinePremiumContent.types';
import EventTimelinePremiumTitleCell from './timeline-title-cell/EventTimelinePremiumTitleCell';
import { EventTimelinePremiumEvent } from './timeline-event';
import { useEventTimelinePremiumStyledContext } from '../EventTimelinePremiumStyledContext';
import {
  EventTimelinePremiumVirtualizerContext,
  useEventTimelinePremiumVirtualizerStore,
} from './EventTimelinePremiumVirtualizerContext';
import {
  TitleColumnWidthProvider,
  useTitleColumnWidth,
  useReportTitleWidth,
  TITLE_HEADER_KEY,
} from './useTitleColumnWidth';
import { useTitleScrollSync } from './useTitleScrollSync';
import { useEventTabNavigation } from './useEventTabNavigation';
import { getRowHeightForLaneCount } from './rowGeometry';
import { getVisibleFractionRange } from './getVisibleFractionRange';
import { EventTimelinePremiumDependencyArrows } from './timeline-dependency-arrows';

const EventTimelinePremiumContentRoot = styled('section', {
  name: 'MuiEventTimeline',
  slot: 'Content',
})(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  flexGrow: 1,
  width: '100%',
  overflow: 'hidden',
  position: 'relative',
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
  // `clip` instead of `hidden` so vertical overflow stays visible; the legacy
  // overflow rule forces `visible` to `auto` when paired with `hidden`, which
  // would clip the pseudo-element below.
  overflowX: 'clip',
  position: 'absolute',
  zIndex: 5,
  backgroundColor: (theme.vars || theme).palette.background.default,
  // Extends the title column's stacking context below the header so the
  // current time indicator circle's body-area overflow stays hidden behind
  // the pinned title column, regardless of horizontal scroll position.
  // The `border-top` doubles as the title column's bottom divider — it sits
  // exactly where HeaderRow's `border-bottom` sits in the events area, since
  // the pseudo's containing block is the cell's padding box (which ends at
  // HeaderRow's content bottom).
  '&::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -4,
    height: 4,
    backgroundColor: (theme.vars || theme).palette.background.default,
    borderTop: `1px solid ${(theme.vars || theme).palette.divider}`,
    pointerEvents: 'none',
  },
}));

const EventTimelinePremiumEventsHeaderCell = styled(TimelineGrid.Cell, {
  name: 'MuiEventTimeline',
  slot: 'EventsHeaderCell',
})({
  flex: 1,
  minWidth: 0,
  position: 'relative',
  overflowX: 'clip',
  zIndex: 4,
});

const EventTimelinePremiumEventsHeaderCellContent = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'EventsHeaderCellContent',
})({
  height: '100%',
  width: 'calc(var(--unit-count) * var(--unit-width))',
  minWidth: '100%',
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
})({
  display: 'flex',
  width: 'var(--row-width)',
  position: 'relative',
  breakInside: 'avoid',
});

const EventTimelinePremiumEventsCell = styled(TimelineGrid.EventRow, {
  name: 'MuiEventTimeline',
  slot: 'EventsCell',
})(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  overflow: 'clip',
  width: 'calc(var(--unit-count) * var(--unit-width))',
  display: 'grid',
  gridTemplateRows: `repeat(var(--lane-count, 1), minmax(calc(${theme.typography.body2.lineHeight}em + ${theme.spacing(1.125)}), auto))`,
  rowGap: theme.spacing(0.5),
  position: 'relative',
  padding: theme.spacing(2, 0),
  alignContent: 'start',
  zIndex: 1,
  borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
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
  // Extend below the row container by the filler height so the line reaches
  // the very bottom of the viewport when the rows don't fill it.
  bottom: 'calc(-1 * var(--filler-height, 0px))',
  left: 'calc(var(--title-column-width) + var(--unit-count) * var(--unit-width) * var(--x-position))',
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
  // `bottom: -4` so the circle sits centered on the header/body boundary line.
  bottom: -4,
  // 3px = half the circle's width (4px) minus half the line's width (1px), to center the circle on the line.
  left: 'calc(var(--title-column-width) + var(--unit-count) * var(--unit-width) * var(--x-position) - 3px)',
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: (theme.vars || theme).palette.primary.main,
  // Below the pinned title header (z-index 5) so the title column header
  // visually covers the circle when it overlaps. Body-area overlap is covered
  // by the title header cell's `::after` pseudo-element.
  zIndex: 4,
}));

// In macOS Safari and Gnome Web, scrollbars are overlaid and report size 0.
// The virtual scrollbar container needs a real size, so we clamp to at least 14px.
const SCROLLBAR_SIZE_CSS = 'calc(max(var(--scrollbar-size, 10px), 14px))';

const Scrollbar = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'Scrollbar',
})({
  position: 'absolute',
  display: 'inline-block',
  zIndex: 6,
  '&:hover': {
    zIndex: 7,
  },
  '--size': SCROLLBAR_SIZE_CSS,
});

const ScrollbarVertical = styled(Scrollbar, {
  name: 'MuiEventTimeline',
  slot: 'ScrollbarVertical',
})({
  width: 'var(--size)',
  height:
    'calc(100% - var(--header-height, 0px) - var(--has-scroll-x, 0) * var(--scrollbar-size, 10px))',
  overflowY: 'auto',
  overflowX: 'hidden',
  outline: 0,
  scrollbarWidth: 'thin',
  '& > div': {
    width: 'var(--size)',
  },
  top: 'var(--header-height, 0px)',
  right: 0,
});

const ScrollbarHorizontal = styled(Scrollbar, {
  name: 'MuiEventTimeline',
  slot: 'ScrollbarHorizontal',
})({
  width: 'calc(100% - var(--title-column-width))',
  height: 'var(--size)',
  overflowY: 'hidden',
  overflowX: 'auto',
  outline: 0,
  scrollbarWidth: 'thin',
  '& > div': {
    height: 'var(--size)',
  },
  bottom: 0,
  left: 'var(--title-column-width)',
});

const ScrollbarTitleHorizontal = styled(Scrollbar, {
  name: 'MuiEventTimeline',
  slot: 'ScrollbarTitleHorizontal',
})({
  width: 'var(--title-column-width)',
  height: 'var(--size)',
  overflowY: 'hidden',
  overflowX: 'auto',
  outline: 0,
  scrollbarWidth: 'thin',
  '& > div': {
    height: 'var(--size)',
  },
  bottom: 0,
  left: 0,
});

// When the title scrollbar is not rendered (no overflow) but the events
// horizontal scrollbar is, this filler sits in the bottom-left strip to
// extend the title column's right border down to the very bottom.
const TitleScrollbarFiller = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'TitleScrollbarFiller',
})(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: 'var(--title-column-width)',
  height: SCROLLBAR_SIZE_CSS,
  borderRight: `1px solid ${(theme.vars || theme).palette.divider}`,
  backgroundColor: (theme.vars || theme).palette.background.default,
  zIndex: 6,
  pointerEvents: 'none',
}));

const RowContainer = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'RowContainer',
})({
  width: 'fit-content',
  display: 'flex',
  flexDirection: 'column',
});

const EventTimelinePremiumFillerRow = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'FillerRow',
})(({ theme }) => ({
  display: 'flex',
  width: 'var(--row-width)',
  position: 'relative',
  '& > div': {
    width: 'var(--title-column-width)',
    borderRight: `1px solid ${(theme.vars || theme).palette.divider}`,
    position: 'absolute',
    height: '100%',
    zIndex: 3,
    backgroundColor: (theme.vars || theme).palette.background.default,
  },
}));

const HeaderRowContent = React.forwardRef<HTMLDivElement, { showCurrentTimeIndicator: boolean }>(
  function HeaderRowContent(props, ref) {
    const { showCurrentTimeIndicator } = props;
    const virtualizerStore = useEventTimelinePremiumVirtualizerStore();
    const { classes, localeText, resourceColumnLabel } = useEventTimelinePremiumStyledContext();
    const reportTitleWidth = useReportTitleWidth();

    const pinnedLeftOffset = virtualizerStore.use(
      Virtualization.selectors.pinnedLeftOffsetSelector,
    );
    const containerVerticalProps = virtualizerStore.use(
      LayoutDataGrid.selectors.containerVerticalProps,
    );
    const renderContext = virtualizerStore.use(Virtualization.selectors.renderContext);

    // Convert virtualizer column indices to tick indices.
    // Column 0 is the pinned title column; tick columns start at index 1.
    const tickRange = React.useMemo(
      () => ({
        firstTickIndex: Math.max(0, renderContext.firstColumnIndex - 1),
        lastTickIndex: Math.max(0, renderContext.lastColumnIndex - 1),
      }),
      [renderContext.firstColumnIndex, renderContext.lastColumnIndex],
    );

    // Measure the header title cell's natural width so the title column
    // also accounts for the header label, not just the body rows.
    const titleHeaderCellRef = React.useRef<HTMLDivElement | null>(null);
    const titleHeaderContentRef = React.useRef<HTMLSpanElement | null>(null);
    useIsoLayoutEffect(() => {
      const cell = titleHeaderCellRef.current;
      const content = titleHeaderContentRef.current;
      if (!cell || !content || typeof ResizeObserver === 'undefined') {
        return undefined;
      }
      const observer = new ResizeObserver(() => {
        reportTitleWidth(TITLE_HEADER_KEY, cell.scrollWidth);
      });
      observer.observe(content);
      return () => observer.disconnect();
    }, [reportTitleWidth]);

    return (
      <EventTimelinePremiumHeaderRow
        ref={ref}
        className={classes.headerRow}
        aria-rowindex={1}
        {...containerVerticalProps}
      >
        <EventTimelinePremiumTitleHeaderCell
          ref={titleHeaderCellRef}
          className={classes.titleHeaderCell}
          style={{ transform: `translateX(${pinnedLeftOffset}px)` }}
        >
          <span
            ref={titleHeaderContentRef}
            style={{ width: 'max-content', whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            {resourceColumnLabel ?? localeText.timelineResourceTitleHeader}
          </span>
        </EventTimelinePremiumTitleHeaderCell>
        <div role="none" style={{ width: 'var(--title-column-width)' }} />
        <EventTimelinePremiumEventsHeaderCell className={classes.eventsHeaderCell}>
          <EventTimelinePremiumEventsHeaderCellContent className={classes.eventsHeaderCellContent}>
            <EventTimelinePremiumHeader tickRange={tickRange} />
          </EventTimelinePremiumEventsHeaderCellContent>
        </EventTimelinePremiumEventsHeaderCell>
        {showCurrentTimeIndicator && (
          <EventTimelinePremiumCurrentTimeIndicatorCircle
            className={classes.currentTimeIndicatorCircle}
            aria-hidden
          />
        )}
      </EventTimelinePremiumHeaderRow>
    );
  },
);

function FillerRow() {
  const virtualizerStore = useEventTimelinePremiumVirtualizerStore();
  const pinnedLeftOffset = virtualizerStore.use(Virtualization.selectors.pinnedLeftOffsetSelector);
  const containerVerticalProps = virtualizerStore.use(
    LayoutDataGrid.selectors.containerVerticalProps,
  );
  const dimensions = virtualizerStore.use(Dimensions.selectors.dimensions);

  const fillerHeight = dimensions.viewportOuterSize.height - dimensions.minimumSize.height;
  if (fillerHeight <= 0) {
    return null;
  }

  return (
    <EventTimelinePremiumFillerRow
      role="none"
      {...containerVerticalProps}
      style={{ height: fillerHeight, ...containerVerticalProps?.style }}
    >
      <div style={{ transform: `translateX(${pinnedLeftOffset}px)` }} />
    </EventTimelinePremiumFillerRow>
  );
}

/**
 * Renders only the events that intersect the virtualizer's visible column range.
 * Isolated into its own component so that scrolling (which updates `renderContext`)
 * only re-renders this subtree, not the surrounding row logic.
 */
function EventList({
  occurrences,
}: {
  occurrences: useEventOccurrencesWithTimelinePosition.EventOccurrenceWithPosition[];
}) {
  const adapter = useAdapterContext();
  const store = useEventTimelinePremiumStoreContext();
  const virtualizerStore = useEventTimelinePremiumVirtualizerStore();
  const { schedulerId } = useEventTimelinePremiumStyledContext();

  const presetConfig = useStore(store, eventTimelinePremiumPresetSelectors.config);
  const renderContext = virtualizerStore.use(Virtualization.selectors.renderContext);

  // Precompute position fractions for all occurrences (recomputed only when occurrences or preset changes)
  const occurrencesWithFraction = React.useMemo(
    () =>
      occurrences.map((occurrence) => {
        const { position, duration } = computeElementPositionInCollection(adapter, {
          start: occurrence.displayTimezone.start,
          end: occurrence.displayTimezone.end,
          collectionStart: presetConfig.start,
          collectionEnd: presetConfig.end,
          dayStartMinute: presetConfig.dayStartMinute,
          dayEndMinute: presetConfig.dayEndMinute,
        });

        return {
          occurrence,
          fractionStart: position,
          fractionEnd: position + duration,
        };
      }),
    [
      adapter,
      occurrences,
      presetConfig.start,
      presetConfig.end,
      presetConfig.dayStartMinute,
      presetConfig.dayEndMinute,
    ],
  );

  // Convert virtualizer column range to fraction range
  const { start: visibleStart, end: visibleEnd } = getVisibleFractionRange(
    renderContext,
    presetConfig.tickCount,
  );

  return (
    <React.Fragment>
      {occurrencesWithFraction.map(
        ({ occurrence, fractionStart, fractionEnd }) =>
          fractionEnd > visibleStart &&
          fractionStart < visibleEnd && (
            <EventDialogTrigger key={occurrence.key} occurrence={occurrence}>
              <EventTimelinePremiumEvent
                occurrence={occurrence}
                ariaLabelledBy={`${schedulerId}-EventTimelinePremiumTitleCell-${occurrence.resource}`}
                variant="regular"
              />
            </EventDialogTrigger>
          ),
      )}
    </React.Fragment>
  );
}

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
  const isLoading = useStore(store, schedulerOtherSelectors.isLoading);

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

  if (isLoading) {
    return <EventSkeleton data-variant="timeline-row" />;
  }

  return (
    <React.Fragment>
      <EventList occurrences={occurrences} />
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
 * Measures one dimension (`'width'` or `'height'`) of an element via
 * ResizeObserver and returns it as state.
 */
function useElementSize(
  ref: React.RefObject<HTMLElement | null>,
  dimension: 'width' | 'height',
): number {
  const [size, setSize] = React.useState(0);

  useIsoLayoutEffect(() => {
    const element = ref.current;
    if (!element) {
      return undefined;
    }

    const measure = (el: HTMLElement) => (dimension === 'width' ? el.offsetWidth : el.offsetHeight);

    if (typeof ResizeObserver === 'undefined') {
      setSize(measure(element));
      return undefined;
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const box = entry.borderBoxSize[0];
        setSize(dimension === 'width' ? box.inlineSize : box.blockSize);
      }
    });

    setSize(measure(element));
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, dimension]);

  return size;
}

export const EventTimelinePremiumContent = React.forwardRef(function EventTimelinePremiumContent(
  props: EventTimelinePremiumContentProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  // Context hooks
  const store = useEventTimelinePremiumStoreContext();
  const { classes } = useEventTimelinePremiumStyledContext();

  // Ref hooks
  const containerRef = React.useRef<HTMLElement | null>(null);
  const gridRef = React.useRef<HTMLDivElement | null>(null);
  const headerRowRef = React.useRef<HTMLDivElement | null>(null);

  // Selector hooks
  const adapter = useAdapterContext();
  const now = useStore(store, schedulerNowSelectors.nowUpdatedEveryMinute);
  const showCurrentTimeIndicatorSetting = useStore(
    store,
    schedulerNowSelectors.showCurrentTimeIndicator,
  );
  const presetConfig = useStore(store, eventTimelinePremiumPresetSelectors.config);
  const hasNestedResources = useStore(store, schedulerResourceSelectors.hasNestedResources);
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
  const headerHeight = useElementSize(headerRowRef, 'height');

  // Measure the container so the title column can be capped at half its width.
  const containerWidth = useElementSize(containerRef, 'width');

  // Virtualizer setup
  const scrollbarTitleRef = React.useRef<HTMLDivElement | null>(null);
  const scrollbarVerticalRef = React.useRef<HTMLDivElement | null>(null);
  const scrollbarHorizontalRef = React.useRef<HTMLDivElement | null>(null);

  const virtualizerRefs = useLazyRef(() => ({
    container: containerRef,
    scroller: gridRef,
    scrollbarVertical: scrollbarVerticalRef,
    scrollbarHorizontal: scrollbarHorizontalRef,
  })).current;

  const layout = useLazyRef(() => new LayoutDataGrid(virtualizerRefs)).current;

  const rows = React.useMemo(
    () => resources.map(({ resource }) => ({ id: resource.id, model: resource })),
    [resources],
  );

  const {
    width: titleColumnWidth,
    contentWidth: titleContentWidth,
    hasOverflow: hasTitleOverflow,
    report: reportTitleWidth,
  } = useTitleColumnWidth({
    minWidth: 50,
    maxWidth: containerWidth > 0 ? containerWidth / 4 : undefined,
    rows,
  });

  const range = React.useMemo(
    () => ({ firstRowIndex: 0, lastRowIndex: rows.length }),
    [rows.length],
  );

  const renderRow = React.useCallback(
    ({ id, rowIndex }: { id: any; rowIndex: number }) => (
      <EventTimelinePremiumBodyRow key={id} index={rowIndex}>
        <EventTimelinePremiumTitleCell resourceId={id} />
        <div role="none" style={{ width: titleColumnWidth }} />
        <EventTimelinePremiumEventsCell resourceId={id} className={classes.eventsCell}>
          {({ occurrences, placeholder }) => (
            <EventRowContent resourceId={id} occurrences={occurrences} placeholder={placeholder} />
          )}
        </EventTimelinePremiumEventsCell>
      </EventTimelinePremiumBodyRow>
    ),
    [classes.eventsCell, titleColumnWidth],
  );

  // Build virtualizer column model: one pinned title column + one column per tick.
  const { tickCount, tickWidth } = presetConfig;
  const columnsTotalWidth = titleColumnWidth + tickCount * tickWidth;

  // Row heights mirror the CSS. The cell stretches to fit overlapping events
  // (`--lane-count` lanes), so we need the per-resource lane count.
  const theme = useTheme();
  // Occurrences hidden by the preset's hour window are excluded from the lane count so
  // the virtualized row heights match the rendered lanes.
  const laneCountByResource = React.useMemo(() => {
    const map = new Map<SchedulerResourceId, number>();
    for (const { resource, occurrences } of resources) {
      const visibleOccurrences = filterOccurrencesVisibleOnTimelineAxis(
        adapter,
        presetConfig,
        occurrences,
      );
      map.set(resource.id, computeOccurrencesMaxIndex(adapter, visibleOccurrences));
    }
    return map;
  }, [resources, adapter, presetConfig]);

  const getRowHeight = React.useCallback(
    (row: { id: SchedulerResourceId }) =>
      getRowHeightForLaneCount(theme, laneCountByResource.get(row.id) ?? 1),
    [theme, laneCountByResource],
  );
  const defaultRowHeight = React.useMemo(() => getRowHeightForLaneCount(theme, 1), [theme]);

  const titleColumn = React.useMemo<ColumnWithWidth>(
    () => ({ key: 'title', computedWidth: titleColumnWidth }),
    [titleColumnWidth],
  );

  const columns = React.useMemo<ColumnWithWidth[]>(() => {
    const cols: ColumnWithWidth[] = [titleColumn];
    for (let i = 0; i < tickCount; i += 1) {
      cols.push({ key: i, computedWidth: tickWidth });
    }
    return cols;
  }, [titleColumn, tickCount, tickWidth]);

  const pinnedColumns = React.useMemo<PinnedColumns>(
    () => ({ left: [titleColumn], right: [] }),
    [titleColumn],
  );

  const virtualizer = useVirtualizer({
    layout,
    dimensions: {
      rowHeight: defaultRowHeight,
      topPinnedHeight: headerHeight,
      columnsTotalWidth,
      leftPinnedWidth: titleColumnWidth,
    },
    virtualization: { layoutMode: 'controlled' },
    rows,
    range,
    rowCount: rows.length,
    columns,
    pinnedColumns,
    renderRow,
    getRowHeight,
  });

  const containerProps = virtualizer.store.use(LayoutDataGrid.selectors.containerProps);
  const scrollerProps = virtualizer.store.use(LayoutDataGrid.selectors.scrollerProps);
  const scrollerContentProps = virtualizer.store.use(LayoutDataGrid.selectors.scrollerContentProps);
  const viewportProps = virtualizer.store.use(LayoutDataGrid.selectors.viewportProps);
  const positionerProps = virtualizer.store.use(LayoutDataGrid.selectors.positionerProps);
  const scrollbarVerticalProps = virtualizer.store.use(
    LayoutDataGrid.selectors.scrollbarVerticalProps,
  );
  const scrollbarHorizontalProps = virtualizer.store.use(
    LayoutDataGrid.selectors.scrollbarHorizontalProps,
  );
  const dimensions = virtualizer.store.use(Dimensions.selectors.dimensions);

  const containerMergedRef = useMergedRefs(
    forwardedRef,
    containerProps.ref as React.Ref<HTMLDivElement>,
  );
  const gridMergedRef = useMergedRefs(scrollerProps.ref as React.Ref<HTMLDivElement>, gridRef);

  // Reset horizontal scroll when navigating to a new time period.
  useIsoLayoutEffect(() => {
    const grid = gridRef.current;
    if (grid) {
      grid.scrollLeft = 0;
    }
    if (scrollbarHorizontalRef.current) {
      scrollbarHorizontalRef.current.scrollLeft = 0;
    }
  }, [presetConfig.start]);

  useTitleScrollSync({
    enabled: hasTitleOverflow,
    containerRef,
    gridRef,
    scrollbarRef: scrollbarTitleRef,
    titleCellClassName: classes.titleCell,
  });

  useTimelineDragAutoScroll({
    scrollerRef: gridRef,
    pinnedLeftWidth: titleColumnWidth,
  });

  const { handleKeyDown: handleEventTabKeyDown } = useEventTabNavigation({
    adapter,
    resources,
    scrollerRef: gridRef,
    collectionStart: presetConfig.start,
    collectionEnd: presetConfig.end,
    tickCount: presetConfig.tickCount,
    tickWidth: presetConfig.tickWidth,
    titleColumnWidth,
  });

  const eventsWidth = presetConfig.tickCount * presetConfig.tickWidth;
  const hasScrollX = dimensions.hasScrollX;
  const hasScrollY = dimensions.hasScrollY;
  const hasBottomScrollbar = hasScrollX || hasTitleOverflow;
  const fillerHeight = Math.max(
    0,
    dimensions.viewportOuterSize.height - dimensions.minimumSize.height,
  );

  return (
    <EventTimelinePremiumContentRoot
      className={classes.content}
      data-flat={!hasNestedResources || undefined}
      {...props}
      {...containerProps}
      ref={containerMergedRef}
      style={
        {
          '--row-width': `${dimensions.rowWidth}px`,
          '--title-column-width': `${titleColumnWidth}px`,
          '--unit-width': `${presetConfig.tickWidth}px`,
          '--scrollbar-size': `${dimensions.scrollbarSize}px`,
          '--header-height': `${headerHeight}px`,
          '--filler-height': `${fillerHeight}px`,
          '--has-scroll-x': Number(hasBottomScrollbar),
        } as React.CSSProperties
      }
    >
      <EventTimelinePremiumVirtualizerContext.Provider value={virtualizer.store}>
        <TitleColumnWidthProvider value={reportTitleWidth}>
          <EventDialogProvider optionalRenderers={PREMIUM_EVENT_DIALOG_OPTIONAL_RENDERERS}>
            <EventTimelinePremiumGrid
              className={classes.grid}
              {...scrollerProps}
              ref={gridMergedRef}
              onKeyDown={handleEventTabKeyDown}
            >
              <EventTimelinePremiumScrollerContent {...scrollerContentProps}>
                <EventTimelinePremiumViewport {...viewportProps}>
                  <HeaderRowContent
                    ref={headerRowRef}
                    showCurrentTimeIndicator={showCurrentTimeIndicator}
                  />
                  <RowContainer role="rowgroup" {...positionerProps}>
                    {virtualizer.api.getters.getRows()}
                    {showCurrentTimeIndicator && (
                      <EventTimelinePremiumCurrentTimeIndicator
                        className={classes.currentTimeIndicator}
                        aria-hidden
                      />
                    )}
                    <EventTimelinePremiumDependencyArrows />
                  </RowContainer>
                  <FillerRow />
                </EventTimelinePremiumViewport>
              </EventTimelinePremiumScrollerContent>
            </EventTimelinePremiumGrid>
            {hasScrollY && (
              <ScrollbarVertical
                ref={scrollbarVerticalProps.ref}
                tabIndex={-1}
                aria-hidden="true"
                onFocus={(event: React.FocusEvent<HTMLDivElement>) => event.target.blur()}
              >
                <div style={{ height: dimensions.minimumSize.height - headerHeight }} />
              </ScrollbarVertical>
            )}
            {hasScrollX && (
              <ScrollbarHorizontal
                ref={scrollbarHorizontalProps.ref}
                tabIndex={-1}
                aria-hidden="true"
                onFocus={(event: React.FocusEvent<HTMLDivElement>) => event.target.blur()}
              >
                <div style={{ width: eventsWidth }} />
              </ScrollbarHorizontal>
            )}
            {hasTitleOverflow && (
              <ScrollbarTitleHorizontal
                ref={scrollbarTitleRef}
                tabIndex={-1}
                aria-hidden="true"
                onFocus={(event: React.FocusEvent<HTMLDivElement>) => event.target.blur()}
              >
                <div style={{ width: titleContentWidth }} />
              </ScrollbarTitleHorizontal>
            )}
            {!hasTitleOverflow && hasScrollX && <TitleScrollbarFiller aria-hidden="true" />}
          </EventDialogProvider>
        </TitleColumnWidthProvider>
      </EventTimelinePremiumVirtualizerContext.Provider>
    </EventTimelinePremiumContentRoot>
  );
});
