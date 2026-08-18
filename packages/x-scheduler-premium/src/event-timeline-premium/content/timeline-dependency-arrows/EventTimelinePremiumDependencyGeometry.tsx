'use client';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import { Dimensions, Virtualization } from '@mui/x-virtualizer';
import { useAdapterContext } from '@mui/x-scheduler-internals/use-adapter-context';
import type {
  SchedulerEventId,
  SchedulerEventOccurrence,
  SchedulerResource,
} from '@mui/x-scheduler-internals/models';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium-store-context';
import {
  eventTimelinePremiumDependencySelectors,
  eventTimelinePremiumOccurrenceSelectors,
  eventTimelinePremiumPresetSelectors,
} from '@mui/x-scheduler-internals-premium/event-timeline-premium-selectors';
import type { SchedulerDependencyId } from '@mui/x-scheduler-internals-premium/models';
import { useEventTimelinePremiumVirtualizerStore } from '../EventTimelinePremiumVirtualizerContext';
import { getEventsCellLaneMetrics } from '../rowGeometry';
import { getVisibleFractionRange } from '../getVisibleFractionRange';
import type { DependencyAnchorResolver, DependencyArrow } from './dependencyArrowGeometry';
import { computeDependencyArrows, createDependencyAnchorResolver } from './dependencyArrowGeometry';

export interface EventTimelinePremiumDependencyGeometryValue {
  resolver: DependencyAnchorResolver;
  /**
   * The arrows intersecting the visible range. Selection-agnostic (the provider does
   * not subscribe to the selection): the layers highlighting the selected arrow order
   * it last themselves, through `orderArrowsWithSelectedLast`.
   */
  visibleArrows: DependencyArrow[];
  eventsWidth: number;
  /**
   * The y of the first rendered row: the overlays' y = 0 in absolute row-space.
   */
  offsetTop: number;
  height: number;
  visibleStartFraction: number;
  visibleEndFraction: number;
  firstRowIndex: number;
  lastRowIndex: number;
  resources: readonly { resource: SchedulerResource; occurrences: SchedulerEventOccurrence[] }[];
}

const EventTimelinePremiumDependencyGeometryContext =
  React.createContext<EventTimelinePremiumDependencyGeometryValue | null>(null);

/**
 * The visible arrows with the selected one last, so its highlight (and its hit area)
 * is never covered by a sibling. Returns the input array when nothing is selected.
 */
export function orderArrowsWithSelectedLast(
  arrows: DependencyArrow[],
  selectedId: SchedulerDependencyId | null,
): DependencyArrow[] {
  if (selectedId === null || !arrows.some((arrow) => arrow.id === selectedId)) {
    return arrows;
  }
  return arrows.toSorted((a, b) => Number(a.id === selectedId) - Number(b.id === selectedId));
}

export function useDependencyGeometry(): EventTimelinePremiumDependencyGeometryValue {
  const value = React.useContext(EventTimelinePremiumDependencyGeometryContext);
  if (value === null) {
    throw /* minify-error-disabled */ new Error(
      'MUI X Scheduler: useDependencyGeometry requires <EventTimelinePremiumDependencyGeometryProvider /> as an ancestor.',
    );
  }
  return value;
}

/**
 * Computes the dependency geometry once and shares it with the three overlays (visual
 * arrows, terminals, interactions), which would otherwise each run the resolver and
 * the routing on every render of their own. Renders no DOM. Deliberately not
 * subscribed to the creation gesture: only the layers drawing it pay for its
 * start/snap/end updates.
 * Pass-through when the dependencies feature is disabled: the overlays return null
 * before reading the context, and the timeline must not pay the provider's scroll and
 * rows-meta subscriptions for a feature it does not use.
 */
export function EventTimelinePremiumDependencyGeometryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = useEventTimelinePremiumStoreContext();
  const enabled = useStore(store, eventTimelinePremiumDependencySelectors.enabled);

  if (!enabled) {
    return children;
  }

  return (
    <EventTimelinePremiumDependencyGeometryProviderImpl>
      {children}
    </EventTimelinePremiumDependencyGeometryProviderImpl>
  );
}

function EventTimelinePremiumDependencyGeometryProviderImpl({
  children,
}: {
  children: React.ReactNode;
}) {
  const adapter = useAdapterContext();
  const theme = useTheme();
  const store = useEventTimelinePremiumStoreContext();
  const virtualizerStore = useEventTimelinePremiumVirtualizerStore();

  const config = useStore(store, eventTimelinePremiumPresetSelectors.config);
  const dependencies = useStore(store, eventTimelinePremiumDependencySelectors.activeModelList);
  // Keep the lane assignment consistent with the rendered rows, which exclude the
  // occurrences hidden by the preset's hour window.
  const resources = useStore(
    store,
    eventTimelinePremiumOccurrenceSelectors.visibleGroupedByResourceLayout,
  );
  const positionByOccurrenceKey = useStore(
    store,
    eventTimelinePremiumOccurrenceSelectors.visiblePositionByOccurrenceKey,
  );
  const rowsMeta = virtualizerStore.use(Dimensions.selectors.rowsMeta);
  const renderContext = virtualizerStore.use(Virtualization.selectors.renderContext);

  const eventsWidth = config.tickCount * config.tickWidth;

  const endpointIds = React.useMemo(() => {
    const ids = new Set<SchedulerEventId>();
    for (const dependency of dependencies) {
      ids.add(dependency.source);
      ids.add(dependency.target);
    }
    return ids;
  }, [dependencies]);

  const resolver = React.useMemo(
    () =>
      createDependencyAnchorResolver({
        adapter,
        resources,
        rowPositions: rowsMeta.positions,
        axis: config,
        positionByOccurrenceKey,
        eventsWidth,
        laneMetrics: getEventsCellLaneMetrics(theme),
        endpointIds,
      }),
    // The config selector is memoized, so the object identity only changes with its content.
    [
      adapter,
      resources,
      positionByOccurrenceKey,
      rowsMeta.positions,
      config,
      eventsWidth,
      theme,
      endpointIds,
    ],
  );

  const arrows = React.useMemo(
    () => computeDependencyArrows(resolver, dependencies),
    [resolver, dependencies],
  );

  const value: EventTimelinePremiumDependencyGeometryValue = React.useMemo(() => {
    // Only the arrows intersecting the visible range render. Row-range overlap
    // (rather than endpoint visibility) keeps an arrow whose vertical segment crosses
    // the viewport even when both of its endpoints are scrolled out.
    const { start: visibleStartFraction, end: visibleEndFraction } = getVisibleFractionRange(
      renderContext,
      config.tickCount,
    );
    const visibleArrows = arrows.filter(
      (arrow) =>
        arrow.maxXFraction > visibleStartFraction &&
        arrow.minXFraction < visibleEndFraction &&
        arrow.maxRowIndex >= renderContext.firstRowIndex &&
        arrow.minRowIndex <= renderContext.lastRowIndex,
    );

    const offsetTop = rowsMeta.positions[renderContext.firstRowIndex] ?? 0;
    const height = rowsMeta.currentPageTotalHeight - offsetTop;

    return {
      resolver,
      visibleArrows,
      eventsWidth,
      offsetTop,
      height,
      visibleStartFraction,
      visibleEndFraction,
      firstRowIndex: renderContext.firstRowIndex,
      lastRowIndex: renderContext.lastRowIndex,
      resources,
    };
  }, [arrows, resolver, eventsWidth, renderContext, rowsMeta, config.tickCount, resources]);

  return (
    <EventTimelinePremiumDependencyGeometryContext.Provider value={value}>
      {children}
    </EventTimelinePremiumDependencyGeometryContext.Provider>
  );
}
