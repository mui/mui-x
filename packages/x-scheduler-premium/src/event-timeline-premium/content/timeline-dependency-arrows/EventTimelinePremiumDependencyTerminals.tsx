'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { schedulerEventSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { TimelineGrid } from '@mui/x-scheduler-internals-premium/timeline-grid';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium-store-context';
import { eventTimelinePremiumDependencySelectors } from '@mui/x-scheduler-internals-premium/event-timeline-premium-selectors';
import { getPaletteVariants } from '@mui/x-scheduler/internals';
import { useDependencyGeometry } from './EventTimelinePremiumDependencyGeometry';

/**
 * Diameter of the terminal circle, also used to keep it inside the events area at the
 * collection end.
 */
const DEPENDENCY_TERMINAL_SIZE = 10;

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

// TODO(dependencies public flip): add an `eventDependencyHandle` utility class; the
// terminal only carries data attributes while the feature has no public API.
const EventTimelinePremiumDependencyTerminal = styled(TimelineGrid.EventDependencyHandler, {
  name: 'MuiEventTimeline',
  slot: 'EventDependencyHandler',
})(({ theme }) => ({
  position: 'absolute',
  width: DEPENDENCY_TERMINAL_SIZE,
  height: DEPENDENCY_TERMINAL_SIZE,
  borderRadius: '50%',
  // Starts exactly on the end-edge anchor (the arrows' source point), fully outside
  // its event, so the event's own end resize strip stays free. Flush against the edge
  // (no gap): a gap would let the pointer land between event and terminal on its way
  // out, dropping the hover and hiding the terminal mid-approach. Trade-off: while
  // revealed it covers the first pixels of a back-to-back neighbor, whose
  // start-resize grab must aim above or below the circle.
  transform: 'translate(0, -50%)',
  cursor: 'crosshair',
  opacity: 0,
  // Only hit-testable while shown: an invisible terminal must not steal clicks from
  // the events and resize handles it floats above.
  pointerEvents: 'none',
  backgroundColor: 'var(--event-surface-accent)',
  border: `1px solid ${(theme.vars || theme).palette.background.paper}`,
  '&[data-visible]': {
    opacity: 1,
    pointerEvents: 'auto',
  },
  variants: getPaletteVariants(theme),
}));

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

  // The hover never enters React: it toggles `data-visible` on the two affected
  // terminals directly (the same DOM-driven technique as the rubber band), so
  // pointer-rate transitions do not rebuild the layer.
  const revealedTerminalRef = React.useRef<Element | null>(null);
  const revealTerminal = useStableCallback((terminal: Element | null) => {
    if (revealedTerminalRef.current === terminal) {
      return;
    }
    revealedTerminalRef.current?.removeAttribute('data-visible');
    terminal?.setAttribute('data-visible', '');
    revealedTerminalRef.current = terminal;
  });

  // A native drag suppresses pointer events, so the hover tracked before the gesture
  // goes stale by its end (the pointer may have dropped far away): reset it when the
  // gesture ends and let the next pointerover rebuild it.
  React.useEffect(() => {
    if (creation === null) {
      revealTerminal(null);
    }
  }, [creation, revealTerminal]);

  const mounted = eventsWidth > 0 && height > 0;

  // Delegated hover tracking on the row container: the terminals live outside the
  // event elements, so the events' own `:hover` cannot reveal them.
  React.useEffect(() => {
    const container = layerRef.current?.parentElement;
    if (!container) {
      return undefined;
    }
    // Escaped for use inside a quoted attribute selector.
    const escapeAttributeValue = (value: string) => value.replace(/["\\]/g, '\\$&');
    const getTerminalFor = (target: EventTarget | null): Element | null => {
      if (!(target instanceof Element)) {
        return null;
      }
      // A terminal keeps itself revealed while hovered.
      const handle = target.closest('[data-dependency-handle]');
      if (handle !== null) {
        return handle;
      }
      const occurrenceKey =
        target.closest('[data-occurrence-key]')?.getAttribute('data-occurrence-key') ?? null;
      // The row element carries the resource: the occurrence key alone does not
      // identify a row appearance (an event assigned to several resources repeats the
      // same key on each row).
      const resourceId =
        target.closest('[data-resource-id]')?.getAttribute('data-resource-id') ?? null;
      if (occurrenceKey === null || resourceId === null) {
        return null;
      }
      return (
        layerRef.current?.querySelector(
          `[data-dependency-handle="${escapeAttributeValue(occurrenceKey)}"][data-resource-id="${escapeAttributeValue(resourceId)}"]`,
        ) ?? null
      );
    };
    const handlePointerOver = (event: PointerEvent) => {
      // The arrows' invisible hit bands ride over the events: crossing one must not
      // hide the terminal the hover already revealed, or the pointer can never reach
      // a terminal a band covers.
      if (
        event.target instanceof Element &&
        event.target.closest('[data-dependency-interactions]')
      ) {
        return;
      }
      revealTerminal(getTerminalFor(event.target));
    };
    const handlePointerLeave = () => {
      revealTerminal(null);
    };
    container.addEventListener('pointerover', handlePointerOver);
    container.addEventListener('pointerleave', handlePointerLeave);
    return () => {
      container.removeEventListener('pointerover', handlePointerOver);
      container.removeEventListener('pointerleave', handlePointerLeave);
      revealTerminal(null);
    };
  }, [mounted, revealTerminal]);

  if (!mounted) {
    return null;
  }

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
      // The gesture starts from the end edge (the `FinishToStart` origin), which must
      // be inside the collection to anchor the provisional arrow — same rule as the
      // end resize handle.
      if (position.endingAfterEdge) {
        continue;
      }
      const endFraction = position.position + position.duration;
      if (endFraction < visibleStartFraction || endFraction > visibleEndFraction) {
        continue;
      }
      if (
        schedulerEventSelectors.isRecurring(store.state, occurrence.id) ||
        schedulerEventSelectors.isReadOnly(store.state, occurrence.id)
      ) {
        continue;
      }
      const point = resolver.getEdgePoint(
        { rowIndex, resourceId: rowResourceId, occurrence },
        'end',
      );
      // The hover reveal is DOM-driven; only the gesture's source appearance is
      // render-driven, so it survives the hover reset at drag start.
      const visible =
        creation?.sourceOccurrenceKey === occurrence.key &&
        creation.sourceResourceId === rowResourceId;
      terminals.push(
        <EventTimelinePremiumDependencyTerminal
          // The occurrence key repeats on every row of a multi-resource event: only
          // the row disambiguates the appearance.
          key={`${rowIndex}:${occurrence.key}`}
          eventId={occurrence.id}
          occurrenceKey={occurrence.key}
          resourceId={rowResourceId}
          side="end"
          data-palette={schedulerEventSelectors.color(store.state, occurrence.id)}
          data-visible={visible ? '' : undefined}
          // Clamped at the collection end: the outside circle would overflow the
          // events area and be clipped by the viewport, so it slides back over the
          // event's tail to stay reachable.
          style={{
            left: Math.min(point.x, eventsWidth - DEPENDENCY_TERMINAL_SIZE),
            top: point.y - offsetTop,
          }}
        />,
      );
    }
  }

  return (
    <DependencyTerminalsLayer
      ref={layerRef}
      data-dependency-terminals=""
      style={{ width: eventsWidth, height }}
    >
      {terminals}
    </DependencyTerminalsLayer>
  );
}
