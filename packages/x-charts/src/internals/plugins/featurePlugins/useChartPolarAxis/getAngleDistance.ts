/**
 * Returns the shortest distance between two angles in radians.
 * The result is always in [0, PI].
 */
export function getAngleDistance(a: number, b: number): number {
  const diff = Math.abs(a - b) % (2 * Math.PI);
  return diff > Math.PI ? 2 * Math.PI - diff : diff;
}
