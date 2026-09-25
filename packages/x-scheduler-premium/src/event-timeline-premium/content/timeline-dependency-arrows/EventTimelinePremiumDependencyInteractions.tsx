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
} from './EventTimelinePremiumDependencyGeometry';
import { DEPENDENCY_ARROW_HIT_STROKE_WIDTH } from './dependencyArrowHitArea';
import { useDependencySelectionInteraction } from './useDependencySelectionInteraction';
import type { DependencyContextMenuState } from './EventTimelinePremiumDependencyContextMenu';
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
 * The click hit-areas and the selected arrow's delete button.
 */
export function EventTimelinePremiumDependencyInteractions() {
  const store = useEventTimelinePremiumStoreContext();
  const dependencies = useStore(store, eventTimelinePremiumDependencySelectors.activeModelList);

  if (dependencies.length === 0) {
    return null;
  }

  return <DependencyInteractionsLayer />;
}

function DependencyInteractionsLayer() {
  const theme = useTheme();
  const store = useEventTimelinePremiumStoreContext();
  const svgRef = React.useRef<SVGSVGElement>(null);
  const { visibleArrows, eventsWidth, offsetTop, height } = useDependencyGeometry();
  const selectedId = useStore(store, eventTimelinePremiumDependencySelectors.selectedId);
  const orderedArrows = React.useMemo(
    () => orderArrowsWithSelectedLast(visibleArrows, selectedId),
    [visibleArrows, selectedId],
  );
  // `deleteDependency` ignores read-only dependencies: hide the button instead of
  // rendering one that does nothing.
  const isSelectedReadOnly = useStore(
    store,
    eventTimelinePremiumDependencySelectors.isModelReadOnly,
    selectedId,
  );

  const [contextMenu, setContextMenu] = React.useState<DependencyContextMenuState | null>(null);

  useDependencySelectionInteraction(svgRef);
  useElementDragMarker(svgRef);

  if (visibleArrows.length === 0 || eventsWidth <= 0 || height <= 0) {
    return null;
  }

  const handleSelect = (dependencyId: SchedulerDependencyId) => {
    store.setSelectedDependencyId(dependencyId);
  };

  // The hover restyles the visual arrow, which lives in the arrows overlay (below the
  // rows, never hit by the pointer): the attribute is toggled there directly, on every
  // appearance of the dependency, like the selection highlight.
  const setHovered = (dependencyId: SchedulerDependencyId, hovered: boolean) => {
    const arrowsSvg = svgRef.current?.parentElement?.querySelector('[data-dependency-arrows]');
    arrowsSvg?.querySelectorAll('[data-dependency-id]').forEach((path) => {
      if (path.getAttribute('data-dependency-id') === String(dependencyId)) {
        path.toggleAttribute('data-hovered', hovered);
      }
    });
  };

  // A client point in the overlay coordinates the dependency dialog is anchored in.
  const toOverlayPoint = (event: React.MouseEvent) => {
    const rect = svgRef.current!.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top + offsetTop };
  };

  const handleDoubleClick = (dependencyId: SchedulerDependencyId, event: React.MouseEvent) => {
    store.openDependencyEditor(dependencyId, toOverlayPoint(event));
  };

  const handleContextMenu = (dependencyId: SchedulerDependencyId, event: React.MouseEvent) => {
    if (isCoarsePointer()) {
      return;
    }
    event.preventDefault();
    store.setSelectedDependencyId(dependencyId);
    setContextMenu({
      open: true,
      dependencyId,
      anchorPosition: { top: event.clientY - 4, left: event.clientX - 2 },
      editorAnchor: toOverlayPoint(event),
    });
  };

  // A dependency with an endpoint on several resources draws one arrow per pair of
  // row appearances, all sharing the dependency id: each one gets its own button, so
  // the arrow the user selected is always the one carrying the affordance. They all
  // delete the same selected dependency, so whichever is clicked does the same thing.
  const hasDeleteButton = selectedId !== null && !isSelectedReadOnly;

  return (
    <React.Fragment>
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
              <path
                data-dependency-hit={String(arrow.id)}
                d={arrow.hitD}
                fill="none"
                stroke="transparent"
                strokeWidth={DEPENDENCY_ARROW_HIT_STROKE_WIDTH}
                onClick={() => handleSelect(arrow.id)}
                onDoubleClick={(event) => handleDoubleClick(arrow.id, event)}
                onContextMenu={(event) => handleContextMenu(arrow.id, event)}
                onPointerEnter={() => setHovered(arrow.id, true)}
                onPointerLeave={() => setHovered(arrow.id, false)}
              />
              {hasDeleteButton && arrow.id === selectedId && (
                <g
                  data-dependency-delete-button=""
                  onClick={() => store.deleteSelectedDependency()}
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
      <EventTimelinePremiumDependencyContextMenu
        state={contextMenu}
        onClose={() => setContextMenu((previous) => previous && { ...previous, open: false })}
      />
    </React.Fragment>
  );
}

function buildDeleteCrossPath(cx: number, cy: number): string {
  const r = DEPENDENCY_DELETE_BUTTON_CROSS_RADIUS;
  return `M ${cx - r} ${cy - r} L ${cx + r} ${cy + r} M ${cx - r} ${cy + r} L ${cx + r} ${cy - r}`;
}
