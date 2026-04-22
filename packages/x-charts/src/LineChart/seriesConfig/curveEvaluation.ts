import type { CurveType } from '../../models/curve';
import { getCurveFactory } from '../../internals/getCurve';
import { cubicRoots } from '../../internals/cubiqSolver';

/**
 * A straight line segment.
 */
interface LineSegment {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/**
 * A cubic bezier segment with control points.
 */
interface BezierSegment {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  cpx1: number;
  cpy1: number;
  cpx2: number;
  cpy2: number;
}

type CurveSegment = LineSegment | BezierSegment;

function isBezierSegment(segment: CurveSegment): segment is BezierSegment {
  return 'cpx1' in segment;
}

/**
 * A minimal d3 path context that captures line/bezier segments
 * instead of producing an SVG path string.
 */
class SegmentCapture {
  segments: CurveSegment[] = [];

  private cx = 0;

  private cy = 0;

  moveTo(x: number, y: number) {
    this.cx = x;
    this.cy = y;
  }

  lineTo(x: number, y: number) {
    this.segments.push({ x0: this.cx, y0: this.cy, x1: x, y1: y });
    this.cx = x;
    this.cy = y;
  }

  bezierCurveTo(cpx1: number, cpy1: number, cpx2: number, cpy2: number, x: number, y: number) {
    this.segments.push({
      x0: this.cx,
      y0: this.cy,
      cpx1,
      cpy1,
      cpx2,
      cpy2,
      x1: x,
      y1: y,
    });
    this.cx = x;
    this.cy = y;
  }

  closePath() { }
}

/** Evaluate a cubic Bezier at parameter t. */
function cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
  const mt = 1 - t;
  return mt * mt * mt * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t * p3;
}

/**
 * Get polynomials coefficient of a cubic Bezier curve.
 * P(t) = rep[0] * t**3  + rep[1] * t**2 + rep[2] * t + rep[3]
 */
function cubicBezierCoeffs(p0: number, p1: number, p2: number, p3: number): [number, number, number, number] {
  return [
    -p0 + 3 * p1 - 3 * p2 + p3,
    3 * p0 - 6 * p1 + 3 * p2,
    -3 * p0 + 3 * p1,
    p0,
  ]

}

/**
 * Find parameter t such that the segment's x(t) ≈ targetX
 */
function findTForX(segment: CurveSegment, targetX: number): number {
  if (!isBezierSegment(segment)) {
    // Linear segment.
    const dx = segment.x1 - segment.x0;
    return dx === 0 ? 0 : (targetX - segment.x0) / dx;
  }

  const xBezierCoeffs = cubicBezierCoeffs(segment.x0, segment.cpx1, segment.cpx2, segment.x1);

  const polyToSolve: [number, number, number, number] = [...xBezierCoeffs]
  polyToSolve[3] -= targetX;

  const roots = cubicRoots(polyToSolve);
  if (roots.length > 0) {
    return roots[0];
  }

  return -1;
}

/** Evaluate the segment's y at parameter t. */
function evaluateSegmentY(segment: CurveSegment, t: number): number {
  if (!isBezierSegment(segment)) {
    return segment.y0 + t * (segment.y1 - segment.y0);
  }
  return cubicBezier(t, segment.y0, segment.cpy1, segment.cpy2, segment.y1);
}

/**
 * Build the curve segments for a set of pixel-coordinate points
 * using d3's curve factory, then evaluate y at the given pixel x.
 *
 * Returns null if targetX is outside the curve's x range.
 */
export function evaluateCurveY(
  points: Array<{ x: number; y: number }>,
  targetX: number,
  curveType?: CurveType,
): number | null {
  if (points.length === 0) {
    return null;
  }
  if (points.length === 1) {
    return points[0].y;
  }

  const capture = new SegmentCapture();
  const factory = getCurveFactory(curveType);
  const curveInstance = factory(capture as any);

  curveInstance.lineStart();
  for (const p of points) {
    curveInstance.point(p.x, p.y);
  }
  curveInstance.lineEnd();

  // Find the segment containing targetX.
  for (const segment of capture.segments) {
    const xMin = Math.min(segment.x0, segment.x1);
    const xMax = Math.max(segment.x0, segment.x1);

    if (targetX >= xMin - 0.5 && targetX <= xMax + 0.5) {
      const t = findTForX(segment, targetX);
      return evaluateSegmentY(segment, t);
    }
  }

  return null;
}
