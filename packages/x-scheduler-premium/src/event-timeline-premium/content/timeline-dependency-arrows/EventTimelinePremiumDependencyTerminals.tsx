'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { isElement } from '@mui/x-scheduler-internals/internals';
import type {
  SchedulerEventId,
  SchedulerEventSide,
  SchedulerResourceId,
} from '@mui/x-scheduler-internals/models';
import { schedulerEventSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { TimelineGrid } from '@mui/x-scheduler-internals-premium/timeline-grid';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium-store-context';
import { eventTimelinePremiumDependencySelectors } from '@mui/x-scheduler-internals-premium/event-timeline-premium-selectors';
import { getDependencyEdges } from '@mui/x-scheduler-internals-premium/internals';
import type { SchedulerDependencyCreation } from '@mui/x-scheduler-internals-premium/models';
import { getPaletteVariants } from '@mui/x-scheduler/internals';
import { useDependencyGeometry } from './EventTimelinePremiumDependencyGeometry';

/**
 * Diameter of the terminal circle, also used to keep it inside the events area at the
 * collection end.
 */
const DEPENDENCY_TERMINAL_SIZE = 10;
/**
 * How far the terminal's interactive surface extends past the visible circle. The
 * circle is deliberately small; without a bigger target it is too hard to grab
 * (Fitts): the halo roughly doubles the effective size, like the amplified terminal
 * zones of the usual Gantt tools.
 */
const DEPENDENCY_TERMINAL_HALO = 7;
/**
 * The invisible proximity surface keeping a revealed terminal alive: while the
 * pointer stays within this distance of the event or its terminal, the reveal
 * survives crossing empty cells (a diagonal exit through the event's corner would
 * otherwise pull the terminal out from under the pointer). Beyond it the terminal
 * hides immediately — proximity, not time, defines the hover.
 */
const DEPENDENCY_TERMINAL_GRACE_MARGIN = 12;

const DependencyTerminalsLayer = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'DependencyTerminals',
})({
  position: 'absolute',
  top: 0,
  left: 'var(--title-column-width)',
  pointerEvents: 'none',
  // Same layer as the arrows and interactions overlays; last in the DOM, so the
  // terminals win the ties and paint above the arrows and their click hit-areas
  // without lifting anything else with them. Below the pinned title cells (z-index 3).
  zIndex: 2,
});

// TODO(dependencies public flip, #23420): add an `eventDependencyTerminal` utility class (the
// key paired with the `EventDependencyTerminal` slot, like `eventResizeHandler`) and a
// `dependencyTerminals` one for the layer; both only carry data attributes while the
// feature has no public API.
const EventTimelinePremiumDependencyTerminal = styled(TimelineGrid.EventDependencyTerminal, {
  name: 'MuiEventTimeline',
  slot: 'EventDependencyTerminal',
})(({ theme }) => ({
  position: 'absolute',
  width: DEPENDENCY_TERMINAL_SIZE,
  height: DEPENDENCY_TERMINAL_SIZE,
  borderRadius: '50%',
  // Starts exactly on the edge anchor (the arrows' anchor point), fully outside its
  // event, so the event's own resize strip stays free. Flush against the edge (no
  // gap): a gap would let the pointer land between event and terminal on its way
  // out, dropping the hover and hiding the terminal mid-approach. Trade-off: while
  // revealed it covers the first pixels of a back-to-back neighbor, whose resize grab
  // must aim above or below the circle.
  // `--terminal-anchor` hangs the circle off its anchor: to the right for the end
  // edge, to the left for the start edge.
  '--terminal-anchor': '0',
  transform: 'translate(var(--terminal-anchor), -50%)',
  transition: 'transform 120ms ease-out',
  cursor: 'crosshair',
  opacity: 0,
  // Only hit-testable while shown: an invisible terminal must not steal clicks from
  // the events and resize handles it floats above.
  pointerEvents: 'none',
  backgroundColor: 'var(--event-surface-accent)',
  border: `1px solid ${(theme.vars || theme).palette.background.paper}`,
  // Invisible halo amplifying the interactive surface: the circle alone is too small
  // a target. Outward and vertically only — extending inward would cover the event's
  // own resize strip, which the terminal deliberately leaves free.
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -DEPENDENCY_TERMINAL_HALO,
    bottom: -DEPENDENCY_TERMINAL_HALO,
    left: 0,
    right: -DEPENDENCY_TERMINAL_HALO,
  },
  '&[data-visible]': {
    opacity: 1,
    pointerEvents: 'auto',
  },
  // The grab feedback: growing under the pointer tells the user the target is
  // acquired before they press. The same growth marks the terminal a pending
  // gesture would drop on, in the creation color of the provisional arrow.
  '&[data-visible]:hover, &[data-dependency-drop-target]': {
    transform: 'translate(var(--terminal-anchor), -50%) scale(1.3)',
  },
  '&[data-dependency-drop-target]': {
    backgroundColor: (theme.vars || theme).palette.success.main,
  },
  // The selected arrow's delete button replaces its arrowhead right where the
  // target's edge terminal sits: that terminal steps aside while the selection lasts.
  '&[data-dependency-muted]': {
    opacity: 0,
    pointerEvents: 'none',
  },
  '&[data-side="start"]': {
    '--terminal-anchor': '-100%',
    '&::before': {
      left: -DEPENDENCY_TERMINAL_HALO,
      right: 0,
    },
  },
  variants: getPaletteVariants(theme),
}));

const TERMINAL_SIDES: readonly SchedulerEventSide[] = ['start', 'end'];

type TerminalGestureRole = 'source' | 'target' | 'drop' | null;

interface DependencyTerminalProps {
  eventId: SchedulerEventId;
  occurrenceKey: string;
  resourceId: SchedulerResourceId;
  side: SchedulerEventSide;
  color: string;
  left: number;
  top: number;
  gestureRole: TerminalGestureRole;
  muted: boolean;
}

// Primitive props only, so the memo holds: a creation transition re-renders the
// layer, and only the gesture's terminals (whose role changed) re-render with it.
const DependencyTerminal = React.memo(function DependencyTerminal(props: DependencyTerminalProps) {
  const { eventId, occurrenceKey, resourceId, side, color, left, top, gestureRole, muted } = props;
  return (
    <EventTimelinePremiumDependencyTerminal
      eventId={eventId}
      occurrenceKey={occurrenceKey}
      resourceId={resourceId}
      side={side}
      data-palette={color}
      data-visible={gestureRole === null ? undefined : ''}
      data-dependency-drop-target={gestureRole === 'drop' ? '' : undefined}
      data-dependency-muted={muted ? '' : undefined}
      style={{ left, top }}
    />
  );
});

function getAppearanceTerminals(
  layer: Element | null,
  occurrenceKey: string,
  resourceId: string,
): Element[] {
  return Array.from(
    layer?.querySelectorAll(
      `[data-dependency-terminal="${CSS.escape(occurrenceKey)}"][data-resource-id="${CSS.escape(resourceId)}"]`,
    ) ?? [],
  );
}

/**
 * The dependency terminals of the visible events, in an overlay above the arrows and
 * their click hit-areas. A layer of its own (rather than a child of each event) so the
 * terminal can paint above the arrows without lifting the whole events cell over them,
 * and so it escapes the cell's `overflow: clip` and the edge-chevron `clip-path` of
 * its event.
 */
export function EventTimelinePremiumDependencyTerminals() {
  const store = useEventTimelinePremiumStoreContext();
  const enabled = useStore(store, eventTimelinePremiumDependencySelectors.enabled);

  if (!enabled) {
    return null;
  }

  return <DependencyTerminalsLayerImpl />;
}

function DependencyTerminalsLayerImpl() {
  const store = useEventTimelinePremiumStoreContext();

  const creation = useStore(store, eventTimelinePremiumDependencySelectors.creation);
  const selected = useStore(store, eventTimelinePremiumDependencySelectors.selectedModel);
  // Subscribed (not read inline like the per-event flags) because a global `readOnly`
  // flip changes no event or occurrence, so nothing else would re-render the layer.
  useStore(store, (state) => state.readOnly);
  const {
    resolver,
    resources,
    eventsWidth,
    offsetTop,
    height,
    visibleStartFraction,
    visibleEndFraction,
    firstRowIndex,
    lastRowIndex: lastGeometryRowIndex,
  } = useDependencyGeometry();

  const layerRef = React.useRef<HTMLDivElement>(null);

  // The hover never enters React: it toggles `data-visible` on the terminals of the
  // hovered appearance directly (the same DOM-driven technique as the rubber band),
  // so pointer-rate transitions do not rebuild the layer.
  const revealedTerminalsRef = React.useRef<readonly Element[]>([]);
  // The event appearance anchoring the revealed terminals: together they define the
  // proximity surface the pointer may roam without dropping the reveal.
  const revealedEventRef = React.useRef<Element | null>(null);
  const revealTerminals = useStableCallback(
    (terminals: readonly Element[], eventElement: Element | null = null) => {
      // Compared element by element: the two terminals of an appearance are culled
      // separately, so the set of one appearance can grow while the pointer stays.
      const revealed = revealedTerminalsRef.current;
      if (
        revealed.length === terminals.length &&
        revealed.every((terminal, index) => terminal === terminals[index])
      ) {
        if (eventElement !== null) {
          revealedEventRef.current = eventElement;
        }
        return;
      }
      for (const terminal of revealedTerminalsRef.current) {
        terminal.removeAttribute('data-visible');
      }
      for (const terminal of terminals) {
        terminal.setAttribute('data-visible', '');
      }
      revealedTerminalsRef.current = terminals;
      revealedEventRef.current = terminals.length === 0 ? null : eventElement;
    },
  );

  // A native drag suppresses pointer events, so the hover goes stale: at gesture start
  // only the gesture's terminals (owned by the render) keep their reveal, at gesture
  // end the tracking resets and the next pointerover rebuilds it.
  React.useEffect(() => {
    if (creation === null) {
      revealTerminals([]);
      return;
    }
    for (const terminal of revealedTerminalsRef.current) {
      const role = getTerminalGestureRole(
        creation,
        terminal.getAttribute('data-dependency-terminal')!,
        terminal.getAttribute('data-resource-id')!,
        terminal.getAttribute('data-side') as SchedulerEventSide,
      );
      if (role === null) {
        terminal.removeAttribute('data-visible');
      }
    }
    revealedTerminalsRef.current = [];
    revealedEventRef.current = null;
  }, [creation, revealTerminals]);

  const mounted = eventsWidth > 0 && height > 0;

  // Delegated hover tracking on the row container: the terminals live outside the
  // event elements, so the events' own `:hover` cannot reveal them.
  React.useEffect(() => {
    const container = layerRef.current?.parentElement;
    if (!container) {
      return undefined;
    }
    const handlePointerOver = (event: PointerEvent) => {
      const target = event.target;
      if (!isElement(target)) {
        return;
      }
      // A terminal keeps its appearance revealed while hovered — it is only
      // hit-testable while revealed, so this is always the set already tracked.
      const terminal = target.closest('[data-dependency-terminal]');
      if (terminal !== null) {
        revealTerminals(
          getAppearanceTerminals(
            layerRef.current,
            terminal.getAttribute('data-dependency-terminal')!,
            terminal.getAttribute('data-resource-id')!,
          ),
        );
        return;
      }
      const eventElement = target.closest('[data-occurrence-key]');
      if (eventElement === null) {
        // Resting on anything else (empty cells, hit bands) neither reveals nor
        // hides: the proximity surface on pointermove decides when the reveal ends.
        return;
      }
      const occurrenceKey = eventElement.getAttribute('data-occurrence-key')!;
      // The row element carries the resource: the occurrence key alone does not
      // identify a row appearance (an event assigned to several resources repeats the
      // same key on each row).
      const resourceId =
        target.closest('[data-resource-id]')?.getAttribute('data-resource-id') ?? null;
      if (resourceId === null) {
        return;
      }
      const next = getAppearanceTerminals(layerRef.current, occurrenceKey, resourceId);
      if (next.length > 0) {
        revealTerminals(next, eventElement);
      }
    };
    // The reveal ends when the pointer leaves the proximity surface around the event
    // and its terminals — not when it merely steps onto an empty cell, which a
    // diagonal exit through the event's corner does on its way to the halo.
    const handlePointerMove = (event: PointerEvent) => {
      const terminals = revealedTerminalsRef.current;
      if (terminals.length === 0) {
        return;
      }
      const nearAnchor = [revealedEventRef.current, ...terminals].some((anchor) => {
        if (anchor === null) {
          return false;
        }
        const rect = anchor.getBoundingClientRect();
        return (
          event.clientX >= rect.left - DEPENDENCY_TERMINAL_GRACE_MARGIN &&
          event.clientX <= rect.right + DEPENDENCY_TERMINAL_GRACE_MARGIN &&
          event.clientY >= rect.top - DEPENDENCY_TERMINAL_GRACE_MARGIN &&
          event.clientY <= rect.bottom + DEPENDENCY_TERMINAL_GRACE_MARGIN
        );
      });
      if (!nearAnchor) {
        revealTerminals([]);
      }
    };
    // Leaving the whole grid is unambiguous: hide right away.
    const handlePointerLeave = () => {
      revealTerminals([]);
    };
    container.addEventListener('pointerover', handlePointerOver);
    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);
    return () => {
      container.removeEventListener('pointerover', handlePointerOver);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      revealTerminals([]);
    };
  }, [mounted, revealTerminals]);

  if (!mounted) {
    return null;
  }

  // The edge terminal of the selected arrow's target, which its delete button covers.
  const mutedEdge =
    selected === null
      ? null
      : { eventId: selected.target, side: getDependencyEdges(selected.type).target };
  const terminals: React.ReactElement[] = [];
  // `lastRowIndex` is exclusive, like the virtualizer's render range it comes from.
  const endRowIndex = Math.min(lastGeometryRowIndex, resources.length);
  for (let rowIndex = firstRowIndex; rowIndex < endRowIndex; rowIndex += 1) {
    if (!resolver.hasRowPosition(rowIndex)) {
      continue;
    }
    const rowResourceId = resources[rowIndex].resource.id;
    for (const occurrence of resources[rowIndex].occurrences) {
      // Geometry culls before the per-event selectors: the row holds every occurrence
      // of the collection range, most of which are outside the viewport.
      const position = resolver.getPosition(occurrence);
      const startFraction = position.position;
      const endFraction = position.position + position.duration;
      if (endFraction < visibleStartFraction || startFraction > visibleEndFraction) {
        continue;
      }
      if (
        schedulerEventSelectors.isRecurring(store.state, occurrence.id) ||
        schedulerEventSelectors.isReadOnly(store.state, occurrence.id)
      ) {
        continue;
      }
      const anchor = { rowIndex, resourceId: rowResourceId, occurrence };
      const color = schedulerEventSelectors.color(store.state, occurrence.id, rowResourceId);
      for (const side of TERMINAL_SIDES) {
        // The edge must be inside the collection to anchor an arrow — same rule as the
        // resize handles — and inside the viewport to be reachable.
        const clipped = side === 'start' ? position.startingBeforeEdge : position.endingAfterEdge;
        const fraction = side === 'start' ? startFraction : endFraction;
        if (clipped || fraction < visibleStartFraction || fraction > visibleEndFraction) {
          continue;
        }
        const point = resolver.getEdgePoint(anchor, side);
        terminals.push(
          <DependencyTerminal
            // The occurrence key repeats on every row of a multi-resource event: only
            // the row disambiguates the appearance.
            key={`${rowIndex}:${occurrence.key}:${side}`}
            eventId={occurrence.id}
            occurrenceKey={occurrence.key}
            resourceId={rowResourceId}
            side={side}
            color={color}
            gestureRole={getTerminalGestureRole(creation, occurrence.key, rowResourceId, side)}
            muted={
              mutedEdge !== null && mutedEdge.eventId === occurrence.id && mutedEdge.side === side
            }
            // Clamped at the collection edges: the outside circle would overflow the
            // events area and be clipped by the viewport, so it slides back over the
            // event to stay reachable.
            left={
              side === 'start'
                ? Math.max(point.x, DEPENDENCY_TERMINAL_SIZE)
                : Math.min(point.x, eventsWidth - DEPENDENCY_TERMINAL_SIZE)
            }
            top={point.y - offsetTop}
          />,
        );
      }
    }
  }

  return (
    <DependencyTerminalsLayer ref={layerRef} style={{ width: eventsWidth, height }}>
      {terminals}
    </DependencyTerminalsLayer>
  );
}

/**
 * The terminal's part in the pending gesture, or `null`: the dragged edge of the
 * source, and both edges of the hovered target, the one the drop would land on
 * flagged as `'drop'`.
 */
function getTerminalGestureRole(
  creation: SchedulerDependencyCreation | null,
  occurrenceKey: string,
  resourceId: SchedulerResourceId,
  side: SchedulerEventSide,
): TerminalGestureRole {
  if (creation === null) {
    return null;
  }
  if (creation.sourceOccurrenceKey === occurrenceKey && creation.sourceResourceId === resourceId) {
    return creation.sourceSide === side ? 'source' : null;
  }
  if (creation.targetOccurrenceKey !== occurrenceKey || creation.targetResourceId !== resourceId) {
    return null;
  }
  return creation.targetSide === side ? 'drop' : 'target';
}
