import type { Adapter } from '@mui/x-scheduler-internals/use-adapter';
import type {
  SchedulerEventId,
  SchedulerEventOccurrence,
  SchedulerProcessedEvent,
  SchedulerResource,
  SchedulerResourceId,
} from '@mui/x-scheduler-internals/models';
import {
  computeElementPositionInCollection,
  getEventResourceIds,
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

/**
 * Stands in for an event outside the visible date range: its arrows reach the timeline
 * edge on the event's side, on the event's row.
 */
export interface DependencyArrowOffRangeAnchor {
  rowIndex: number;
  resourceId: SchedulerResourceId;
  occurrence: null;
  side: 'before' | 'after';
}

export type DependencyArrowEndpoint = DependencyArrowAnchor | DependencyArrowOffRangeAnchor;

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
  durationMs: number;
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
   * The loaded events, used to anchor the endpoints outside the visible range.
   */
  processedEventLookup: ReadonlyMap<SchedulerEventId, SchedulerProcessedEvent>;
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
   * The anchors of an event outside the visible range, one per row of its resources.
   * Empty when the event is not loaded, is in the range, or none of its rows is shown.
   */
  getOffRangeAnchors: (eventId: SchedulerEventId) => readonly DependencyArrowOffRangeAnchor[];
  /**
   * Whether the row is laid out and can anchor an arrow. A row can briefly have no
   * position when the resources change before the virtualizer re-measures them.
   */
  hasRowPosition: (rowIndex: number) => boolean;
  /**
   * The pixel point of an anchor's start or end edge, vertically centered on its lane.
   * An off-range anchor sits on the timeline edge, at the height of the first lane.
   */
  getEdgePoint: (anchor: DependencyArrowEndpoint, edge: 'start' | 'end') => DependencyArrowPoint;
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
    durationMs,
    positionByOccurrenceKey,
    eventsWidth,
    laneMetrics,
    processedEventLookup,
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

  let rowIndexByResourceId: Map<SchedulerResourceId, number> | null = null;
  const offRangeAnchorsLookup = new Map<SchedulerEventId, DependencyArrowOffRangeAnchor[]>();
  const computeOffRangeAnchors = (eventId: SchedulerEventId): DependencyArrowOffRangeAnchor[] => {
    const event = processedEventLookup.get(eventId);
    if (event == null) {
      return [];
    }
    // Placed on the axis rather than compared with its bounds: the bounds are midnights,
    // so the hours the window hides at the start of the first day and the end of the
    // last day also come before or after what is on screen.
    const position = computeElementPositionInCollection(adapter, {
      start: event.displayTimezone.start,
      end: event.displayTimezone.end,
      collection: axis,
      durationMs,
    });
    let side: DependencyArrowOffRangeAnchor['side'];
    if (position.duration > 0) {
      // On screen, but not rendered in any row.
      return [];
    }
    if (position.position === 0) {
      side = 'before';
    } else if (position.position === 1) {
      side = 'after';
    } else {
      // Hidden by the hour window between two visible days.
      return [];
    }
    if (rowIndexByResourceId == null) {
      rowIndexByResourceId = new Map(resources.map((entry, index) => [entry.resource.id, index]));
    }
    const anchors: DependencyArrowOffRangeAnchor[] = [];
    for (const resourceId of getEventResourceIds(event.resource)) {
      const rowIndex = rowIndexByResourceId.get(resourceId);
      if (rowIndex !== undefined) {
        anchors.push({ rowIndex, resourceId, occurrence: null, side });
      }
    }
    return anchors;
  };

  const getOffRangeAnchors = (
    eventId: SchedulerEventId,
  ): readonly DependencyArrowOffRangeAnchor[] => {
    let anchors = offRangeAnchorsLookup.get(eventId);
    if (anchors == null) {
      anchors = computeOffRangeAnchors(eventId);
      offRangeAnchorsLookup.set(eventId, anchors);
    }
    return anchors;
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
        durationMs,
      });
      positionCache.set(occurrence.key, position);
    }
    return position;
  };

  const laneStep = laneMetrics.laneMinHeight + laneMetrics.laneGap;
  const getLaneTop = (rowIndex: number, lane: number): number =>
    rowPositions[rowIndex] + laneMetrics.topPadding + (lane - 1) * laneStep;

  const getEdgePoint = (
    anchor: DependencyArrowEndpoint,
    edge: 'start' | 'end',
  ): DependencyArrowPoint => {
    if (anchor.occurrence === null) {
      return {
        x: anchor.side === 'before' ? 0 : eventsWidth,
        y: getLaneTop(anchor.rowIndex, 1) + laneMetrics.laneMinHeight / 2,
      };
    }
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
    getOffRangeAnchors,
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
