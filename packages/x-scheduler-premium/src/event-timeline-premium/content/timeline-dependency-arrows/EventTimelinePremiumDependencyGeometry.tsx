'use client';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import { Dimensions, Virtualization } from '@mui/x-virtualizer';
import { useAdapterContext } from '@mui/x-scheduler-internals/use-adapter-context';
import { schedulerOccurrenceSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import type {
  SchedulerEventId,
  SchedulerEventOccurrence,
  SchedulerResource,
} from '@mui/x-scheduler-internals/models';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium-store-context';
import {
  eventTimelinePremiumDependencySelectors,
  eventTimelinePremiumPresetSelectors,
} from '@mui/x-scheduler-internals-premium/event-timeline-premium-selectors';
import type { SchedulerDependencyId } from '@mui/x-scheduler-internals-premium/models';
import { useEventTimelinePremiumVirtualizerStore } from '../EventTimelinePremiumVirtualizerContext';
import { getEventsCellLaneMetrics } from '../rowGeometry';
import { getVisibleFractionRange } from '../getVisibleFractionRange';
import type { DependencyAnchorResolver, DependencyArrow } from './dependencyArrowGeometry';
import {
  computeDependencyArrows,
  createDependencyAnchorResolver,
} from './dependencyArrowGeometry';

export interface EventTimelinePremiumDependencyGeometryValue {
  resolver: DependencyAnchorResolver;
  /**
   * The arrows intersecting the visible range, the selected one last so its highlight
   * is never covered by a sibling.
   */
  visibleArrows: DependencyArrow[];
  selectedId: SchedulerDependencyId | null;
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
 * subscribed to the creation gesture: only the layers following the cursor pay for
 * its per-frame updates.
 */
export function EventTimelinePremiumDependencyGeometryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const adapter = useAdapterContext();
  const theme = useTheme();
  const store = useEventTimelinePremiumStoreContext();
  const virtualizerStore = useEventTimelinePremiumVirtualizerStore();

  const presetConfig = useStore(store, eventTimelinePremiumPresetSelectors.config);
  const selectedId = useStore(store, eventTimelinePremiumDependencySelectors.selectedId);
  const dependencies = useStore(store, eventTimelinePremiumDependencySelectors.activeModelList);
  const resources = useStore(
    store,
    schedulerOccurrenceSelectors.groupedByResourceList,
    presetConfig.start,
    presetConfig.end,
  );
  const rowsMeta = virtualizerStore.use(Dimensions.selectors.rowsMeta);
  const renderContext = virtualizerStore.use(Virtualization.selectors.renderContext);

  const eventsWidth = presetConfig.tickCount * presetConfig.tickWidth;

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
        collectionStart: presetConfig.start,
        collectionEnd: presetConfig.end,
        eventsWidth,
        laneMetrics: getEventsCellLaneMetrics(theme),
        endpointIds,
      }),
    [
      adapter,
      resources,
      rowsMeta.positions,
      presetConfig.start,
      presetConfig.end,
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

    const offsetTop = rowsMeta.positions[renderContext.firstRowIndex] ?? 0;
    const height = rowsMeta.currentPageTotalHeight - offsetTop;

    return {
      resolver,
      visibleArrows,
      selectedId,
      eventsWidth,
      offsetTop,
      height,
      visibleStartFraction,
      visibleEndFraction,
      firstRowIndex: renderContext.firstRowIndex,
      lastRowIndex: renderContext.lastRowIndex,
      resources,
    };
  }, [
    arrows,
    resolver,
    selectedId,
    eventsWidth,
    renderContext,
    rowsMeta,
    presetConfig.tickCount,
    resources,
  ]);

  return (
    <EventTimelinePremiumDependencyGeometryContext.Provider value={value}>
      {children}
    </EventTimelinePremiumDependencyGeometryContext.Provider>
  );
}
