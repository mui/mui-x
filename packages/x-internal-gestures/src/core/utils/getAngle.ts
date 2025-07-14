/**
 * Calculate the angle between two points in degrees
 */
export function getAngle(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
  return (angle + 360) % 360;
}
