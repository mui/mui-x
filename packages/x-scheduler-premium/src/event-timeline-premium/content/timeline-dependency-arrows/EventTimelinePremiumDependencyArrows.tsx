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
import type {
  SchedulerDependency,
  SchedulerDependencyCreation,
  SchedulerDependencyId,
} from '@mui/x-scheduler-internals-premium/models';
import { useEventTimelinePremiumStyledContext } from '../../EventTimelinePremiumStyledContext';
import { useEventTimelinePremiumVirtualizerStore } from '../EventTimelinePremiumVirtualizerContext';
import { getEventsCellLaneMetrics } from '../rowGeometry';
import { getVisibleFractionRange } from '../getVisibleFractionRange';
import {
  computeDependencyArrows,
  createDependencyAnchorResolver,
  getEventEdgeAnchor,
  DEPENDENCY_ARROWHEAD_SIZE,
} from './dependencyArrowGeometry';
import { useDependencySelectionInteraction } from './useDependencySelectionInteraction';

const DEPENDENCY_ARROW_STROKE_WIDTH = 1;
const DEPENDENCY_ARROW_SELECTED_STROKE_WIDTH = 2;
/**
 * Stroke width of the invisible path capturing the pointer around each arrow.
 */
const DEPENDENCY_ARROW_HIT_STROKE_WIDTH = 10;
/**
 * Radius of the round delete button replacing the arrowhead of the selected arrow.
 */
const DEPENDENCY_DELETE_BUTTON_RADIUS = 7;
const DEPENDENCY_DELETE_BUTTON_CROSS_RADIUS = 2.5;

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
  // Same layer as the current time indicator and as a hovered events cell — the cell,
  // later in the DOM, wins the tie so its dependency terminal paints above the arrows.
  // Below the pinned title column, which covers the arrows on horizontal scroll.
  zIndex: 2,
  color: (theme.vars || theme).palette.grey[400],
  ...theme.applyStyles('dark', {
    color: (theme.vars || theme).palette.grey[600],
  }),
  '[data-dependency-id][data-selected]': {
    color: (theme.vars || theme).palette.error.main,
  },
}));

/**
 * The interaction layer: the arrows' invisible click hit-areas and the selected
 * arrow's delete button. Separate from the visual overlay so it can sit above the
 * events cells even when a hovered cell is lifted — an arrow riding over an event
 * stays clickable. Below the pinned title cells (z-index 3, later in the DOM).
 */
const DependencyInteractionsSvg = styled('svg', {
  name: 'MuiEventTimeline',
  slot: 'DependencyInteractions',
})(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 'var(--title-column-width)',
  pointerEvents: 'none',
  zIndex: 3,
  '[data-dependency-hit]': {
    pointerEvents: 'stroke',
    cursor: 'pointer',
  },
  '[data-dependency-delete-button]': {
    pointerEvents: 'auto',
    cursor: 'pointer',
    color: (theme.vars || theme).palette.error.main,
  },
}));

/**
 * Renders the arrows of the active dependencies over the timeline rows, the
 * provisional (rubber-band) arrow of the pending create-dependency gesture, and the
 * selection interactions of the existing arrows.
 */
export function EventTimelinePremiumDependencyArrows() {
  const store = useEventTimelinePremiumStoreContext();
  const dependencies = useStore(store, eventTimelinePremiumDependencySelectors.activeModelList);
  const creation = useStore(store, eventTimelinePremiumDependencySelectors.creation);

  useDependencySelectionInteraction();

  if (dependencies.length === 0 && creation === null) {
    return null;
  }

  return <DependencyArrowsLayer dependencies={dependencies} creation={creation} />;
}

/**
 * The arrows and their geometry, shared by the visual and the interaction layers.
 * Arrow paths are computed from the data model — never from the DOM — so they can
 * anchor on events the virtualizer did not mount, and they only change when an event
 * or dependency changes, not on scroll.
 */
function useVisibleDependencyArrows(dependencies: readonly SchedulerDependency[]) {
  const adapter = useAdapterContext();
  const theme = useTheme();
  const store = useEventTimelinePremiumStoreContext();
  const virtualizerStore = useEventTimelinePremiumVirtualizerStore();

  const presetConfig = useStore(store, eventTimelinePremiumPresetSelectors.config);
  const selectedId = useStore(store, eventTimelinePremiumDependencySelectors.selectedId);
  const resources = useStore(
    store,
    schedulerOccurrenceSelectors.groupedByResourceList,
    presetConfig.start,
    presetConfig.end,
  );
  const rowsMeta = virtualizerStore.use(Dimensions.selectors.rowsMeta);
  const renderContext = virtualizerStore.use(Virtualization.selectors.renderContext);

  const eventsWidth = presetConfig.tickCount * presetConfig.tickWidth;

  const resolverParameters = React.useMemo(
    () => ({
      adapter,
      resources,
      rowPositions: rowsMeta.positions,
      collectionStart: presetConfig.start,
      collectionEnd: presetConfig.end,
      eventsWidth,
      laneMetrics: getEventsCellLaneMetrics(theme),
    }),
    [
      adapter,
      resources,
      rowsMeta.positions,
      presetConfig.start,
      presetConfig.end,
      eventsWidth,
      theme,
    ],
  );

  const resolver = React.useMemo(
    () => createDependencyAnchorResolver(resolverParameters),
    [resolverParameters],
  );

  const arrows = React.useMemo(
    () => computeDependencyArrows({ ...resolverParameters, dependencies, resolver }),
    [resolverParameters, dependencies, resolver],
  );

  // Only render the arrows intersecting the visible range. Row-range overlap (rather
  // than endpoint visibility) keeps an arrow whose vertical segment crosses the
  // viewport even when both of its endpoints are scrolled out.
  const { start: visibleStartFraction, end: visibleEndFraction } = getVisibleFractionRange(
    renderContext,
    presetConfig.tickCount,
  );
  const visibleArrows = arrows.filter(
    (arrow) =>
      arrow.maxXFraction > visibleStartFraction &&
      arrow.minXFraction < visibleEndFraction &&
      arrow.maxRowIndex >= renderContext.firstRowIndex &&
      arrow.minRowIndex <= renderContext.lastRowIndex,
  );

  // The selected arrow paints last so its highlight is never covered by a sibling.
  if (selectedId !== null) {
    visibleArrows.sort((a, b) => Number(a.id === selectedId) - Number(b.id === selectedId));
  }

  // The overlay's y = 0 is the top of the first rendered row (the positioner offsets
  // the row container), while the paths are in absolute row-space. The viewBox maps
  // one to the other and clips the arrows reaching off-screen anchors.
  const offsetTop = rowsMeta.positions[renderContext.firstRowIndex] ?? 0;
  const height = rowsMeta.currentPageTotalHeight - offsetTop;

  return { visibleArrows, selectedId, resolver, eventsWidth, offsetTop, height };
}

function DependencyArrowsLayer({
  dependencies,
  creation,
}: {
  dependencies: readonly SchedulerDependency[];
  creation: SchedulerDependencyCreation | null;
}) {
  const theme = useTheme();
  const { schedulerId } = useEventTimelinePremiumStyledContext();

  const svgRef = React.useRef<SVGSVGElement>(null);

  const { visibleArrows, selectedId, resolver, eventsWidth, offsetTop, height } =
    useVisibleDependencyArrows(dependencies);

  const creationPath = getCreationPath(creation, resolver, svgRef, offsetTop);

  if ((visibleArrows.length === 0 && creationPath === null) || eventsWidth <= 0 || height <= 0) {
    return null;
  }

  const arrowheadId = `${schedulerId}-dependency-arrowhead`;
  const creationArrowheadId = `${schedulerId}-dependency-arrowhead-creation`;
  // Create in green, delete in red: the provisional arrow announces a creation, the
  // selected arrow (whose delete button is one click away) a removal.
  const creationColor = (theme.vars || theme).palette.success.main;

  return (
    <DependencyArrowsSvg
      ref={svgRef}
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
        {/* Markers do not inherit the color of the referencing path, so the creation
            arrowhead needs its own def. */}
        <marker
          id={creationArrowheadId}
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
            fill={creationColor}
            stroke="none"
          />
        </marker>
      </defs>
      {visibleArrows.map((arrow) => {
        const selected = arrow.id === selectedId;
        return (
          <path
            key={arrow.key}
            data-dependency-id={String(arrow.id)}
            {...(selected ? { 'data-selected': '' } : null)}
            d={arrow.d}
            fill="none"
            stroke="currentColor"
            strokeWidth={
              selected ? DEPENDENCY_ARROW_SELECTED_STROKE_WIDTH : DEPENDENCY_ARROW_STROKE_WIDTH
            }
            // The selected arrow ends on the delete button instead of the arrowhead.
            markerEnd={selected ? undefined : `url(#${arrowheadId})`}
          />
        );
      })}
      {creationPath !== null && (
        <path
          data-dependency-drag-line=""
          d={creationPath.d}
          fill="none"
          stroke={creationColor}
          strokeWidth={DEPENDENCY_ARROW_STROKE_WIDTH}
          strokeDasharray={creationPath.snapped ? undefined : '4 3'}
          markerEnd={creationPath.snapped ? `url(#${creationArrowheadId})` : undefined}
        />
      )}
    </DependencyArrowsSvg>
  );
}

/**
 * The click hit-areas and the selected arrow's delete button, rendered after the rows
 * so they stay above the events cells (including a hovered, lifted one).
 */
export function EventTimelinePremiumDependencyInteractions() {
  const store = useEventTimelinePremiumStoreContext();
  const dependencies = useStore(store, eventTimelinePremiumDependencySelectors.activeModelList);

  if (dependencies.length === 0) {
    return null;
  }

  return <DependencyInteractionsLayer dependencies={dependencies} />;
}

function DependencyInteractionsLayer({
  dependencies,
}: {
  dependencies: readonly SchedulerDependency[];
}) {
  const theme = useTheme();
  const store = useEventTimelinePremiumStoreContext();
  const { visibleArrows, selectedId, eventsWidth, offsetTop, height } =
    useVisibleDependencyArrows(dependencies);

  if (visibleArrows.length === 0 || eventsWidth <= 0 || height <= 0) {
    return null;
  }

  const handleSelect = (dependencyId: SchedulerDependencyId) => {
    store.setSelectedDependency(dependencyId);
  };

  const handleDelete = (dependencyId: SchedulerDependencyId) => {
    store.deleteDependency(dependencyId);
    store.setSelectedDependency(null);
  };

  return (
    <DependencyInteractionsSvg
      aria-hidden
      data-dependency-interactions=""
      width={eventsWidth}
      height={height}
      viewBox={`0 ${offsetTop} ${eventsWidth} ${height}`}
    >
      {visibleArrows.map((arrow) => {
        // Clamped inside the events area: at the timeline's left edge the anchor sits
        // at x = 0 and an unclamped button would be clipped by the viewBox.
        const buttonX = Math.max(
          arrow.endPoint.x - DEPENDENCY_DELETE_BUTTON_RADIUS,
          DEPENDENCY_DELETE_BUTTON_RADIUS,
        );
        return (
          <g key={arrow.key}>
            <path
              data-dependency-hit={String(arrow.id)}
              d={arrow.hitD}
              fill="none"
              stroke="transparent"
              strokeWidth={DEPENDENCY_ARROW_HIT_STROKE_WIDTH}
              onClick={() => handleSelect(arrow.id)}
            />
            {arrow.id === selectedId && (
              <g
                data-dependency-delete-button=""
                role="button"
                onClick={() => handleDelete(arrow.id)}
              >
                <circle
                  cx={buttonX}
                  cy={arrow.endPoint.y}
                  r={DEPENDENCY_DELETE_BUTTON_RADIUS}
                  fill="currentColor"
                  stroke="none"
                />
                <path
                  d={buildDeleteCrossPath(buttonX, arrow.endPoint.y)}
                  stroke={(theme.vars || theme).palette.error.contrastText}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            )}
          </g>
        );
      })}
    </DependencyInteractionsSvg>
  );
}

function buildDeleteCrossPath(cx: number, cy: number): string {
  const r = DEPENDENCY_DELETE_BUTTON_CROSS_RADIUS;
  return `M ${cx - r} ${cy - r} L ${cx + r} ${cy + r} M ${cx - r} ${cy + r} L ${cx + r} ${cy - r}`;
}

/**
 * The path of the provisional arrow: a straight dashed line from the end edge of the
 * gesture's source occurrence to the cursor, turning solid (still straight) and
 * snapping to the start edge of the hovered target when there is one — the routed
 * arrow only appears once the dependency is actually created.
 */
function getCreationPath(
  creation: SchedulerDependencyCreation | null,
  resolver: ReturnType<typeof createDependencyAnchorResolver>,
  svgRef: React.RefObject<SVGSVGElement | null>,
  offsetTop: number,
): { d: string; snapped: boolean } | null {
  if (creation === null) {
    return null;
  }

  const source = getEventEdgeAnchor(
    resolver,
    creation.sourceEventId,
    'end',
    creation.sourceOccurrenceKey,
  );
  if (source === null) {
    return null;
  }

  if (creation.targetEventId !== null) {
    const target = getEventEdgeAnchor(
      resolver,
      creation.targetEventId,
      'start',
      creation.targetOccurrenceKey ?? undefined,
    );
    if (target !== null) {
      return {
        d: `M ${source.x} ${source.y} L ${target.x} ${target.y}`,
        snapped: true,
      };
    }
  }

  // The svg rect already folds in both scroll offsets; `offsetTop` maps the client
  // point into the viewBox's absolute row-space. Read at render time, never cached —
  // the layer re-renders on every cursor update. On the very first frame the ref is
  // still null: skip the line, the next drag move fills it.
  const rect = svgRef.current?.getBoundingClientRect();
  if (rect === undefined) {
    return null;
  }
  const cursorPoint = {
    x: creation.cursor.clientX - rect.left,
    y: creation.cursor.clientY - rect.top + offsetTop,
  };
  return {
    d: `M ${source.x} ${source.y} L ${cursorPoint.x} ${cursorPoint.y}`,
    snapped: false,
  };
}
