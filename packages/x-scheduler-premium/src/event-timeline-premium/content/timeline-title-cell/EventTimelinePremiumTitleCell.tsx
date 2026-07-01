'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded';
import { useStore } from '@base-ui/utils/store';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { TimelineGrid } from '@mui/x-scheduler-internals-premium/timeline-grid';
import type { SchedulerResourceId } from '@mui/x-scheduler-internals/models';
import { schedulerResourceSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium-store-context';
import { getPaletteVariants } from '@mui/x-scheduler/internals';
import { Virtualization } from '@mui/x-virtualizer';
import { useEventTimelinePremiumStyledContext } from '../../EventTimelinePremiumStyledContext';
import { useEventTimelinePremiumVirtualizerStore } from '../EventTimelinePremiumVirtualizerContext';
import { useReportTitleWidth } from '../useTitleColumnWidth';

// Shared footprint for the collapse toggle and the leaf-row spacer. Also drives
// the per-depth indent so a child's toggle lines up under its parent's dot.
const TOGGLE_SIZE = 20;

// Diameter of the resource legend dot.
const DOT_SIZE = 10;

const EventTimelinePremiumTitleCellRoot = styled(TimelineGrid.TitleRow, {
  name: 'MuiEventTimeline',
  slot: 'TitleCell',
})(({ theme }) => ({
  flex: '0 0 auto',
  width: 'var(--title-column-width)',
  borderRight: `1px solid ${(theme.vars || theme).palette.divider}`,
  borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
  overflow: 'hidden',
  padding: theme.spacing(2),
  // Indent each level so a child's toggle center lines up under its parent's
  // legend dot center: half the toggle + the gap + half the dot.
  paddingLeft: `calc(${theme.spacing(2)} + var(--resource-depth) * ((${TOGGLE_SIZE}px + ${DOT_SIZE}px) / 2 + ${theme.spacing(1)}))`,
  alignContent: 'start',
  fontSize: theme.typography.body2.fontSize,
  display: 'flex',
  alignItems: 'start',
  gap: theme.spacing(1),
  position: 'absolute',
  height: '100%',
  zIndex: 3,
  backgroundColor: (theme.vars || theme).palette.background.default,
  // Let JS handle horizontal panning (redirected to the title scrollbar)
  // while the browser still handles vertical row scrolling.
  touchAction: 'pan-y',
  variants: getPaletteVariants(theme),
  '&[data-collapsible]': {
    cursor: 'pointer',
  },
  '&:focus-visible': {
    outline: 'none',
    boxShadow: `inset 0 0 0 2px ${(theme.vars || theme).palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
  },
}));

const EventTimelinePremiumTitleCellContent = styled('span', {
  name: 'MuiEventTimeline',
  slot: 'TitleCellContent',
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(1),
  // Render at the natural content width so the parent ResizeObserver can
  // measure the widest title; the cell root clips overflow until the
  // column expands.
  width: 'max-content',
  flexShrink: 0,
  whiteSpace: 'nowrap',
  // Shared horizontal scroll for all title cells (the header title cell is not
  // wrapped in this element and therefore does not move). Uses `left` rather than
  // `transform` so the text isn't promoted to its own compositing layer — that
  // caused a sub-pixel vertical shift of the label on Windows when rows relaid
  // out on collapse/expand.
  position: 'relative',
  left: 'calc(-1 * var(--title-scroll-left, 0) * 1px)',
}));

const ResourceLegendColor = styled('span', {
  name: 'MuiEventTimeline',
  slot: 'TitleCellLegendColor',
})({
  width: DOT_SIZE,
  height: DOT_SIZE,
  borderRadius: '50%',
  flexShrink: 0,
  backgroundColor: 'var(--event-surface-accent)',
});

// Decorative chevron; the whole cell is the interactive control.
const ResourceCollapseChevron = styled('span', {
  name: 'MuiEventTimeline',
  slot: 'TitleCellCollapseChevron',
})(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: TOGGLE_SIZE,
  height: TOGGLE_SIZE,
  flexShrink: 0,
  color: (theme.vars || theme).palette.action.active,
  '& > svg': {
    fontSize: 18,
  },
}));

// Reserves the toggle's footprint on leaf resources so the legend colors and
// titles stay aligned with collapsible siblings. Removed on a flat timeline
// (no nested resources), where the content root sets `data-flat`.
const ResourceCollapseSpacer = styled('span', {
  name: 'MuiEventTimeline',
  slot: 'TitleCellCollapseSpacer',
})({
  width: TOGGLE_SIZE,
  height: TOGGLE_SIZE,
  flexShrink: 0,
  '[data-flat] &': {
    display: 'none',
  },
});

export default function EventTimelinePremiumTitleCell(props: { resourceId: SchedulerResourceId }) {
  const { resourceId } = props;

  // Context hooks
  const store = useEventTimelinePremiumStoreContext();
  const virtualizerStore = useEventTimelinePremiumVirtualizerStore();
  const { schedulerId, classes } = useEventTimelinePremiumStyledContext();
  const reportTitleWidth = useReportTitleWidth();

  // Selector hooks
  const eventColor = useStore(store, schedulerResourceSelectors.defaultEventColor, resourceId);
  const resource = useStore(store, schedulerResourceSelectors.processedResource, resourceId);
  const depth = useStore(store, schedulerResourceSelectors.resourceDepth, resourceId);
  const hasVisibleChildren = useStore(
    store,
    schedulerResourceSelectors.resourceHasVisibleChildren,
    resourceId,
  );
  const isCollapsed = useStore(store, schedulerResourceSelectors.isResourceCollapsed, resourceId);
  const pinnedLeftOffset = virtualizerStore.use(Virtualization.selectors.pinnedLeftOffsetSelector);

  // Ref hooks
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const contentRef = React.useRef<HTMLSpanElement | null>(null);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    const content = contentRef.current;
    if (!root || !content || typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    // Report the root's scrollWidth: it reflects the natural width of the
    // inner content (rendered with `width: max-content`) plus the cell's
    // depth-dependent horizontal padding, even when overflow is clipped.
    const observer = new ResizeObserver(() => {
      reportTitleWidth(resourceId, root.scrollWidth);
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, [resourceId, reportTitleWidth]);

  const handleToggleCollapse = useStableCallback((event: React.SyntheticEvent) => {
    store.toggleResourceCollapse(resourceId, event.nativeEvent);
  });

  const handleKeyDown = useStableCallback((event: React.KeyboardEvent) => {
    if (hasVisibleChildren && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      store.toggleResourceCollapse(resourceId, event.nativeEvent);
    }
  });

  return (
    <EventTimelinePremiumTitleCellRoot
      ref={rootRef}
      id={`${schedulerId}-EventTimelinePremiumTitleCell-${resourceId}`}
      className={classes.titleCell}
      style={
        {
          '--resource-depth': depth,
          transform: `translateX(${pinnedLeftOffset}px)`,
        } as React.CSSProperties
      }
      data-palette={eventColor}
      // The whole cell toggles a collapsible resource, via click or Enter/Space.
      data-collapsible={hasVisibleChildren || undefined}
      aria-expanded={hasVisibleChildren ? !isCollapsed : undefined}
      onClick={hasVisibleChildren ? handleToggleCollapse : undefined}
      onKeyDown={handleKeyDown}
    >
      <EventTimelinePremiumTitleCellContent ref={contentRef} className={classes.titleCellContent}>
        {hasVisibleChildren ? (
          <ResourceCollapseChevron aria-hidden>
            {isCollapsed ? <ChevronRightRounded /> : <ExpandMoreRounded />}
          </ResourceCollapseChevron>
        ) : (
          <ResourceCollapseSpacer aria-hidden />
        )}
        <ResourceLegendColor className={classes.titleCellLegendColor} />
        {resource!.title}
      </EventTimelinePremiumTitleCellContent>
    </EventTimelinePremiumTitleCellRoot>
  );
}
