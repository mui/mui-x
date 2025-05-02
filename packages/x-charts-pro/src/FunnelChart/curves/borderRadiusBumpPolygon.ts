import { Point } from './curve.types';

const distance = (p1: Point, p2: Point) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
const lerp2D = (p1: Point, p2: Point, t: number) => ({
  x: lerp(p1.x, p2.x, t),
  y: lerp(p1.y, p2.y, t),
});

/**
 * Same as `borderRadiusPolygon` but with a bump in the middle
 * of the relevant edges.
 *
 * @param {CanvasRenderingContext2D} ctx The canvas context
 * @param {Array} points A list of `{x, y}` points
 * @radius {number} how much to round the corners
 */
export function borderRadiusBumpPolygon(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  radius: number | number[],
): void {
  const numPoints = points.length;

  radius = Array.isArray(radius) ? radius : Array(numPoints).fill(radius);

  const corners: [Point, Point, Point, Point | null, Point | null][] = [];
  for (let i = 0; i < numPoints; i += 1) {
    const secondToLastPoint = points.at(i - 1)!;
    const lastPoint = points[i];
    const thisPoint = points[(i + 1) % numPoints];
    const nextPoint = points[(i + 2) % numPoints];

    const lastEdgeLength = distance(lastPoint, thisPoint);
    const lastOffsetDistance = Math.min(lastEdgeLength / 2, radius[i] ?? 0);
    const start = lerp2D(thisPoint, lastPoint, lastOffsetDistance / lastEdgeLength);

    const nextEdgeLength = distance(nextPoint, thisPoint);
    const nextOffsetDistance = Math.min(nextEdgeLength / 2, radius[i] ?? 0);
    const end = lerp2D(thisPoint, nextPoint, nextOffsetDistance / nextEdgeLength);

    const lastEndEdgeLength = distance(lastPoint, secondToLastPoint);
    const lastEndOffsetDistance = Math.min(lastEndEdgeLength / 2, radius[i] ?? 0);
    const lastEndPoint = lerp2D(
      lastPoint,
      secondToLastPoint,
      lastEndOffsetDistance / lastEndEdgeLength,
    );

    const angle = Math.abs(
      (Math.atan2(thisPoint.x - nextPoint.x, thisPoint.y - nextPoint.y) * 180) / Math.PI,
    );
    const isHorizontal = angle < 45 || angle > 135;

    const midPoint = {
      x: (lastPoint.x + thisPoint.x) / 2,
      y: (lastPoint.y + thisPoint.y) / 2,
    };

    const controlPoint1 = {
      x: isHorizontal ? midPoint.x : lastEndPoint.x,
      y: isHorizontal ? lastEndPoint.y : midPoint.y,
    };

    const controlPoint2 = {
      x: isHorizontal ? midPoint.x : start.x,
      y: isHorizontal ? start.y : midPoint.y,
    };

    const isBumpEdge = i === 0 || i === 2;
    corners.push([
      start,
      thisPoint,
      end,
      isBumpEdge ? controlPoint1 : null,
      isBumpEdge ? controlPoint2 : null,
    ]);
  }

  //     this.context.bezierCurveTo(
  //       (this.x + x ) / 2,
  //       this.y,
  //       (this.x + x ) / 2,
  //       y,
  //       x,
  //       y,
  //     );

  //   this.context.bezierCurveTo(
  //     this.x,
  //     (this.y + y ) / 2,
  //     x,
  //     (this.y + y ) / 2,
  //     x,
  //     y,
  //   );

  ctx.moveTo(corners[0][0].x, corners[0][0].y);
  for (let i = 0; i < corners.length; i += 1) {
    const [start, ctrl, end, cp1, cp2] = corners[i];

    if (cp1 === null || cp2 === null) {
      ctx.lineTo(start.x, start.y);
      ctx.quadraticCurveTo(ctrl.x, ctrl.y, end.x, end.y);
    } else {
      ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, start.x, start.y);
      ctx.quadraticCurveTo(ctrl.x, ctrl.y, end.x, end.y);
    }
  }

  ctx.closePath();
}
