/**
 * Calculate the distance between two points
 */
export function getDistance(
  pointA: { x: number; y: number },
  pointB: { x: number; y: number }
): number {
  const deltaX = pointB.x - pointA.x;
  const deltaY = pointB.y - pointA.y;
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}
