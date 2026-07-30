'use client';
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium-store-context';
import { eventTimelinePremiumDependencySelectors } from '@mui/x-scheduler-internals-premium/event-timeline-premium-selectors';
import type { SchedulerDependencyCreation } from '@mui/x-scheduler-internals-premium/models';
import { useEventTimelinePremiumStyledContext } from '../../EventTimelinePremiumStyledContext';
import type { DependencyAnchorResolver } from './dependencyArrowGeometry';
import { getEventEdgeAnchor, DEPENDENCY_ARROWHEAD_SIZE } from './dependencyArrowGeometry';
import { useDependencyGeometry } from './EventTimelinePremiumDependencyGeometry';

const DEPENDENCY_ARROW_STROKE_WIDTH = 1;
const DEPENDENCY_ARROW_SELECTED_STROKE_WIDTH = 2;
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
  // Same layer as the current time indicator and as the terminals overlay — the
  // terminals, later in the DOM, win the tie and paint above the arrows. Below the
  // pinned title column, which covers the arrows on horizontal scroll.
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
 * Renders the arrows of the active dependencies over the timeline rows, the
 * provisional (rubber-band) arrow of the pending create-dependency gesture, and the
 * selection interactions of the existing arrows.
 */
export function EventTimelinePremiumDependencyArrows() {
  const store = useEventTimelinePremiumStoreContext();
  const dependencies = useStore(store, eventTimelinePremiumDependencySelectors.activeModelList);
  const creation = useStore(store, eventTimelinePremiumDependencySelectors.creation);

  if (dependencies.length === 0 && creation === null) {
    return null;
  }

  return <DependencyArrowsLayer creation={creation} />;
}

function DependencyArrowsLayer({ creation }: { creation: SchedulerDependencyCreation | null }) {
  const theme = useTheme();
  const { schedulerId } = useEventTimelinePremiumStyledContext();

  const svgRef = React.useRef<SVGSVGElement>(null);

  // The overlays' y = 0 is the top of the first rendered row (the positioner offsets
  // the row container), while the paths are in absolute row-space. The viewBox maps
  // one to the other and clips the arrows reaching off-screen anchors.
  const { visibleArrows, selectedId, resolver, eventsWidth, offsetTop, height } =
    useDependencyGeometry();

  const creationPath = getCreationPath(creation, resolver, svgRef, offsetTop);

  // Mount on `creation` (not `creationPath`): the unsnapped branch needs the svg rect,
  // so the svg must exist before the path can be computed.
  if ((visibleArrows.length === 0 && creation === null) || eventsWidth <= 0 || height <= 0) {
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
        <DependencyArrowheadMarker id={arrowheadId} fill="currentColor" />
        {/* Markers do not inherit the color of the referencing path, so the creation
            arrowhead needs its own def. */}
        <DependencyArrowheadMarker id={creationArrowheadId} fill={creationColor} />
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
 * The path of the provisional arrow: a straight dashed line from the end edge of the
 * gesture's source occurrence to the cursor, turning solid (still straight) and
 * snapping to the start edge of the hovered target when there is one — the routed
 * arrow only appears once the dependency is actually created.
 */
function getCreationPath(
  creation: SchedulerDependencyCreation | null,
  resolver: DependencyAnchorResolver,
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
      creation.targetOccurrenceKey,
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

function DependencyArrowheadMarker({ id, fill }: { id: string; fill: string }) {
  return (
    <marker
      id={id}
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
        fill={fill}
        stroke="none"
      />
    </marker>
  );
}
