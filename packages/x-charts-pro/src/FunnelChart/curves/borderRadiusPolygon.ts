import { Point } from './curve.types';

const distance = (p1: Point, p2: Point) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
const lerp2D = (p1: Point, p2: Point, t: number) => ({
  x: lerp(p1.x, p2.x, t),
  y: lerp(p1.y, p2.y, t),
});

/**
 * Draws a polygon with rounded corners
 * @param {CanvasRenderingContext2D} ctx The canvas context
 * @param {Array} points A list of `{x, y}` points
 * @radius {number} how much to round the corners
 */
export function borderRadiusPolygon(
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

    const lastEdgeLength = distance(lastPoint, thisPoint);
    const lastOffsetDistance = Math.min(lastEdgeLength / 2, radius[i] ?? 0);
    const start = lerp2D(thisPoint, lastPoint, lastOffsetDistance / lastEdgeLength);

    const nextEdgeLength = distance(nextPoint, thisPoint);
    const nextOffsetDistance = Math.min(nextEdgeLength / 2, radius[i] ?? 0);
    const end = lerp2D(thisPoint, nextPoint, nextOffsetDistance / nextEdgeLength);

    corners.push([start, thisPoint, end]);
  }

  ctx.moveTo(corners[0][0].x, corners[0][0].y);
  for (const [start, ctrl, end] of corners) {
    ctx.lineTo(start.x, start.y);
    ctx.quadraticCurveTo(ctrl.x, ctrl.y, end.x, end.y);
  }

  ctx.closePath();
}
