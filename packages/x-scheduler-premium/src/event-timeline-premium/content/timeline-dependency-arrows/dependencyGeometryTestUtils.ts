import { adapter, EventBuilder, ResourceBuilder } from 'test/utils/scheduler';
import type { SchedulerProcessedEvent } from '@mui/x-scheduler-internals/models';
import { getOccurrencesFromEvents } from '@mui/x-scheduler-internals/internals';
import type { TimelineAxis } from '@mui/x-scheduler-internals/internals';
import type {
  SchedulerDependency,
  SchedulerDependencyType,
} from '@mui/x-scheduler-internals-premium/models';
import { createDependencyAnchorResolver } from './dependencyAnchorResolver';

// Shared by the anchor resolver and the arrow geometry tests.

export const collectionStart = adapter.date('2024-01-15', 'default');
export const collectionEnd = adapter.endOfDay(collectionStart);
export const FULL_DAY_AXIS: TimelineAxis = {
  start: collectionStart,
  end: collectionEnd,
  dayStartMinute: 0,
  dayEndMinute: 1440,
};

// 1440 minutes in the collection and eventsWidth = 1440 → 1px per minute.
export const EVENTS_WIDTH = 1440;
export const LANE_METRICS = { topPadding: 16, laneMinHeight: 30, laneGap: 4 };
// One-lane rows: the anchor sits at rowPosition + topPadding + laneMinHeight / 2.
export const LANE_1_CENTER = LANE_METRICS.topPadding + LANE_METRICS.laneMinHeight / 2;

export const RESOURCE_1 = ResourceBuilder.new().id('r1').title('Resource 1').build();
export const RESOURCE_2 = ResourceBuilder.new().id('r2').title('Resource 2').build();

// 10:00–12:00 UTC → x 600 to 720. 13:00–14:00 UTC → x 780 to 840.
export const eventA = EventBuilder.new()
  .id('event-a')
  .singleDay('2024-01-15T10:00:00Z', 120)
  .toProcessed();
export const eventB = EventBuilder.new()
  .id('event-b')
  .singleDay('2024-01-15T13:00:00Z')
  .toProcessed();

export function getOccurrences(events: SchedulerProcessedEvent[]) {
  return getOccurrencesFromEvents({
    adapter,
    start: collectionStart,
    end: collectionEnd,
    events,
    displayTimezone: 'default',
    visibleResources: {},
    recurringEventsPlugin: null,
  });
}

export function buildDependency(
  id: string,
  source: string,
  target: string,
  type: SchedulerDependencyType = 'FinishToStart',
): SchedulerDependency {
  return { id, source, target, type };
}

type ResolverParameters = Parameters<typeof createDependencyAnchorResolver>[0];

export function buildResolver(parameters: {
  resources: ResolverParameters['resources'];
  rowPositions: readonly number[];
  axis?: TimelineAxis;
  eventsWidth?: number;
  positionByOccurrenceKey?: ResolverParameters['positionByOccurrenceKey'];
  endpointIds?: ResolverParameters['endpointIds'];
}) {
  return createDependencyAnchorResolver({
    adapter,
    resources: parameters.resources,
    rowPositions: parameters.rowPositions,
    axis: parameters.axis ?? FULL_DAY_AXIS,
    positionByOccurrenceKey: parameters.positionByOccurrenceKey,
    eventsWidth: parameters.eventsWidth ?? EVENTS_WIDTH,
    laneMetrics: LANE_METRICS,
    endpointIds: parameters.endpointIds,
  });
}
