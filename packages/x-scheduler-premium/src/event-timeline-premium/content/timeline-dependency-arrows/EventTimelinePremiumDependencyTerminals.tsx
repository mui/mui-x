'use client';
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import { Dimensions, Virtualization } from '@mui/x-virtualizer';
import { useAdapterContext } from '@mui/x-scheduler-internals/use-adapter-context';
import { computeElementPositionInCollection } from '@mui/x-scheduler-internals/internals';
import {
  schedulerEventSelectors,
  schedulerOccurrenceSelectors,
} from '@mui/x-scheduler-internals/scheduler-selectors';
import { TimelineGrid } from '@mui/x-scheduler-internals-premium/timeline-grid';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium-store-context';
import {
  eventTimelinePremiumDependencySelectors,
  eventTimelinePremiumPresetSelectors,
} from '@mui/x-scheduler-internals-premium/event-timeline-premium-selectors';
import { getPaletteVariants } from '@mui/x-scheduler/internals';
import { useEventTimelinePremiumVirtualizerStore } from '../EventTimelinePremiumVirtualizerContext';
import { getEventsCellLaneMetrics } from '../rowGeometry';
import { getVisibleFractionRange } from '../getVisibleFractionRange';
import { createDependencyAnchorResolver } from './dependencyArrowGeometry';

const DependencyTerminalsLayer = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'DependencyTerminals',
})({
  position: 'absolute',
  top: 0,
  left: 'var(--title-column-width)',
  pointerEvents: 'none',
  // Same layer as the arrows overlay; later in the DOM, so the terminals win the tie
  // and paint above the arrows without lifting anything else with them. Below the
  // pinned title cells (z-index 3).
  zIndex: 2,
});

// TODO(dependencies public flip): add an `eventDependencyHandle` utility class; the
// terminal only carries data attributes while the feature has no public API.
const EventTimelinePremiumDependencyTerminal = styled(TimelineGrid.EventDependencyHandle, {
  name: 'MuiEventTimeline',
  slot: 'EventDependencyHandle',
})(({ theme }) => ({
  position: 'absolute',
  width: 10,
  height: 10,
  borderRadius: '50%',
  // Ends exactly on the end-edge anchor (the arrows' source point), fully inside its
  // event: any outward overhang would cover the start resize handle of a back-to-back
  // neighbor, turning its resize grab into a dependency drag.
  transform: 'translate(-100%, -50%)',
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
 * The dependency terminals of the visible events, in an overlay above the arrows.
 * A layer of its own (rather than a child of each event) so the terminal can paint
 * above the arrows without lifting the whole events cell over them, and so it escapes
 * the cell's `overflow: clip` and the edge-chevron `clip-path` of its event.
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
  const adapter = useAdapterContext();
  const theme = useTheme();
  const store = useEventTimelinePremiumStoreContext();
  const virtualizerStore = useEventTimelinePremiumVirtualizerStore();

  const presetConfig = useStore(store, eventTimelinePremiumPresetSelectors.config);
  const creation = useStore(store, eventTimelinePremiumDependencySelectors.creation);
  // Subscribed (not read inline like the per-event flags) because a global `readOnly`
  // flip changes no event or occurrence, so nothing else would re-render the layer.
  useStore(store, (state) => state.readOnly);
  const resources = useStore(
    store,
    schedulerOccurrenceSelectors.groupedByResourceList,
    presetConfig.start,
    presetConfig.end,
  );
  const rowsMeta = virtualizerStore.use(Dimensions.selectors.rowsMeta);
  const renderContext = virtualizerStore.use(Virtualization.selectors.renderContext);

  const [hoveredOccurrenceKey, setHoveredOccurrenceKey] = React.useState<string | null>(null);
  const layerRef = React.useRef<HTMLDivElement>(null);

  const eventsWidth = presetConfig.tickCount * presetConfig.tickWidth;
  const offsetTop = rowsMeta.positions[renderContext.firstRowIndex] ?? 0;
  const height = rowsMeta.currentPageTotalHeight - offsetTop;
  const mounted = eventsWidth > 0 && height > 0;

  // Delegated hover tracking on the row container: the terminals live outside the
  // event elements, so the events' own `:hover` cannot reveal them.
  React.useEffect(() => {
    const container = layerRef.current?.parentElement;
    if (!container) {
      return undefined;
    }
    const getOccurrenceKey = (target: EventTarget | null): string | null => {
      if (!(target instanceof Element)) {
        return null;
      }
      // A terminal keeps itself revealed while hovered: it carries its occurrence key.
      const handle = target.closest('[data-dependency-handle]');
      if (handle !== null) {
        return handle.getAttribute('data-dependency-handle');
      }
      return target.closest('[data-occurrence-key]')?.getAttribute('data-occurrence-key') ?? null;
    };
    const handlePointerOver = (event: PointerEvent) => {
      setHoveredOccurrenceKey(getOccurrenceKey(event.target));
    };
    const handlePointerLeave = () => {
      setHoveredOccurrenceKey(null);
    };
    container.addEventListener('pointerover', handlePointerOver);
    container.addEventListener('pointerleave', handlePointerLeave);
    return () => {
      container.removeEventListener('pointerover', handlePointerOver);
      container.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [mounted]);

  const resolver = React.useMemo(
    () =>
      createDependencyAnchorResolver({
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

  if (!mounted) {
    return null;
  }

  const { start: visibleStartFraction, end: visibleEndFraction } = getVisibleFractionRange(
    renderContext,
    presetConfig.tickCount,
  );

  const terminals: React.ReactElement[] = [];
  const lastRowIndex = Math.min(renderContext.lastRowIndex, resources.length - 1);
  for (let rowIndex = renderContext.firstRowIndex; rowIndex <= lastRowIndex; rowIndex += 1) {
    if (!resolver.hasRowPosition(rowIndex)) {
      continue;
    }
    for (const occurrence of resources[rowIndex].occurrences) {
      if (
        schedulerEventSelectors.isRecurring(store.state, occurrence.id) ||
        schedulerEventSelectors.isReadOnly(store.state, occurrence.id)
      ) {
        continue;
      }
      const position = computeElementPositionInCollection(adapter, {
        start: occurrence.displayTimezone.start,
        end: occurrence.displayTimezone.end,
        collectionStart: presetConfig.start,
        collectionEnd: presetConfig.end,
      });
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
      const point = resolver.getEdgePoint({ rowIndex, occurrence }, 'end');
      const visible =
        hoveredOccurrenceKey === occurrence.key ||
        creation?.sourceOccurrenceKey === occurrence.key;
      terminals.push(
        <EventTimelinePremiumDependencyTerminal
          key={occurrence.key}
          eventId={occurrence.id}
          occurrenceKey={occurrence.key}
          data-palette={schedulerEventSelectors.color(store.state, occurrence.id)}
          data-visible={visible ? '' : undefined}
          style={{ left: point.x, top: point.y - offsetTop }}
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
