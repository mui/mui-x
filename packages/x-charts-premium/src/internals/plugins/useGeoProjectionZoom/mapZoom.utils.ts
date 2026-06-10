import { type GeoProjection } from '@mui/x-charts-vendor/d3-geo';

export interface MapZoomTransform {
  /** Absolute d3-geo projection scale. */
  scale: number;
  /** Projection translation `[x, y]` in SVG pixels. */
  translate: [number, number];
}

/**
 * Pan the projection by a screen-space pixel delta.
 */
export function panProjection(projection: GeoProjection, dx: number, dy: number): MapZoomTransform {
  const scale = projection.scale();
  const [tx, ty] = projection.translate();
  return { scale, translate: [tx + dx, ty + dy] };
}

/**
 * Modify projection scale by a given factor such that focused point stay at the same SVG coordinates.
 * @param {GeoProjection} projection The initial projection
 * @param {number} factor the factor to apply to the projection scale
 * @param {{ x: number; y: number }} focal the focal point that must stay unchanged in SVG coordinates
 * @param {number} minScale the minimum scale allowed
 * @param {number} maxScale the maximum scale allowed
 * @return {MapZoomTransform} The new projection scale and translate that achieve the desired zoom.
 */
export function zoomProjectionAtPoint(
  projection: GeoProjection,
  factor: number,
  focal: { x: number; y: number },
  minScale: number,
  maxScale: number,
): MapZoomTransform {
  const scale = projection.scale();
  const [tx, ty] = projection.translate();

  const nextScale = Math.max(minScale, Math.min(maxScale, scale * factor));
  const k = nextScale / scale;

  return {
    scale: nextScale,
    translate: [k * tx + (1 - k) * focal.x, k * ty + (1 - k) * focal.y],
  };
}
