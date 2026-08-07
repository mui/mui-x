const TAU = 2 * Math.PI;

/* `d3-shape` serializes paths with a precision of 3 digits, i.e., a resolution of 1e-3. */
const PATH_PRECISION = 1e-3;
/* If the distance between the start and end points of an arc is at least twice the path
 * precision, at least one of their coordinates is guaranteed to round to a different value. */
const MIN_DISTINCT_CHORD_LENGTH = 2 * PATH_PRECISION;

/**
 * Snaps the end angle of an arc to create a full circle when the arc spans almost, but not
 * exactly, the full circle.
 *
 * When an arc spans almost the full circle (e.g., when the remaining slices of a pie are
 * extremely small compared to the largest one), its start and end points are so close that they
 * can round to the same path coordinates. SVG omits arcs whose end point equals their start
 * point, which makes the quasi-full-circle arc invisible.
 * See https://github.com/mui/mui-x/issues/14167
 *
 * The end angle is only snapped when the gap left by the arc is smaller than the precision of
 * the serialized path, so the snapping is visually lossless.
 *
 * @param startAngle The start angle of the arc, in radians.
 * @param endAngle The end angle of the arc, in radians.
 * @param outerRadius The outer radius of the arc.
 * @param padAngle The pad angle of the arc, in radians.
 * @returns The end angle, snapped to `startAngle ± 2 * Math.PI` when applicable.
 */
export function snapEndAngleToFullCircle(
  startAngle: number,
  endAngle: number,
  outerRadius: number,
  padAngle: number = 0,
): number {
  const sweep = Math.abs(endAngle - startAngle);

  if (sweep === 0 || sweep >= TAU) {
    return endAngle;
  }

  // Chord between the start and end points of the arc, once the padding is applied.
  // For such small angles, the chord length is approximately `radius * angle`.
  const gapChordLength = (TAU - sweep + Math.abs(padAngle)) * outerRadius;

  if (gapChordLength >= MIN_DISTINCT_CHORD_LENGTH) {
    return endAngle;
  }

  return startAngle + Math.sign(endAngle - startAngle) * TAU;
}
