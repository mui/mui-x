/**
 * The default spacing, in pixels, between two rendered points. One point every few pixels keeps
 * the shape readable while reducing the rendered count by a large factor on dense datasets.
 */
export const DEFAULT_PIXELS_PER_POINT = 4;

/**
 * Computes the target number of points to render from the available pixel span.
 *
 * The target scales with the (possibly zoomed) pixel span of the axis, keeping roughly one point
 * every `pixelsPerPoint` pixels. Zooming in increases the span covered by the visible data, which
 * increases the target and restores detail.
 *
 * @param pixelSpan The pixel length of the axis the series is plotted against.
 * @param pixelsPerPoint The target spacing between rendered points, in pixels.
 * @returns The target number of points, at least 2.
 */
export function computeTargetCount(
  pixelSpan: number,
  pixelsPerPoint: number = DEFAULT_PIXELS_PER_POINT,
): number {
  if (!Number.isFinite(pixelSpan) || pixelSpan <= 0) {
    return 2;
  }
  return Math.max(2, Math.floor(pixelSpan / pixelsPerPoint));
}

/**
 * The target point count for a given zoom level, capped at the series length.
 *
 * The base count (at zoom level 0) doubles with each level, so detail is added in discrete steps
 * as the user zooms in, rather than continuously. Because the whole series is always sampled to
 * this count, the result is independent of the pan position.
 *
 * @param pixelSpan The pixel length of the axis the series is plotted against.
 * @param zoomLevel The quantized zoom level (0 = not zoomed).
 * @param length The number of points in the series.
 * @param pixelsPerPoint The base spacing between rendered points, in pixels.
 * @returns The target number of points, capped at `length`.
 */
export function targetForZoomLevel(
  pixelSpan: number,
  zoomLevel: number,
  length: number,
  pixelsPerPoint: number = DEFAULT_PIXELS_PER_POINT,
): number {
  const base = computeTargetCount(pixelSpan, pixelsPerPoint);
  const target = base * 2 ** Math.max(0, zoomLevel);
  return Math.min(length, target);
}
