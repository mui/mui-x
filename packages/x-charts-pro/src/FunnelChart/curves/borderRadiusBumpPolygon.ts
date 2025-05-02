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

  const corners: Point[][] = [];
  for (let i = 0; i < numPoints; i += 1) {
    const lastPoint = points[i];
    const thisPoint = points[(i + 1) % numPoints];
    const nextPoint = points[(i + 2) % numPoints];

    // Regular corners
    if (i === 0 || i === 2) {
      const lastEdgeLength = distance(lastPoint, thisPoint);
      const lastOffsetDistance = Math.min(lastEdgeLength / 2, radius[i] ?? 0);
      const start = lerp2D(thisPoint, lastPoint, lastOffsetDistance / lastEdgeLength);

      const nextEdgeLength = distance(nextPoint, thisPoint);
      const nextOffsetDistance = Math.min(nextEdgeLength / 2, radius[i] ?? 0);
      const end = lerp2D(thisPoint, nextPoint, nextOffsetDistance / nextEdgeLength);

      corners.push([start, thisPoint, end]);
    } else {
      // Start bump, from last point to the middle of the edge
      const lastEdgeLength = distance(lastPoint, thisPoint);
      const lastOffsetDistance = Math.min(lastEdgeLength / 2, radius[i] ?? 0);
      const startBumpStart = lerp2D(thisPoint, lastPoint, lastOffsetDistance / lastEdgeLength);

      const midPoint = {
        x: (thisPoint.x + lastPoint.x) / 2,
        y: (thisPoint.y + lastPoint.y) / 2,
      };
      const startBumpEdgeLength = distance(midPoint, thisPoint);
      const startBumpOffsetDistance = Math.min(startBumpEdgeLength / 2, radius[i] ?? 0);
      const startBumpEnd = lerp2D(
        thisPoint,
        nextPoint,
        startBumpOffsetDistance / startBumpEdgeLength,
      );

      const angle = Math.abs(
        (Math.atan2(thisPoint.x - lastPoint.x, thisPoint.y - lastPoint.y) * 180) / Math.PI,
      );
      const isHorizontal = angle < 45 || angle > 135;

      const controlPoint = {
        x: isHorizontal ? midPoint.x : lastPoint.x,
        y: isHorizontal ? lastPoint.y : midPoint.y,
      };

      corners.push([startBumpStart, controlPoint, startBumpEnd]);

      // End bump, from the middle of the edge to the next point
      const lastBumpEdgeLength = distance(thisPoint, nextPoint);

      // const edgeCp2 = {
      //   x: isHorizontal ? (lastPoint.x + thisPoint.x) / 2 : thisPoint.x,
      //   y: isHorizontal ? thisPoint.y : (lastPoint.y + thisPoint.y) / 2,
      // };
    }

    //   } else if (this.currentPoint === 1) {
    //     this.context.bezierCurveTo(
    //       (this.x + x - this.gap) / 2,
    //       this.y,
    //       (this.x + x - this.gap) / 2,
    //       y,
    //       x - this.gap,
    //       y,
    //     );
    //   } else if (this.currentPoint === 3) {
    //     this.context.bezierCurveTo(
    //       (this.x + x - this.gap) / 2,
    //       this.y,
    //       (this.x + x - this.gap) / 2,
    //       y,
    //       x + this.gap,
    //       y,
    //     );
    //   }

    // } else if (this.currentPoint === 1) {
    //   this.context.bezierCurveTo(
    //     this.x,
    //     (this.y + y - this.gap) / 2,
    //     x,
    //     (this.y + y - this.gap) / 2,
    //     x,
    //     y - this.gap,
    //   );
    // } else if (this.currentPoint === 3) {
    //   this.context.bezierCurveTo(
    //     this.x,
    //     (this.y + y - this.gap) / 2,
    //     x,
    //     (this.y + y - this.gap) / 2,
    //     x,
    //     y + this.gap,
    //   );
    // }
  }

  ctx.moveTo(corners[0][0].x, corners[0][0].y);
  for (const [start, ctrl, end] of corners) {
    ctx.lineTo(start.x, start.y);
    ctx.quadraticCurveTo(ctrl.x, ctrl.y, end.x, end.y);
  }

  ctx.closePath();
}
