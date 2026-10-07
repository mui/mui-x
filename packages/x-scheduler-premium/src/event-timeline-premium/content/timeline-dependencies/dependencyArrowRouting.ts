import type { SchedulerDependencyType } from '@mui/x-scheduler-internals-premium/models';
import { getDependencyEdges } from '@mui/x-scheduler-internals-premium/internals';
import type { DependencyArrowObstacle, DependencyArrowPoint } from './dependencyAnchorResolver';

/**
 * Minimum horizontal segment when leaving the source edge and when entering the
 * target edge.
 */
const DEPENDENCY_ARROW_STUB = 8;
/**
 * Radius used to soften the corners of the orthogonal route.
 */
export const DEPENDENCY_ARROW_CORNER_RADIUS = 4;
/**
 * Size of the arrowhead marker at the target edge.
 */
export const DEPENDENCY_ARROWHEAD_SIZE = 7;
/**
 * Minimum length of the final segment entering the target: the softened corner plus the
 * arrowhead must fit on it, otherwise the arrowhead overlaps the curve.
 */
const DEPENDENCY_ARROW_TARGET_CLEARANCE =
  DEPENDENCY_ARROW_CORNER_RADIUS + DEPENDENCY_ARROWHEAD_SIZE + 1;

/**
 * Builds the candidate orthogonal routes from the source anchor to the target anchor,
 * best first. Routes are computed in a canonical frame where the source exits to the
 * right: the types leaving from the start edge mirror their anchors around the events
 * area, route, and mirror back. That leaves two shapes, opposite edges (FS, mirrored
 * SF) and same edges (FF, mirrored SS).
 * `detourOffset` is how far from the source anchor a detour runs: it must clear the
 * event's edge, otherwise the route reads as a knot.
 * Routes stay inside `[0, eventsWidth]`: at a timeline edge the stubs ride over the
 * event instead of leaving the visible area.
 */
export function buildDependencyArrowRoutes(
  source: DependencyArrowPoint,
  target: DependencyArrowPoint,
  type: SchedulerDependencyType,
  detourOffset: number,
  eventsWidth: number,
): DependencyArrowPoint[][] {
  const edges = getDependencyEdges(type);
  const route = edges.source === edges.target ? routeSameEdges : routeOppositeEdges;
  if (edges.source === 'end') {
    return route(source, target, detourOffset, eventsWidth);
  }
  const mirror = (point: DependencyArrowPoint): DependencyArrowPoint => ({
    x: eventsWidth - point.x,
    y: point.y,
  });
  return route(mirror(source), mirror(target), detourOffset, eventsWidth).map((points) =>
    points.map(mirror),
  );
}

/**
 * Exit to the right off the source, enter the target from the left.
 * The forward elbow returns two candidates (turn right after the source, or right
 * before the target) so the caller can pick the one crossing the fewest events.
 */
function routeOppositeEdges(
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
    // gap is always forward): a short straight arrow slightly overlapping the source
    // reads better than a detour around the junction.
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

  // S route: the target sits before (or too close to) the source, so the arrow exits
  // right, detours horizontally hugging the source event (below it, or above when the
  // target is higher) and comes back before entering the target. An arbitrary height
  // between the two anchors could land exactly on a row border and read as part of
  // the grid.
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
 * Exit to the right off the source, wrap past the rightmost anchor and enter the
 * target from the right. A target before or after the source only moves the wrap;
 * same-height anchors detour below the events instead.
 */
function routeSameEdges(
  source: DependencyArrowPoint,
  target: DependencyArrowPoint,
  detourOffset: number,
  eventsWidth: number,
): DependencyArrowPoint[][] {
  const exitX = Math.min(eventsWidth, source.x + DEPENDENCY_ARROW_STUB);
  const entryX = Math.min(eventsWidth, target.x + DEPENDENCY_ARROW_TARGET_CLEARANCE);

  if (source.y === target.y) {
    // Same height: the wrap would fold onto itself, so the route detours below the
    // events between the exit and the entry, like the S route — stubs riding over
    // the events at the timeline end included.
    const detourY = source.y + detourOffset;
    return [
      [
        { x: exitX - DEPENDENCY_ARROW_STUB, y: source.y },
        { x: exitX, y: source.y },
        { x: exitX, y: detourY },
        { x: entryX, y: detourY },
        { x: entryX, y: target.y },
        { x: entryX - DEPENDENCY_ARROW_TARGET_CLEARANCE, y: target.y },
      ],
    ];
  }

  // The vertical runs past both anchors; at the timeline end it clamps and the stubs
  // ride over the events, like the S route.
  const wrapX = Math.max(exitX, entryX);
  return [
    [
      { x: Math.min(source.x, wrapX - DEPENDENCY_ARROW_STUB), y: source.y },
      { x: wrapX, y: source.y },
      { x: wrapX, y: target.y },
      { x: Math.min(target.x, wrapX - DEPENDENCY_ARROW_TARGET_CLEARANCE), y: target.y },
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
export function countRouteCollisions(
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
