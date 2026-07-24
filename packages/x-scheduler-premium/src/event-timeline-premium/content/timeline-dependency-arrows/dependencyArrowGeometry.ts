import type { Adapter } from '@mui/x-scheduler-internals/use-adapter';
import type {
  SchedulerEventId,
  SchedulerEventOccurrence,
  SchedulerResource,
  TemporalSupportedObject,
} from '@mui/x-scheduler-internals/models';
import { computeElementPositionInCollection } from '@mui/x-scheduler-internals/internals';
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

export interface ComputeDependencyArrowsParameters {
  adapter: Adapter;
  /**
   * The active dependencies (both events exist and are not recurring).
   */
  dependencies: readonly SchedulerDependency[];
  /**
   * The visible resources with their occurrences, in row render order.
   */
  resources: readonly { resource: SchedulerResource; occurrences: SchedulerEventOccurrence[] }[];
  /**
   * The y offset of each row in pixels, in the same order as `resources`.
   */
  rowPositions: readonly number[];
  collectionStart: TemporalSupportedObject;
  collectionEnd: TemporalSupportedObject;
  /**
   * First displayed minute of each day, as an offset from midnight.
   * @default 0
   */
  dayStartMinute?: number;
  /**
   * Last displayed minute of each day, as an offset from midnight.
   * @default 1440
   */
  dayEndMinute?: number;
  /**
   * The width of the events area in pixels (tick count × tick width).
   */
  eventsWidth: number;
  laneMetrics: EventsCellLaneMetrics;
}

interface DependencyArrowAnchor {
  rowIndex: number;
  occurrence: SchedulerEventOccurrence;
}

/**
 * Computes the arrow of each renderable dependency, connecting the end edge of the
 * source event to the start edge of the target event.
 * Anchors are derived from the data model (not measured on the DOM) so arrows can
 * reach events that the virtualizer did not mount.
 */
export function computeDependencyArrows(
  parameters: ComputeDependencyArrowsParameters,
): DependencyArrow[] {
  const {
    adapter,
    dependencies,
    resources,
    rowPositions,
    collectionStart,
    collectionEnd,
    dayStartMinute = 0,
    dayEndMinute = 24 * 60,
    eventsWidth,
    laneMetrics,
  } = parameters;

  if (dependencies.length === 0 || eventsWidth <= 0) {
    return [];
  }

  const endpointIds = new Set<SchedulerEventId>();
  for (const dependency of dependencies) {
    endpointIds.add(dependency.source);
    endpointIds.add(dependency.target);
  }

  // An event assigned to several resources appears once in each of its rows: collect
  // every appearance so each one gets its own arrows.
  const anchorsLookup = new Map<SchedulerEventId, DependencyArrowAnchor[]>();
  for (let rowIndex = 0; rowIndex < resources.length; rowIndex += 1) {
    for (const occurrence of resources[rowIndex].occurrences) {
      if (endpointIds.has(occurrence.id)) {
        const anchors = anchorsLookup.get(occurrence.id);
        if (anchors) {
          anchors.push({ rowIndex, occurrence });
        } else {
          anchorsLookup.set(occurrence.id, [{ rowIndex, occurrence }]);
        }
      }
    }
  }

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

  const positionByOccurrenceKey = new Map<
    string,
    ReturnType<typeof computeElementPositionInCollection>
  >();
  const getPosition = (occurrence: SchedulerEventOccurrence) => {
    let position = positionByOccurrenceKey.get(occurrence.key);
    if (position == null) {
      position = computeElementPositionInCollection(adapter, {
        start: occurrence.displayTimezone.start,
        end: occurrence.displayTimezone.end,
        collectionStart,
        collectionEnd,
        dayStartMinute,
        dayEndMinute,
      });
      positionByOccurrenceKey.set(occurrence.key, position);
    }
    return position;
  };

  const laneStep = laneMetrics.laneMinHeight + laneMetrics.laneGap;
  const getLaneTop = (rowIndex: number, lane: number): number =>
    rowPositions[rowIndex] + laneMetrics.topPadding + (lane - 1) * laneStep;
  const getY = (anchor: DependencyArrowAnchor): number =>
    getLaneTop(anchor.rowIndex, getLaneLookup(anchor.rowIndex)[anchor.occurrence.key]) +
    laneMetrics.laneMinHeight / 2;

  // The event boxes of a row, used to pick the elbow candidate crossing the fewest
  // events. Computed on demand and only once per row an arrow spans.
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

  const detourOffset = laneMetrics.laneMinHeight / 2 + DEPENDENCY_ARROW_DETOUR_CLEARANCE;

  const buildArrow = (
    dependency: SchedulerDependency,
    sourceAnchor: DependencyArrowAnchor,
    targetAnchor: DependencyArrowAnchor,
  ): DependencyArrow | null => {
    // A row without a position is not laid out yet (see the transient resources /
    // rowsMeta desync): skip the pair for this frame.
    if (
      rowPositions[sourceAnchor.rowIndex] == null ||
      rowPositions[targetAnchor.rowIndex] == null
    ) {
      return null;
    }

    const minRowIndex = Math.min(sourceAnchor.rowIndex, targetAnchor.rowIndex);
    const maxRowIndex = Math.max(sourceAnchor.rowIndex, targetAnchor.rowIndex);
    const sourcePosition = getPosition(sourceAnchor.occurrence);
    const targetPosition = getPosition(targetAnchor.occurrence);

    const source: DependencyArrowPoint = {
      x: (sourcePosition.position + sourcePosition.duration) * eventsWidth,
      y: getY(sourceAnchor),
    };
    const target: DependencyArrowPoint = {
      x: targetPosition.position * eventsWidth,
      y: getY(targetAnchor),
    };

    const routes = buildDependencyArrowRoutes(source, target, detourOffset, eventsWidth);

    // With several candidates, keep the one crossing the fewest events (first wins on
    // a tie). Best-effort avoidance, not full pathfinding.
    let points = routes[0];
    if (routes.length > 1) {
      const obstacles: DependencyArrowObstacle[] = [];
      for (let rowIndex = minRowIndex; rowIndex <= maxRowIndex; rowIndex += 1) {
        for (const obstacle of getRowObstacles(rowIndex)) {
          if (
            obstacle.occurrenceKey !== sourceAnchor.occurrence.key &&
            obstacle.occurrenceKey !== targetAnchor.occurrence.key
          ) {
            obstacles.push(obstacle);
          }
        }
      }

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
      minXFraction: minX / eventsWidth,
      maxXFraction: maxX / eventsWidth,
      minRowIndex,
      maxRowIndex,
    };
  };

  const arrows: DependencyArrow[] = [];
  for (const dependency of dependencies) {
    const sourceAnchors = anchorsLookup.get(dependency.source);
    const targetAnchors = anchorsLookup.get(dependency.target);

    // An endpoint without an anchor is not rendered in the timeline: its event has no
    // resource, is outside the collection range, or its row is hidden. The dependency
    // stays in the data, it just has no arrow.
    if (sourceAnchors == null || targetAnchors == null) {
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

interface DependencyArrowObstacle {
  occurrenceKey: string;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

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
