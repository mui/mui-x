'use client';
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import { useDependencyDragCursor } from '@mui/x-scheduler-internals-premium/internals';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium-store-context';
import { eventTimelinePremiumDependencySelectors } from '@mui/x-scheduler-internals-premium/event-timeline-premium-selectors';
import type { SchedulerDependencyCreation } from '@mui/x-scheduler-internals-premium/models';
import { useEventTimelinePremiumStyledContext } from '../../EventTimelinePremiumStyledContext';
import type { DependencyAnchorResolver, DependencyArrowPoint } from './dependencyArrowGeometry';
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
 * selected arrow's highlight. The selection interactions (hit-areas, delete button,
 * keyboard) live in `EventTimelinePremiumDependencyInteractions`.
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
  const store = useEventTimelinePremiumStoreContext();
  const { schedulerId } = useEventTimelinePremiumStyledContext();

  const svgRef = React.useRef<SVGSVGElement>(null);
  const dragLineRef = React.useRef<SVGPathElement>(null);

  // The overlays' y = 0 is the top of the first rendered row (the positioner offsets
  // the row container), while the paths are in absolute row-space. The viewBox maps
  // one to the other and clips the arrows reaching off-screen anchors.
  const { visibleArrows, selectedId, resolver, eventsWidth, offsetTop, height } =
    useDependencyGeometry();
  // A selected read-only arrow keeps its arrowhead: the delete button that normally
  // replaces it is not rendered by the interactions layer.
  const isSelectedReadOnly = useStore(
    store,
    eventTimelinePremiumDependencySelectors.isModelReadOnly,
    selectedId,
  );

  const creationPath = getCreationPath(creation, resolver);

  // While no target snaps the line, it follows the cursor without entering React:
  // the path attribute is written directly on every drag frame, and the state only
  // changes when the gesture starts, snaps or ends. The cursor is tracked for the
  // whole gesture (also while snapped) so un-snapping can redraw immediately instead
  // of waiting for the next drag frame. The callback closes over `offsetTop`, whose
  // layout-effect registration keeps it in sync with the committed viewBox across a
  // virtualizer update mid-drag.
  const followCursor = creationPath !== null && !creationPath.snapped;
  const followCursorRef = React.useRef(followCursor);
  followCursorRef.current = followCursor;
  const lastCursorRef = React.useRef<{ clientX: number; clientY: number } | null>(null);
  if (creation === null) {
    lastCursorRef.current = null;
  }
  const sourceX = creationPath?.source.x;
  const sourceY = creationPath?.source.y;
  const followCursorMove = React.useCallback(
    (clientX: number, clientY: number) => {
      lastCursorRef.current = { clientX, clientY };
      const svg = svgRef.current;
      const line = dragLineRef.current;
      if (!followCursorRef.current || svg === null || line === null) {
        return;
      }
      // The svg rect folds in both scroll offsets; `offsetTop` maps the client point
      // into the viewBox's absolute row-space. Reading it here is a plain
      // event-handler layout read, not a render-phase reflow.
      const rect = svg.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top + offsetTop;
      line.setAttribute('d', `M ${sourceX} ${sourceY} L ${x} ${y}`);
    },
    [sourceX, sourceY, offsetTop],
  );
  useDependencyDragCursor(creation !== null, followCursorMove);
  // Redraw from the last tracked cursor when the line just un-snapped (or the
  // geometry shifted): the drag frame of the same dragover was already canceled by
  // pragmatic's drop-target update, so waiting for the next one leaves a blink.
  React.useLayoutEffect(() => {
    if (followCursor && lastCursorRef.current !== null) {
      followCursorMove(lastCursorRef.current.clientX, lastCursorRef.current.clientY);
    }
  }, [followCursor, followCursorMove]);

  // Mount on `creation` (not `creationPath`): the cursor-following line needs the svg
  // and its rect, so the svg must exist before the gesture can draw anything.
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
        const replacedByDeleteButton = selected && !isSelectedReadOnly;
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
            markerEnd={replacedByDeleteButton ? undefined : `url(#${arrowheadId})`}
          />
        );
      })}
      {creationPath !== null && (
        // Unsnapped, the `d` attribute is owned by the cursor-following monitor —
        // React never passes the prop, so re-renders cannot reset the line.
        <path
          ref={dragLineRef}
          data-dependency-drag-line=""
          {...(creationPath.snapped ? { d: creationPath.d } : null)}
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
 * arrow only appears once the dependency is actually created. Pure: the cursor
 * position never enters the state, the unsnapped line is driven through the DOM.
 */
function getCreationPath(
  creation: SchedulerDependencyCreation | null,
  resolver: DependencyAnchorResolver,
): { d?: string; snapped: boolean; source: DependencyArrowPoint } | null {
  if (creation === null) {
    return null;
  }

  const source = getEventEdgeAnchor(
    resolver,
    creation.sourceEventId,
    creation.sourceSide,
    creation.sourceOccurrenceKey,
    creation.sourceResourceId,
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
      creation.targetResourceId,
    );
    if (target !== null) {
      return {
        d: `M ${source.x} ${source.y} L ${target.x} ${target.y}`,
        snapped: true,
        source,
      };
    }
  }

  return { snapped: false, source };
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
