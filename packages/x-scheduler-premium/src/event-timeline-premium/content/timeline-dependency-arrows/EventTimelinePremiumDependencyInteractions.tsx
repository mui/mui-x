'use client';
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import { isCoarsePointer, useElementDragMarker } from '@mui/x-scheduler-internals/internals';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium-store-context';
import { eventTimelinePremiumDependencySelectors } from '@mui/x-scheduler-internals-premium/event-timeline-premium-selectors';
import type { SchedulerDependencyId } from '@mui/x-scheduler-internals-premium/models';
import {
  orderArrowsWithSelectedLast,
  useDependencyGeometry,
  useSetDependencyHoveredId,
} from './EventTimelinePremiumDependencyGeometry';
import {
  DEPENDENCY_ARROW_HIT_STROKE_WIDTH,
  DEPENDENCY_ARROW_HIT_TRIM_END,
} from './dependencyArrowHitArea';
import { useDependencySelectionInteraction } from './useDependencySelectionInteraction';
import type { DependencyContextMenuState } from './EventTimelinePremiumDependencyContextMenu';
import type { DependencyArrow } from './dependencyArrowGeometry';
import { EventTimelinePremiumDependencyContextMenu } from './EventTimelinePremiumDependencyContextMenu';

// The hit paths never ride over an event the route crosses (the geometry cuts them
// around the boxes), the end trims protect the resize handles at the route's
// extremities, and the revealed terminals paint above the band (their overlay is
// later in the DOM) — so events, handles and terminals all win over a crossing arrow.
/**
 * Radius of the round delete button replacing the arrowhead of the selected arrow.
 */
const DEPENDENCY_DELETE_BUTTON_RADIUS = 7;
const DEPENDENCY_DELETE_BUTTON_CROSS_RADIUS = 2.5;

/**
 * The interaction layer: the arrows' invisible click hit-areas and the selected
 * arrow's delete button. Separate from the visual overlay so the pointer-enabled
 * surface stays out of the `pointerEvents: 'none'` svg.
 * TODO(dependencies public flip, #23420): add a `dependencyInteractions` utility class; the
 * layer only carries data attributes while the feature has no public API. Same z-index as the arrows
 * overlay and after it in the DOM, so it paints above the arrow strokes — but before
 * the terminals overlay, whose revealed terminals must win the clicks over a crossing
 * band. Below the pinned title cells (z-index 3), which cover it on horizontal
 * scroll instead of leaking their clicks to the arrows underneath.
 */
const DependencyInteractionsSvg = styled('svg', {
  name: 'MuiEventTimeline',
  slot: 'DependencyInteractions',
})(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 'var(--title-column-width)',
  pointerEvents: 'none',
  zIndex: 2,
  '[data-dependency-hit]': {
    pointerEvents: 'stroke',
    cursor: 'pointer',
  },
  '[data-dependency-hit-head]': {
    pointerEvents: 'fill',
    cursor: 'pointer',
  },
  '[data-dependency-delete-button]': {
    pointerEvents: 'auto',
    cursor: 'pointer',
    color: (theme.vars || theme).palette.error.main,
  },
  // The overlay is no drop target's ancestor: a dragover landing on a hit-area would
  // refuse the drop right over an arrow, so any drag mutes every opted-in child.
  '&[data-drag-active] *': {
    pointerEvents: 'none',
  },
}));

/**
 * The arrows' hit-areas (click, double click, context menu, hover), the selected arrow's
 * delete button and the context menu.
 */
export function EventTimelinePremiumDependencyInteractions() {
  const store = useEventTimelinePremiumStoreContext();
  const dependencies = useStore(store, eventTimelinePremiumDependencySelectors.activeModelList);
  // Outside the layer, so deleting the last arrow from the menu does not unmount it
  // during its exit transition.
  const [contextMenu, setContextMenu] = React.useState<DependencyContextMenuState | null>(null);

  return (
    <React.Fragment>
      {dependencies.length > 0 && <DependencyInteractionsLayer onContextMenu={setContextMenu} />}
      <EventTimelinePremiumDependencyContextMenu
        state={contextMenu}
        onClose={() => setContextMenu((previous) => previous && { ...previous, open: false })}
      />
    </React.Fragment>
  );
}

function DependencyInteractionsLayer({
  onContextMenu,
}: {
  onContextMenu: (state: DependencyContextMenuState) => void;
}) {
  const theme = useTheme();
  const store = useEventTimelinePremiumStoreContext();
  const svgRef = React.useRef<SVGSVGElement>(null);
  const { visibleArrows, eventsWidth, offsetTop, height } = useDependencyGeometry();
  const selectedId = useStore(store, eventTimelinePremiumDependencySelectors.selectedId);
  const setHoveredId = useSetDependencyHoveredId();
  const orderedArrows = React.useMemo(
    () => orderArrowsWithSelectedLast(visibleArrows, selectedId),
    [visibleArrows, selectedId],
  );
  // `deleteDependency` ignores read-only dependencies: hide the button instead of
  // rendering one that does nothing.
  const isReadOnly = useStore(store, eventTimelinePremiumDependencySelectors.isReadOnly);

  useDependencySelectionInteraction(svgRef);
  useElementDragMarker(svgRef);

  if (visibleArrows.length === 0 || eventsWidth <= 0 || height <= 0) {
    return null;
  }

  const handleSelect = (dependencyId: SchedulerDependencyId) => {
    store.setSelectedDependencyId(dependencyId);
  };

  // A client point in the overlay coordinates the dependency dialog is anchored in.
  const toOverlayPoint = (event: React.MouseEvent) => {
    const rect = svgRef.current!.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top + offsetTop };
  };

  // The rows of the arrow the user opened: the dialog shows the colors of those rows.
  const getResourceIds = (arrow: DependencyArrow) => ({
    sourceResourceId: arrow.sourceResourceId,
    targetResourceId: arrow.targetResourceId,
  });

  const handleDoubleClick = (arrow: DependencyArrow, event: React.MouseEvent) => {
    store.openDependencyEditor(arrow.id, toOverlayPoint(event), getResourceIds(arrow));
  };

  const handleContextMenu = (arrow: DependencyArrow, event: React.MouseEvent) => {
    if (isCoarsePointer()) {
      return;
    }
    event.preventDefault();
    store.setSelectedDependencyId(arrow.id);
    onContextMenu({
      open: true,
      dependencyId: arrow.id,
      anchorPosition: { top: event.clientY - 4, left: event.clientX - 2 },
      editorAnchor: toOverlayPoint(event),
      editorResourceIds: getResourceIds(arrow),
    });
  };

  // A dependency with an endpoint on several resources draws one arrow per pair of
  // row appearances, all sharing the dependency id: each one gets its own button, so
  // the arrow the user selected is always the one carrying the affordance. They all
  // delete the same selected dependency, so whichever is clicked does the same thing.
  const hasDeleteButton = selectedId !== null && !isReadOnly;

  return (
    <DependencyInteractionsSvg
      ref={svgRef}
      aria-hidden
      data-dependency-interactions=""
      width={eventsWidth}
      height={height}
      viewBox={`0 ${offsetTop} ${eventsWidth} ${height}`}
    >
      {orderedArrows.map((arrow) => {
        // On the side of the tip the arrow comes from, so it never covers the target
        // event, and clamped inside the viewBox: at a timeline edge or into a
        // scrolled-out row the button would otherwise be unreachable.
        const buttonDirection = arrow.targetEdge === 'start' ? -1 : 1;
        const buttonX = Math.min(
          Math.max(
            arrow.endPoint.x + buttonDirection * DEPENDENCY_DELETE_BUTTON_RADIUS,
            DEPENDENCY_DELETE_BUTTON_RADIUS,
          ),
          eventsWidth - DEPENDENCY_DELETE_BUTTON_RADIUS,
        );
        const buttonY = Math.min(
          Math.max(arrow.endPoint.y, offsetTop + DEPENDENCY_DELETE_BUTTON_RADIUS),
          offsetTop + height - DEPENDENCY_DELETE_BUTTON_RADIUS,
        );
        return (
          <g key={arrow.key}>
            <g
              onClick={() => handleSelect(arrow.id)}
              onDoubleClick={(event) => handleDoubleClick(arrow, event)}
              onContextMenu={(event) => handleContextMenu(arrow, event)}
              // The hover restyles the visual arrow, which lives in the arrows overlay
              // (below the rows, never hit by the pointer). On the group, so moving
              // between the line and the arrowhead does not leave the arrow.
              onPointerEnter={() => setHoveredId(arrow.id)}
              onPointerLeave={() => setHoveredId(null)}
            >
              <path
                data-dependency-hit={String(arrow.id)}
                d={arrow.hitD}
                fill="none"
                stroke="transparent"
                strokeWidth={DEPENDENCY_ARROW_HIT_STROKE_WIDTH}
              />
              {/* The line's hit-area stops short of the tip: the arrowhead gets its
                    own, outside the target event. */}
              <rect
                data-dependency-hit-head={String(arrow.id)}
                x={
                  buttonDirection < 0
                    ? arrow.endPoint.x - DEPENDENCY_ARROW_HIT_TRIM_END
                    : arrow.endPoint.x
                }
                y={arrow.endPoint.y - DEPENDENCY_ARROW_HIT_STROKE_WIDTH / 2}
                width={DEPENDENCY_ARROW_HIT_TRIM_END}
                height={DEPENDENCY_ARROW_HIT_STROKE_WIDTH}
                fill="transparent"
              />
            </g>
            {hasDeleteButton && arrow.id === selectedId && (
              <g
                data-dependency-delete-button=""
                onClick={() => store.deleteSelectedDependency()}
                // It replaces the arrowhead: a right click there opens the same menu.
                onContextMenu={(event) => handleContextMenu(arrow, event)}
              >
                <circle
                  cx={buttonX}
                  cy={buttonY}
                  r={DEPENDENCY_DELETE_BUTTON_RADIUS}
                  fill="currentColor"
                  stroke="none"
                />
                <path
                  d={buildDeleteCrossPath(buttonX, buttonY)}
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
