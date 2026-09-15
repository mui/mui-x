import type { Adapter } from '@mui/x-scheduler-internals/use-adapter';
import type {
  SchedulerEventId,
  SchedulerEventOccurrence,
  SchedulerResource,
  SchedulerResourceId,
} from '@mui/x-scheduler-internals/models';
import {
  computeElementPositionInCollection,
  getTimelineAxisDurationMs,
} from '@mui/x-scheduler-internals/internals';
import type { TimelineAxis } from '@mui/x-scheduler-internals/internals';
import { computeOccurrencesFirstIndexLookup } from '@mui/x-scheduler-internals/use-event-occurrences-with-timeline-position';
import type { EventsCellLaneMetrics } from '../rowGeometry';

/**
 * Vertical clearance between the edge of the source event and the detour a route runs
 * along it.
 */
const DEPENDENCY_ARROW_DETOUR_CLEARANCE = 6;

export interface DependencyArrowPoint {
  x: number;
  y: number;
}

export interface DependencyArrowAnchor {
  rowIndex: number;
  /**
   * The resource of the row: the appearance identity, since the occurrence (and its
   * key) repeats on every row of a multi-resource event.
   */
  resourceId: SchedulerResourceId;
  occurrence: SchedulerEventOccurrence;
}

export interface DependencyArrowObstacle {
  occurrenceKey: string;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

export interface DependencyAnchorResolverParameters {
  adapter: Adapter;
  /**
   * The visible resources with their occurrences, in row render order.
   */
  resources: readonly { resource: SchedulerResource; occurrences: SchedulerEventOccurrence[] }[];
  /**
   * The y offset of each row in pixels, in the same order as `resources`.
   */
  rowPositions: readonly number[];
  /**
   * The visible date range and daily hour window the arrows are positioned in.
   */
  axis: TimelineAxis;
  /**
   * Positions already computed by the axis filter, when the hour window is trimmed.
   */
  positionByOccurrenceKey?: ReadonlyMap<
    string,
    ReturnType<typeof computeElementPositionInCollection>
  > | null;
  /**
   * The width of the events area in pixels (tick count × tick width).
   */
  eventsWidth: number;
  laneMetrics: EventsCellLaneMetrics;
  /**
   * When provided, the appearance lookup only indexes these events (the dependency
   * endpoints) on its single build pass; any other id — the in-flight creation's
   * events — falls back to a targeted scan cached per id. Without it every occurrence
   * gets an entry, which is pure allocation waste on large collections.
   */
  endpointIds?: ReadonlySet<SchedulerEventId>;
}

export interface DependencyAnchorResolver {
  eventsWidth: number;
  /**
   * How far from the source anchor a route runs its horizontal detour.
   */
  detourOffset: number;
  /**
   * The row appearances of an event. An event assigned to several resources appears
   * once in each of its rows.
   */
  getAppearances: (eventId: SchedulerEventId) => readonly DependencyArrowAnchor[];
  /**
   * Whether the row is laid out and can anchor an arrow. A row can briefly have no
   * position when the resources change before the virtualizer re-measures them.
   */
  hasRowPosition: (rowIndex: number) => boolean;
  /**
   * The pixel point of an anchor's start or end edge, vertically centered on its lane.
   */
  getEdgePoint: (anchor: DependencyArrowAnchor, edge: 'start' | 'end') => DependencyArrowPoint;
  /**
   * The cached position of an occurrence in the collection (fractions and edge
   * overflow flags), shared with the terminals overlay.
   */
  getPosition: (
    occurrence: SchedulerEventOccurrence,
  ) => ReturnType<typeof computeElementPositionInCollection>;
  /**
   * The event boxes of a row, used to pick the elbow candidate crossing the fewest
   * events.
   */
  getRowObstacles: (rowIndex: number) => DependencyArrowObstacle[];
}

/**
 * Creates the anchor machinery shared by the dependency arrows and the provisional
 * (rubber-band) arrow. Anchors are derived from the data model (not measured on the
 * DOM) so arrows can reach events that the virtualizer did not mount.
 * Lookups are cached per instance: recreate the resolver when any parameter changes.
 */
export function createDependencyAnchorResolver(
  parameters: DependencyAnchorResolverParameters,
): DependencyAnchorResolver {
  const {
    adapter,
    resources,
    rowPositions,
    axis,
    positionByOccurrenceKey,
    eventsWidth,
    laneMetrics,
    endpointIds,
  } = parameters;

  // Built on first access with a single pass over the rendered occurrences, only
  // indexing the endpoint events when the filter is provided.
  let appearancesLookup: Map<SchedulerEventId, DependencyArrowAnchor[]> | null = null;
  const getAppearances = (eventId: SchedulerEventId): readonly DependencyArrowAnchor[] => {
    if (appearancesLookup == null) {
      appearancesLookup = new Map();
      for (let rowIndex = 0; rowIndex < resources.length; rowIndex += 1) {
        for (const occurrence of resources[rowIndex].occurrences) {
          if (endpointIds !== undefined && !endpointIds.has(occurrence.id)) {
            continue;
          }
          const anchor = { rowIndex, resourceId: resources[rowIndex].resource.id, occurrence };
          const appearances = appearancesLookup.get(occurrence.id);
          if (appearances) {
            appearances.push(anchor);
          } else {
            appearancesLookup.set(occurrence.id, [anchor]);
          }
        }
      }
    }
    let appearances = appearancesLookup.get(eventId);
    if (appearances == null && endpointIds !== undefined && !endpointIds.has(eventId)) {
      // An id the build pass skipped (the in-flight creation's events): targeted
      // scan, cached — including the empty result.
      appearances = [];
      for (let rowIndex = 0; rowIndex < resources.length; rowIndex += 1) {
        for (const occurrence of resources[rowIndex].occurrences) {
          if (occurrence.id === eventId) {
            appearances.push({ rowIndex, resourceId: resources[rowIndex].resource.id, occurrence });
          }
        }
      }
      appearancesLookup.set(eventId, appearances);
    }
    return appearances ?? [];
  };

  // Lane assignment of a row, computed on demand and only once per involved row.
  const laneLookupByRow = new Map<number, { [occurrenceKey: string]: number }>();
  const getLaneLookup = (rowIndex: number): { [occurrenceKey: string]: number } => {
    let laneLookup = laneLookupByRow.get(rowIndex);
    if (laneLookup == null) {
      laneLookup = computeOccurrencesFirstIndexLookup(resources[rowIndex].occurrences);
      laneLookupByRow.set(rowIndex, laneLookup);
    }
    return laneLookup;
  };

  // Derived once for the whole walk instead of per positioned occurrence.
  const axisDurationMs = getTimelineAxisDurationMs(adapter, axis);
  const positionCache = new Map<string, ReturnType<typeof computeElementPositionInCollection>>();
  const getPosition = (occurrence: SchedulerEventOccurrence) => {
    const precomputed = positionByOccurrenceKey?.get(occurrence.key);
    if (precomputed != null) {
      return precomputed;
    }
    let position = positionCache.get(occurrence.key);
    if (position == null) {
      position = computeElementPositionInCollection(adapter, {
        start: occurrence.displayTimezone.start,
        end: occurrence.displayTimezone.end,
        collection: axis,
        durationMs: axisDurationMs,
      });
      positionCache.set(occurrence.key, position);
    }
    return position;
  };

  const laneStep = laneMetrics.laneMinHeight + laneMetrics.laneGap;
  const getLaneTop = (rowIndex: number, lane: number): number =>
    rowPositions[rowIndex] + laneMetrics.topPadding + (lane - 1) * laneStep;

  const getEdgePoint = (
    anchor: DependencyArrowAnchor,
    edge: 'start' | 'end',
  ): DependencyArrowPoint => {
    const position = getPosition(anchor.occurrence);
    const xFraction = edge === 'start' ? position.position : position.position + position.duration;
    return {
      x: xFraction * eventsWidth,
      y:
        getLaneTop(anchor.rowIndex, getLaneLookup(anchor.rowIndex)[anchor.occurrence.key]) +
        laneMetrics.laneMinHeight / 2,
    };
  };

  // The event boxes of a row, computed on demand and only once per row an arrow spans.
  const obstaclesByRow = new Map<number, DependencyArrowObstacle[]>();
  const getRowObstacles = (rowIndex: number): DependencyArrowObstacle[] => {
    let obstacles = obstaclesByRow.get(rowIndex);
    if (obstacles == null) {
      const laneLookup = getLaneLookup(rowIndex);
      obstacles = resources[rowIndex].occurrences.map((occurrence) => {
        const position = getPosition(occurrence);
        const laneTop = getLaneTop(rowIndex, laneLookup[occurrence.key]);
        return {
          occurrenceKey: occurrence.key,
          x1: position.position * eventsWidth,
          x2: (position.position + position.duration) * eventsWidth,
          y1: laneTop,
          y2: laneTop + laneMetrics.laneMinHeight,
        };
      });
      obstaclesByRow.set(rowIndex, obstacles);
    }
    return obstacles;
  };

  return {
    eventsWidth,
    detourOffset: laneMetrics.laneMinHeight / 2 + DEPENDENCY_ARROW_DETOUR_CLEARANCE,
    getAppearances,
    getPosition,
    hasRowPosition: (rowIndex: number) => rowPositions[rowIndex] != null,
    getEdgePoint,
    getRowObstacles,
  };
}

/**
 * The pixel point of an event edge, used to anchor the provisional (rubber-band)
 * arrow. Anchors on the appearance matching the occurrence key and the resource (the
 * key alone repeats on every row of a multi-resource event), falling back to the
 * event's first appearance when they are `null` or unknown. `null` when the anchoring
 * appearance's row is not laid out.
 */
export function getEventEdgeAnchor(
  resolver: DependencyAnchorResolver,
  eventId: SchedulerEventId,
  edge: 'start' | 'end',
  occurrenceKey: string | null = null,
  resourceId: SchedulerResourceId | null = null,
): DependencyArrowPoint | null {
  const appearances = resolver.getAppearances(eventId);
  const anchor =
    appearances.find(
      (appearance) =>
        appearance.occurrence.key === occurrenceKey &&
        (resourceId === null || appearance.resourceId === resourceId),
    ) ?? appearances[0];
  if (anchor == null || !resolver.hasRowPosition(anchor.rowIndex)) {
    return null;
  }
  return resolver.getEdgePoint(anchor, edge);
}
