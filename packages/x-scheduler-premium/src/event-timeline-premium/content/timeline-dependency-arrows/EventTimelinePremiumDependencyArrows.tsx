'use client';
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import { Dimensions, Virtualization } from '@mui/x-virtualizer';
import { useAdapterContext } from '@mui/x-scheduler-internals/use-adapter-context';
import { schedulerOccurrenceSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium-store-context';
import {
  eventTimelinePremiumDependencySelectors,
  eventTimelinePremiumPresetSelectors,
} from '@mui/x-scheduler-internals-premium/event-timeline-premium-selectors';
import type { SchedulerDependency } from '@mui/x-scheduler-internals-premium/models';
import { useEventTimelinePremiumStyledContext } from '../../EventTimelinePremiumStyledContext';
import { useEventTimelinePremiumVirtualizerStore } from '../EventTimelinePremiumVirtualizerContext';
import { getEventsCellLaneMetrics } from '../rowGeometry';
import { computeDependencyArrows, DEPENDENCY_ARROWHEAD_SIZE } from './dependencyArrowGeometry';

const DEPENDENCY_ARROW_STROKE_WIDTH = 1;

// TODO(dependencies public flip): add a `dependencyArrows` utility class and assert the
// slot in the theme augmentation. The overlay only carries data attributes while the
// feature has no public API.
const DependencyArrowsSvg = styled('svg', {
  name: 'MuiEventTimeline',
  slot: 'DependencyArrows',
})(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 'var(--title-column-width)',
  pointerEvents: 'none',
  // Same layer as the current time indicator: above the events cells, below the pinned
  // title column, which covers the arrows on horizontal scroll.
  zIndex: 2,
  color: (theme.vars || theme).palette.grey[400],
  ...theme.applyStyles('dark', {
    color: (theme.vars || theme).palette.grey[600],
  }),
}));

/**
 * Renders the arrows of the active dependencies over the timeline rows.
 * Rendering-only: it subscribes to the dependencies state slice and never mutates it.
 */
export function EventTimelinePremiumDependencyArrows() {
  const store = useEventTimelinePremiumStoreContext();
  const dependencies = useStore(store, eventTimelinePremiumDependencySelectors.activeModelList);

  if (dependencies.length === 0) {
    return null;
  }

  return <DependencyArrowsLayer dependencies={dependencies} />;
}

/**
 * Isolated like `EventList` so that scrolling (which updates `renderContext`) only
 * re-renders this subtree. Arrow paths are computed from the data model — never from
 * the DOM — so they can anchor on events the virtualizer did not mount, and they only
 * change when an event or dependency changes, not on scroll.
 */
function DependencyArrowsLayer({ dependencies }: { dependencies: readonly SchedulerDependency[] }) {
  const adapter = useAdapterContext();
  const theme = useTheme();
  const store = useEventTimelinePremiumStoreContext();
  const virtualizerStore = useEventTimelinePremiumVirtualizerStore();
  const { schedulerId } = useEventTimelinePremiumStyledContext();

  const presetConfig = useStore(store, eventTimelinePremiumPresetSelectors.config);
  const resources = useStore(
    store,
    schedulerOccurrenceSelectors.groupedByResourceList,
    presetConfig.start,
    presetConfig.end,
  );
  const rowsMeta = virtualizerStore.use(Dimensions.selectors.rowsMeta);
  const renderContext = virtualizerStore.use(Virtualization.selectors.renderContext);

  const eventsWidth = presetConfig.tickCount * presetConfig.tickWidth;

  const arrows = React.useMemo(
    () =>
      computeDependencyArrows({
        adapter,
        dependencies,
        resources,
        rowPositions: rowsMeta.positions,
        collectionStart: presetConfig.start,
        collectionEnd: presetConfig.end,
        eventsWidth,
        laneMetrics: getEventsCellLaneMetrics(theme),
      }),
    [
      adapter,
      dependencies,
      resources,
      rowsMeta.positions,
      presetConfig.start,
      presetConfig.end,
      eventsWidth,
      theme,
    ],
  );

  // Only render the arrows intersecting the visible range. Row-range overlap (rather
  // than endpoint visibility) keeps an arrow whose vertical segment crosses the
  // viewport even when both of its endpoints are scrolled out.
  const visibleStartFraction =
    Math.max(0, renderContext.firstColumnIndex - 1) / presetConfig.tickCount;
  const visibleEndFraction =
    Math.max(0, renderContext.lastColumnIndex - 1) / presetConfig.tickCount;
  const visibleArrows = arrows.filter(
    (arrow) =>
      arrow.maxXFraction > visibleStartFraction &&
      arrow.minXFraction < visibleEndFraction &&
      arrow.maxRowIndex >= renderContext.firstRowIndex &&
      arrow.minRowIndex <= renderContext.lastRowIndex,
  );

  // The overlay's y = 0 is the top of the first rendered row (the positioner offsets
  // the row container), while the paths are in absolute row-space. The viewBox maps
  // one to the other and clips the arrows reaching off-screen anchors.
  const offsetTop = rowsMeta.positions[renderContext.firstRowIndex] ?? 0;
  const height = rowsMeta.currentPageTotalHeight - offsetTop;

  if (visibleArrows.length === 0 || eventsWidth <= 0 || height <= 0) {
    return null;
  }

  const arrowheadId = `${schedulerId}-dependency-arrowhead`;

  return (
    <DependencyArrowsSvg
      aria-hidden
      data-dependency-arrows=""
      width={eventsWidth}
      height={height}
      viewBox={`0 ${offsetTop} ${eventsWidth} ${height}`}
    >
      <defs>
        <marker
          id={arrowheadId}
          viewBox={`0 0 ${DEPENDENCY_ARROWHEAD_SIZE} ${DEPENDENCY_ARROWHEAD_SIZE}`}
          markerWidth={DEPENDENCY_ARROWHEAD_SIZE}
          markerHeight={DEPENDENCY_ARROWHEAD_SIZE}
          markerUnits="userSpaceOnUse"
          refX={DEPENDENCY_ARROWHEAD_SIZE}
          refY={DEPENDENCY_ARROWHEAD_SIZE / 2}
          orient="auto"
        >
          <path
            d={`M 0 0 L ${DEPENDENCY_ARROWHEAD_SIZE} ${DEPENDENCY_ARROWHEAD_SIZE / 2} L 0 ${DEPENDENCY_ARROWHEAD_SIZE} Z`}
            fill="currentColor"
            stroke="none"
          />
        </marker>
      </defs>
      {visibleArrows.map((arrow) => (
        <path
          key={String(arrow.id)}
          data-dependency-id={String(arrow.id)}
          d={arrow.d}
          fill="none"
          stroke="currentColor"
          strokeWidth={DEPENDENCY_ARROW_STROKE_WIDTH}
          markerEnd={`url(#${arrowheadId})`}
        />
      ))}
    </DependencyArrowsSvg>
  );
}
