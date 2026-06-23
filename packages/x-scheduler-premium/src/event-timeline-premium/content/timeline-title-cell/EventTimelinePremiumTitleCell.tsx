'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
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
        <ResourceLegendColor className={classes.titleCellLegendColor} />
        {resource!.title}
      </EventTimelinePremiumTitleCellContent>
    </EventTimelinePremiumTitleCellRoot>
  );
}
