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
import type {
  SchedulerDependency,
  SchedulerDependencyId,
} from '@mui/x-scheduler-internals-premium/models';
import type { EventsCellLaneMetrics } from '../rowGeometry';

/**
 * Minimum horizontal segment when leaving the predecessor's end edge and when
 * entering the successor's start edge.
 */
const DEPENDENCY_ARROW_STUB = 8;
/**
 * Radius used to soften the corners of the orthogonal route.
 */
const DEPENDENCY_ARROW_CORNER_RADIUS = 4;
/**
 * Size of the arrowhead marker at the successor's start edge.
 */
export const DEPENDENCY_ARROWHEAD_SIZE = 7;
/**
 * Minimum length of the final segment entering the target: the softened corner plus the
 * arrowhead must fit on it, otherwise the arrowhead overlaps the curve.
 */
const DEPENDENCY_ARROW_TARGET_CLEARANCE =
  DEPENDENCY_ARROW_CORNER_RADIUS + DEPENDENCY_ARROWHEAD_SIZE + 1;
/**
 * Vertical clearance between the edge of the source event and the S route detour that
 * hugs it.
 */
const DEPENDENCY_ARROW_DETOUR_CLEARANCE = 6;
/**
 * How much the click hit-area is trimmed at the arrow's source end, so the pointer
 * near the anchor reaches the dependency terminal (the drag handle) instead of
 * selecting the arrow. A best-effort budget, not a guarantee: trims cap at half of
 * their segment, so short first segments (the 8px stubs) keep less clearance, and on
 * a single-segment route both trims scale down together.
 */
const DEPENDENCY_ARROW_HIT_TRIM_START = 12;
/**
 * Trim at the target end, freeing the start-edge resize handle under the arrowhead.
 */
const DEPENDENCY_ARROW_HIT_TRIM_END = 8;
/**
 * Minimum clickable stretch a trimmed single-segment route keeps in its middle.
 */
const DEPENDENCY_ARROW_HIT_MIN_LENGTH = 6;
/**
 * Stroke width of the invisible path capturing the pointer around each arrow, defined
 * here because the geometry derives the obstacle clearance from it.
 */
export const DEPENDENCY_ARROW_HIT_STROKE_WIDTH = 10;
/**
 * How far the hit-area stops before an event box the route crosses: half the stroke,
 * so the band never covers any part of the event.
 */
const DEPENDENCY_ARROW_HIT_CLEARANCE = DEPENDENCY_ARROW_HIT_STROKE_WIDTH / 2;

export interface DependencyArrowPoint {
  x: number;
  y: number;
}

export interface DependencyArrow {
  /**
   * Unique key of the arrow: a dependency renders one arrow per pair of row
   * appearances of its events.
   */
  key: string;
  id: SchedulerDependencyId;
  /**
   * The SVG path of the arrow, in absolute row-space pixels (y = 0 is the top of the
   * first row), so it does not depend on the scroll position.
   */
  d: string;
  /**
   * The path of the invisible click hit-area: the same route with both ends trimmed,
   * so the terminal (at the source anchor) and the start resize handle (under the
   * arrowhead) stay reachable.
   */
  hitD: string;
  /**
   * The point where the arrowhead is drawn, in the same coordinate space as `d`: the
   * target's start-edge anchor, except when the route clamps at the timeline edge.
   */
  endPoint: DependencyArrowPoint;
  /**
   * Horizontal bounding box of the arrow, as fractions of the events area width.
   */
  minXFraction: number;
  maxXFraction: number;
  /**
   * Vertical bounding box of the arrow, as row indexes.
   */
  minRowIndex: number;
  maxRowIndex: number;
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
   * How far from the source anchor the S route runs its horizontal detour.
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
      laneLookup = computeOccurrencesFirstIndexLookup(adapter, resources[rowIndex].occurrences);
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

/**
 * Computes the arrow of each renderable dependency, connecting the end edge of the
 * source event to the start edge of the target event.
 */
export function computeDependencyArrows(
  resolver: DependencyAnchorResolver,
  dependencies: readonly SchedulerDependency[],
): DependencyArrow[] {
  const { eventsWidth } = resolver;

  if (dependencies.length === 0 || eventsWidth <= 0) {
    return [];
  }

  const buildArrow = (
    dependency: SchedulerDependency,
    sourceAnchor: DependencyArrowAnchor,
    targetAnchor: DependencyArrowAnchor,
  ): DependencyArrow | null => {
    if (
      !resolver.hasRowPosition(sourceAnchor.rowIndex) ||
      !resolver.hasRowPosition(targetAnchor.rowIndex)
    ) {
      return null;
    }

    const minRowIndex = Math.min(sourceAnchor.rowIndex, targetAnchor.rowIndex);
    const maxRowIndex = Math.max(sourceAnchor.rowIndex, targetAnchor.rowIndex);
    const source = resolver.getEdgePoint(sourceAnchor, 'end');
    const target = resolver.getEdgePoint(targetAnchor, 'start');

    const routes = buildDependencyArrowRoutes(source, target, resolver.detourOffset, eventsWidth);

    // The event boxes the route may cross, used to pick the route and to cut the
    // hit-area around them. The endpoint events stay out: the end trims already
    // handle their edges.
    const obstacles: DependencyArrowObstacle[] = [];
    for (let rowIndex = minRowIndex; rowIndex <= maxRowIndex; rowIndex += 1) {
      for (const obstacle of resolver.getRowObstacles(rowIndex)) {
        if (
          obstacle.occurrenceKey !== sourceAnchor.occurrence.key &&
          obstacle.occurrenceKey !== targetAnchor.occurrence.key
        ) {
          obstacles.push(obstacle);
        }
      }
    }

    // With several candidates, keep the one crossing the fewest events (first wins on
    // a tie). Best-effort avoidance, not full pathfinding.
    let points = routes[0];
    if (routes.length > 1) {
      let bestCollisions = countRouteCollisions(points, obstacles);
      for (let index = 1; index < routes.length && bestCollisions > 0; index += 1) {
        const collisions = countRouteCollisions(routes[index], obstacles);
        if (collisions < bestCollisions) {
          bestCollisions = collisions;
          points = routes[index];
        }
      }
    }

    let minX = Infinity;
    let maxX = -Infinity;
    for (const point of points) {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
    }

    return {
      key: `${String(dependency.id)}:${sourceAnchor.rowIndex}:${targetAnchor.rowIndex}`,
      id: dependency.id,
      d: buildRoundedOrthogonalPath(points, DEPENDENCY_ARROW_CORNER_RADIUS),
      hitD: clipRouteAroundObstacles(
        trimRouteEnds(points, DEPENDENCY_ARROW_HIT_TRIM_START, DEPENDENCY_ARROW_HIT_TRIM_END),
        obstacles,
      )
        .map((polyline) => buildRoundedOrthogonalPath(polyline, DEPENDENCY_ARROW_CORNER_RADIUS))
        .filter((subpath) => subpath !== '')
        .join(' '),
      endPoint: points[points.length - 1],
      minXFraction: minX / eventsWidth,
      maxXFraction: maxX / eventsWidth,
      minRowIndex,
      maxRowIndex,
    };
  };

  const arrows: DependencyArrow[] = [];
  for (const dependency of dependencies) {
    const sourceAnchors = resolver.getAppearances(dependency.source);
    const targetAnchors = resolver.getAppearances(dependency.target);

    // An endpoint without an anchor is not rendered in the timeline: its event has no
    // resource, is outside the collection range, or its row is hidden. The dependency
    // stays in the data, it just has no arrow.
    if (sourceAnchors.length === 0 || targetAnchors.length === 0) {
      continue;
    }

    // One arrow per pair of appearances: an event assigned to several resources shows
    // the dependency in each of its rows.
    for (const sourceAnchor of sourceAnchors) {
      for (const targetAnchor of targetAnchors) {
        const arrow = buildArrow(dependency, sourceAnchor, targetAnchor);
        if (arrow != null) {
          arrows.push(arrow);
        }
      }
    }
  }

  return arrows;
}

function movePointAlongSegment(
  from: DependencyArrowPoint,
  toward: DependencyArrowPoint,
  distance: number,
): DependencyArrowPoint {
  const length = Math.hypot(toward.x - from.x, toward.y - from.y);
  // Cap at half the segment so both trims never cross each other.
  const cappedDistance = Math.min(distance, length / 2);
  if (length === 0) {
    return from;
  }
  return {
    x: from.x + ((toward.x - from.x) / length) * cappedDistance,
    y: from.y + ((toward.y - from.y) / length) * cappedDistance,
  };
}

/**
 * Splits an orthogonal route into the stretches that do not ride over an event box,
 * so the events a route crosses keep their clicks and drags (the hit band would
 * otherwise capture the pointerdown and the event's draggable could never start).
 * Boxes are expanded by half the hit stroke, stopping the band right before it would
 * visually reach an event. When the boxes cover the whole route, the uncut route is
 * returned instead: an overlapped band beats an unselectable arrow.
 */
function clipRouteAroundObstacles(
  points: readonly DependencyArrowPoint[],
  obstacles: readonly DependencyArrowObstacle[],
): DependencyArrowPoint[][] {
  if (obstacles.length === 0 || points.length < 2) {
    return [[...points]];
  }

  const EPSILON = 1e-6;
  const polylines: DependencyArrowPoint[][] = [];
  // The polyline being accumulated across segments, or `null` right after a covered
  // stretch cut the route.
  let current: DependencyArrowPoint[] | null = [points[0]];
  const closeCurrent = () => {
    if (current !== null && current.length >= 2) {
      polylines.push(current);
    }
    current = null;
  };

  for (let index = 0; index < points.length - 1; index += 1) {
    const from = points[index];
    const to = points[index + 1];
    const horizontal = from.y === to.y;
    const delta = horizontal ? to.x - from.x : to.y - from.y;
    if (Math.abs(delta) <= EPSILON) {
      continue;
    }

    // Covered sub-intervals of the segment, as fractions of its length.
    const covered: Array<[number, number]> = [];
    for (const obstacle of obstacles) {
      const x1 = obstacle.x1 - DEPENDENCY_ARROW_HIT_CLEARANCE;
      const x2 = obstacle.x2 + DEPENDENCY_ARROW_HIT_CLEARANCE;
      const y1 = obstacle.y1 - DEPENDENCY_ARROW_HIT_CLEARANCE;
      const y2 = obstacle.y2 + DEPENDENCY_ARROW_HIT_CLEARANCE;
      if (horizontal ? from.y <= y1 || from.y >= y2 : from.x <= x1 || from.x >= x2) {
        continue;
      }
      const enter = horizontal ? (x1 - from.x) / delta : (y1 - from.y) / delta;
      const exit = horizontal ? (x2 - from.x) / delta : (y2 - from.y) / delta;
      const start = Math.max(0, Math.min(enter, exit));
      const end = Math.min(1, Math.max(enter, exit));
      if (end > start) {
        covered.push([start, end]);
      }
    }
    covered.sort((a, b) => a[0] - b[0]);

    // Invert into the visible pieces.
    const visible: Array<[number, number]> = [];
    let cursor = 0;
    for (const [start, end] of covered) {
      if (start > cursor + EPSILON) {
        visible.push([cursor, start]);
      }
      cursor = Math.max(cursor, end);
    }
    if (cursor < 1 - EPSILON) {
      visible.push([cursor, 1]);
    }

    if (visible.length === 0) {
      closeCurrent();
      continue;
    }
    const pointAt = (t: number): DependencyArrowPoint =>
      horizontal ? { x: from.x + delta * t, y: from.y } : { x: from.x, y: from.y + delta * t };
    for (const [start, end] of visible) {
      // Exact corner coordinates at the piece's ends, so consecutive segments keep
      // sharing their corners and the rounding stays intact.
      const endPoint = end >= 1 - EPSILON ? to : pointAt(end);
      if (start <= EPSILON && current !== null) {
        current.push(endPoint);
      } else {
        closeCurrent();
        current = [pointAt(start), endPoint];
      }
      if (end < 1 - EPSILON) {
        closeCurrent();
      }
    }
  }
  closeCurrent();

  if (polylines.length === 0) {
    return [[...points]];
  }
  return polylines;
}

/**
 * Shortens a route at both ends (first and last segment only).
 */
function trimRouteEnds(
  points: readonly DependencyArrowPoint[],
  trimStart: number,
  trimEnd: number,
): DependencyArrowPoint[] {
  if (points.length < 2) {
    return [...points];
  }
  let start = trimStart;
  let end = trimEnd;
  if (points.length === 2) {
    // Both trims eat the same segment: scale them jointly (keeping their ratio) so a
    // clickable middle stretch always survives. Capping each independently makes them
    // meet at the midpoint of the short adjacent-events route, collapsing the path.
    const length = Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y);
    const available = Math.max(0, length - DEPENDENCY_ARROW_HIT_MIN_LENGTH);
    if (trimStart + trimEnd > available) {
      const scale = available / (trimStart + trimEnd);
      start = trimStart * scale;
      end = trimEnd * scale;
    }
  }
  const trimmed = [...points];
  trimmed[0] = movePointAlongSegment(points[0], points[1], start);
  trimmed[trimmed.length - 1] = movePointAlongSegment(
    points[points.length - 1],
    points[points.length - 2],
    end,
  );
  return trimmed;
}

/**
 * Builds the candidate orthogonal routes from the source anchor (end edge of the
 * predecessor) to the target anchor (start edge of the successor), best first.
 * The forward elbow returns two candidates (turn right after the source, or right
 * before the target) so the caller can pick the one crossing the fewest events.
 * `detourOffset` is how far from the source anchor the S route runs its horizontal
 * detour — it must clear the event's edge, otherwise the route overlaps the events and
 * reads as a knot instead of a detour.
 * Routes stay inside `[0, eventsWidth]`: at a timeline edge the stubs ride over the
 * event instead of leaving the visible area.
 */
export function buildDependencyArrowRoutes(
  source: DependencyArrowPoint,
  target: DependencyArrowPoint,
  detourOffset: number,
  eventsWidth: number,
): DependencyArrowPoint[][] {
  const forwardX = target.x - source.x;

  if (source.y === target.y && forwardX >= 0) {
    if (forwardX >= 2 * DEPENDENCY_ARROW_STUB) {
      // Straight segment between two anchors at the same height.
      return [[source, target]];
    }

    // Adjacent events (two same-lane events never overlap in time, so a same-height
    // gap is always forward): a short straight arrow slightly overlapping the
    // predecessor's tail reads better than a detour around the junction.
    return [[{ x: Math.max(0, target.x - 2 * DEPENDENCY_ARROW_STUB), y: target.y }, target]];
  }

  if (forwardX >= DEPENDENCY_ARROW_STUB + DEPENDENCY_ARROW_TARGET_CLEARANCE) {
    // Forward elbow: right off the source, vertical, then right into the target — or
    // the mirrored turn right before the target.
    const earlyTurnX = source.x + DEPENDENCY_ARROW_STUB;
    const lateTurnX = target.x - DEPENDENCY_ARROW_TARGET_CLEARANCE;
    const routes = [
      [source, { x: earlyTurnX, y: source.y }, { x: earlyTurnX, y: target.y }, target],
    ];
    if (lateTurnX > earlyTurnX) {
      routes.push([source, { x: lateTurnX, y: source.y }, { x: lateTurnX, y: target.y }, target]);
    }
    return routes;
  }

  // S route: the successor starts before (or too close to) the predecessor's end, so
  // the arrow exits right, detours horizontally hugging the source event (below it, or
  // above when the target is higher) and comes back before entering the target. An
  // arbitrary height between the two anchors could land exactly on a row border and
  // read as part of the grid.
  // The verticals clamp to the events area (x < 0 sits under the pinned title column)
  // and the fixed-length stubs then ride over the event — the same overlap trade-off
  // as the short arrow between two adjacent events.
  const detourY = target.y >= source.y ? source.y + detourOffset : source.y - detourOffset;
  const exitX = Math.min(eventsWidth, source.x + DEPENDENCY_ARROW_STUB);
  const entryX = Math.max(0, target.x - DEPENDENCY_ARROW_TARGET_CLEARANCE);
  return [
    [
      { x: exitX - DEPENDENCY_ARROW_STUB, y: source.y },
      { x: exitX, y: source.y },
      { x: exitX, y: detourY },
      { x: entryX, y: detourY },
      { x: entryX, y: target.y },
      { x: entryX + DEPENDENCY_ARROW_TARGET_CLEARANCE, y: target.y },
    ],
  ];
}

/**
 * How much a route segment must overlap an event to count as crossing it — anchors
 * touching their own event's edge must not count.
 */
const COLLISION_EPSILON = 0.5;

function segmentCrossesObstacle(
  a: DependencyArrowPoint,
  b: DependencyArrowPoint,
  obstacle: DependencyArrowObstacle,
): boolean {
  // Vertical segment: x strictly inside the obstacle, y ranges overlapping.
  if (a.x === b.x) {
    return (
      a.x > obstacle.x1 + COLLISION_EPSILON &&
      a.x < obstacle.x2 - COLLISION_EPSILON &&
      Math.min(Math.max(a.y, b.y), obstacle.y2) - Math.max(Math.min(a.y, b.y), obstacle.y1) >
        COLLISION_EPSILON
    );
  }
  // Horizontal segment: y strictly inside the obstacle, x ranges overlapping.
  if (a.y === b.y) {
    return (
      a.y > obstacle.y1 + COLLISION_EPSILON &&
      a.y < obstacle.y2 - COLLISION_EPSILON &&
      Math.min(Math.max(a.x, b.x), obstacle.x2) - Math.max(Math.min(a.x, b.x), obstacle.x1) >
        COLLISION_EPSILON
    );
  }
  // Routes only have horizontal and vertical segments.
  return false;
}

/**
 * Number of obstacles a route crosses. Each obstacle counts once, no matter how many
 * segments cross it.
 */
function countRouteCollisions(
  points: readonly DependencyArrowPoint[],
  obstacles: readonly DependencyArrowObstacle[],
): number {
  let count = 0;
  for (const obstacle of obstacles) {
    for (let index = 0; index < points.length - 1; index += 1) {
      if (segmentCrossesObstacle(points[index], points[index + 1], obstacle)) {
        count += 1;
        break;
      }
    }
  }
  return count;
}

function formatCoordinate(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Builds an SVG path following the provided points with horizontal/vertical segments,
 * softening each corner with a quadratic curve. The radius is clamped so two corners
 * never overlap, and zero-length segments collapse their corner.
 */
export function buildRoundedOrthogonalPath(
  points: readonly DependencyArrowPoint[],
  radius: number,
): string {
  // Drop consecutive duplicated points so degenerate segments don't produce corners.
  const cleanPoints = points.filter(
    (point, index) =>
      index === 0 || point.x !== points[index - 1].x || point.y !== points[index - 1].y,
  );

  if (cleanPoints.length < 2) {
    return '';
  }

  let d = `M ${formatCoordinate(cleanPoints[0].x)} ${formatCoordinate(cleanPoints[0].y)}`;

  for (let index = 1; index < cleanPoints.length - 1; index += 1) {
    const previous = cleanPoints[index - 1];
    const corner = cleanPoints[index];
    const next = cleanPoints[index + 1];

    const inLength = Math.hypot(corner.x - previous.x, corner.y - previous.y);
    const outLength = Math.hypot(next.x - corner.x, next.y - corner.y);
    const cornerRadius = Math.min(radius, inLength / 2, outLength / 2);

    if (cornerRadius <= 0) {
      d += ` L ${formatCoordinate(corner.x)} ${formatCoordinate(corner.y)}`;
      continue;
    }

    const inX = corner.x - ((corner.x - previous.x) / inLength) * cornerRadius;
    const inY = corner.y - ((corner.y - previous.y) / inLength) * cornerRadius;
    const outX = corner.x + ((next.x - corner.x) / outLength) * cornerRadius;
    const outY = corner.y + ((next.y - corner.y) / outLength) * cornerRadius;

    d += ` L ${formatCoordinate(inX)} ${formatCoordinate(inY)}`;
    d += ` Q ${formatCoordinate(corner.x)} ${formatCoordinate(corner.y)} ${formatCoordinate(outX)} ${formatCoordinate(outY)}`;
  }

  const last = cleanPoints[cleanPoints.length - 1];
  d += ` L ${formatCoordinate(last.x)} ${formatCoordinate(last.y)}`;

  return d;
}
