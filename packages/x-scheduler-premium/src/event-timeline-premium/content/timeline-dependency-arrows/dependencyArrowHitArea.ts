import type { DependencyArrowObstacle, DependencyArrowPoint } from './dependencyAnchorResolver';

/**
 * How much the click hit-area is trimmed at the arrow's source end, so the pointer
 * near the anchor reaches the dependency terminal (the drag handle) instead of
 * selecting the arrow. A best-effort budget, not a guarantee: trims cap at half of
 * their segment, so short first segments (the 8px stubs) keep less clearance, and on
 * a single-segment route both trims scale down together.
 */
export const DEPENDENCY_ARROW_HIT_TRIM_START = 12;
/**
 * Trim at the target end, freeing the resize handle under the arrowhead.
 */
export const DEPENDENCY_ARROW_HIT_TRIM_END = 8;
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
export function clipRouteAroundObstacles(
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
export function trimRouteEnds(
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
