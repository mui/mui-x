/**
 * Clamp angle to [0, 360[.
 */
export function clampAngle(angle: number) {
  return ((angle % 360) + 360) % 360;
}

const TWO_PI = 2 * Math.PI;
/** Clamp angle to [0, 2 * Math.PI[. */
export function clampAngleRad(angle: number) {
  return ((angle % TWO_PI) + TWO_PI) % TWO_PI;
}
