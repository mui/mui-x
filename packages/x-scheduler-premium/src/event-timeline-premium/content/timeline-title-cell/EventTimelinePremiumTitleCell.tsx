'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded';
import { useStore } from '@base-ui/utils/store';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { TimelineGrid } from '@mui/x-scheduler-internals-premium/timeline-grid';
import { SchedulerResourceId } from '@mui/x-scheduler-internals/models';
import { schedulerResourceSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium-store-context';
import { getPaletteVariants } from '@mui/x-scheduler/internals';
import { Virtualization } from '@mui/x-virtualizer';
import { useEventTimelinePremiumStyledContext } from '../../EventTimelinePremiumStyledContext';
import { useEventTimelinePremiumVirtualizerStore } from '../EventTimelinePremiumVirtualizerContext';
import { useReportTitleWidth } from '../useTitleColumnWidth';

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
  paddingLeft: `calc(${theme.spacing(2)} + var(--resource-depth) * ${theme.spacing(2)})`,
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
  // Shared horizontal scroll for all title cells (the header title cell
  // is not wrapped in this element and therefore does not move).
  transform: 'translateX(calc(-1 * var(--title-scroll-left, 0) * 1px))',
}));

const ResourceLegendColor = styled('span', {
  name: 'MuiEventTimeline',
  slot: 'TitleCellLegendColor',
})({
  width: 10,
  height: 10,
  borderRadius: '50%',
  flexShrink: 0,
  backgroundColor: 'var(--event-surface-accent)',
});

const ResourceCollapseToggle = styled(IconButton, {
  name: 'MuiEventTimeline',
  slot: 'TitleCellCollapseToggle',
})({
  width: 20,
  height: 20,
  '& > svg': {
    fontSize: 18,
  },
});

// Reserves the toggle's footprint on leaf resources so the legend colors and
// titles stay aligned in a single column regardless of whether a row can collapse.
const ResourceCollapseSpacer = styled('span', {
  name: 'MuiEventTimeline',
  slot: 'TitleCellCollapseSpacer',
})({
  width: 20,
  height: 20,
  flexShrink: 0,
});

export default function EventTimelinePremiumTitleCell(props: { resourceId: SchedulerResourceId }) {
  const { resourceId } = props;

  // Context hooks
  const store = useEventTimelinePremiumStoreContext();
  const virtualizerStore = useEventTimelinePremiumVirtualizerStore();
  const { schedulerId, classes, localeText } = useEventTimelinePremiumStyledContext();
  const reportTitleWidth = useReportTitleWidth();

  // Selector hooks
  const eventColor = useStore(store, schedulerResourceSelectors.defaultEventColor, resourceId);
  const resource = useStore(store, schedulerResourceSelectors.processedResource, resourceId);
  const depth = useStore(store, schedulerResourceSelectors.resourceDepth, resourceId);
  const hasChildren = useStore(store, schedulerResourceSelectors.resourceHasChildren, resourceId);
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
    >
      <EventTimelinePremiumTitleCellContent ref={contentRef} className={classes.titleCellContent}>
        {hasChildren ? (
          <ResourceCollapseToggle
            size="small"
            aria-expanded={!isCollapsed}
            aria-label={
              isCollapsed
                ? localeText.timelineExpandResource(resource!.title)
                : localeText.timelineCollapseResource(resource!.title)
            }
            onClick={(event) => store.toggleResourceCollapse(resourceId, event.nativeEvent)}
          >
            {isCollapsed ? <ChevronRightRounded /> : <ExpandMoreRounded />}
          </ResourceCollapseToggle>
        ) : (
          <ResourceCollapseSpacer aria-hidden />
        )}
        <ResourceLegendColor className={classes.titleCellLegendColor} />
        {resource!.title}
      </EventTimelinePremiumTitleCellContent>
    </EventTimelinePremiumTitleCellRoot>
  );
}
