/**
 * Clamp angle to [0, 360[.
 */
export function clampAngle(angle: number) {
  return ((angle % 360) + 360) % 360;
}
