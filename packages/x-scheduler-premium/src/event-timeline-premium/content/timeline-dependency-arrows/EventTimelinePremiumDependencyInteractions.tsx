'use client';
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium-store-context';
import { eventTimelinePremiumDependencySelectors } from '@mui/x-scheduler-internals-premium/event-timeline-premium-selectors';
import type { SchedulerDependencyId } from '@mui/x-scheduler-internals-premium/models';
import {
  orderArrowsWithSelectedLast,
  useDependencyGeometry,
} from './EventTimelinePremiumDependencyGeometry';
import { useDependencySelectionInteraction } from './useDependencySelectionInteraction';

/**
 * Stroke width of the invisible path capturing the pointer around each arrow.
 * Accepted trade-off: mid-route the band rides over the events it crosses, so a click
 * within its half-width of the line selects the arrow instead of the event. The end
 * trims protect the resize handles at the route's extremities, and the revealed
 * terminals paint above the band (their overlay is later in the DOM), so a click on
 * a terminal never leaks to an arrow crossing it.
 */
const DEPENDENCY_ARROW_HIT_STROKE_WIDTH = 10;
/**
 * Radius of the round delete button replacing the arrowhead of the selected arrow.
 */
const DEPENDENCY_DELETE_BUTTON_RADIUS = 7;
const DEPENDENCY_DELETE_BUTTON_CROSS_RADIUS = 2.5;

/**
 * The interaction layer: the arrows' invisible click hit-areas and the selected
 * arrow's delete button. Separate from the visual overlay so the pointer-enabled
 * surface stays out of the `pointerEvents: 'none'` svg. Same z-index as the arrows
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

  useDependencySelectionInteraction(svgRef);

  if (visibleArrows.length === 0 || eventsWidth <= 0 || height <= 0) {
    return null;
  }

  const handleSelect = (dependencyId: SchedulerDependencyId) => {
    store.setSelectedDependencyId(dependencyId);
  };

  // A dependency with an endpoint on several resources draws one arrow per pair of
  // row appearances, all sharing the dependency id: only one delete button renders.
  const buttonArrow =
    selectedId === null || isSelectedReadOnly
      ? null
      : (orderedArrows.find((arrow) => arrow.id === selectedId) ?? null);

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
        // Clamped inside the viewBox on both axes: at the timeline's left edge the
        // anchor sits at x = 0, and an arrow into a scrolled-out row has its tip above
        // or below the rendered range — an unclamped button would be unreachable there
        // even though the arrow is selected.
        const buttonX = Math.max(
          arrow.endPoint.x - DEPENDENCY_DELETE_BUTTON_RADIUS,
          DEPENDENCY_DELETE_BUTTON_RADIUS,
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
            />
            {arrow === buttonArrow && (
              <g data-dependency-delete-button="" onClick={() => store.deleteSelectedDependency()}>
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
