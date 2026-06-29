import type { GeoProjection } from '@mui/x-charts-vendor/d3-geo';

export interface ReprojectEquirectangularImageParams {
  /**
   * A fully-loaded image whose pixels are in the equirectangular (plate carrée)
   * projection — longitude maps linearly to x, latitude linearly to y.
   */
  image: HTMLImageElement;
  /**
   * The chart projection. Must expose `invert`; otherwise reprojection is impossible.
   */
  projection: GeoProjection;
  /**
   * The chart drawing area, in SVG coordinates. `left`/`top` are the offset of the
   * drawing area inside the SVG, which the projection already accounts for.
   */
  area: { left: number; top: number; width: number; height: number };
  /**
   * Geographic extent the source image covers, as `[[west, south], [east, north]]`
   * in degrees.
   */
  imageBounds: [[number, number], [number, number]];
}

/**
 * Warps an equirectangular raster so it matches an arbitrary d3-geo `projection`,
 * returning the result as a PNG data URL (or `null` when it cannot be produced).
 *
 * ### Why inverse mapping
 *
 * Forward-projecting each *source* pixel to the screen leaves holes and overlaps,
 * because the mapping is non-linear and area-distorting. Instead we walk every
 * *destination* pixel and pull the color it should show from the source — inverse
 * (destination-to-source) resampling, which fills the output exactly once.
 *
 * ### Algorithm
 *
 * For each destination pixel `(px, py)` of the drawing area:
 *
 * 1. Convert it to SVG coordinates `(left + px, top + py)` — the space the
 *    projection works in — and `projection.invert` it to a `[lon, lat]` coordinate.
 *    `invert` returns `null` for some pixels outside the domain, leaving them transparent.
 * 2. Discard coordinates outside `imageBounds` (no source data there).
 * 3. Round-trip test: forward-project `[lon, lat]` again. Projections such as
 *    `orthographic` clamp `invert` for points outside the visible disk to the limb
 *    rather than returning `null`, so those coordinates survive steps 1–2 and would
 *    smear edge colors across the background. If the round trip lands more than half
 *    a pixel away, the pixel is outside the visible footprint and is left transparent.
 * 4. Map `[lon, lat]` to a source pixel with nearest-neighbor sampling (the image
 *    being equirectangular, both axes are linear) and copy its RGBA.
 *
 * ### Failure modes
 *
 * Returns `null` when a 2D canvas context is unavailable, or when reading the
 * source pixels throws because a cross-origin image without CORS headers has
 * tainted the canvas.
 *
 * Complexity is `O(width × height)` with two projection evaluations per pixel, so
 * callers should treat it as a per-resize computation rather than a per-frame one.
 */
export function reprojectEquirectangularImage(
  params: ReprojectEquirectangularImageParams,
): string | null {
  const { image, projection, area, imageBounds } = params;
  const { invert } = projection;
  if (typeof invert !== 'function') {
    return null;
  }

  const { left, top } = area;
  const outWidth = Math.max(1, Math.round(area.width));
  const outHeight = Math.max(1, Math.round(area.height));
  const [[west, south], [east, north]] = imageBounds;

  const source = document.createElement('canvas');
  source.width = image.naturalWidth;
  source.height = image.naturalHeight;
  const sourceCtx = source.getContext('2d');
  const output = document.createElement('canvas');
  output.width = outWidth;
  output.height = outHeight;
  const outputCtx = output.getContext('2d');
  if (!sourceCtx || !outputCtx) {
    return null;
  }
  sourceCtx.drawImage(image, 0, 0);

  let sourcePixels: ImageData;
  try {
    sourcePixels = sourceCtx.getImageData(0, 0, source.width, source.height);
  } catch {
    // Cross-origin image without CORS taints the canvas: bail out.
    return null;
  }

  const sourceWidth = source.width;
  const sourceHeight = source.height;
  const target = outputCtx.createImageData(outWidth, outHeight);

  for (let py = 0; py < outHeight; py += 1) {
    for (let px = 0; px < outWidth; px += 1) {
      const deviceX = left + px;
      const deviceY = top + py;

      // 1. Destination pixel -> geographic coordinate.
      const coordinates = invert([deviceX, deviceY]);
      if (!coordinates) {
        continue;
      }
      const [lon, lat] = coordinates;

      // 2. Outside the source image extent: nothing to sample.
      if (lon < west || lon > east || lat < south || lat > north) {
        continue;
      }

      // 3. Round-trip test: drop pixels hidden by the projection. Projections
      // such as `orthographic` clamp `invert` for points outside the visible
      // disk to the limb instead of returning `null`, so those coordinates pass
      // the bounds check and would smear edge colors. They are discarded here
      // because they do not project back to the pixel they came from.
      const reprojected = projection([lon, lat]);
      if (
        !reprojected ||
        Math.abs(reprojected[0] - deviceX) > 0.5 ||
        Math.abs(reprojected[1] - deviceY) > 0.5
      ) {
        continue;
      }

      // 4. Geographic coordinate -> source pixel (nearest neighbor).
      let sx = Math.floor(((lon - west) / (east - west)) * sourceWidth);
      let sy = Math.floor(((north - lat) / (north - south)) * sourceHeight);
      sx = Math.min(Math.max(sx, 0), sourceWidth - 1);
      sy = Math.min(Math.max(sy, 0), sourceHeight - 1);

      const sourceIndex = (sy * sourceWidth + sx) * 4;
      const targetIndex = (py * outWidth + px) * 4;
      target.data[targetIndex] = sourcePixels.data[sourceIndex];
      target.data[targetIndex + 1] = sourcePixels.data[sourceIndex + 1];
      target.data[targetIndex + 2] = sourcePixels.data[sourceIndex + 2];
      target.data[targetIndex + 3] = sourcePixels.data[sourceIndex + 3];
    }
  }

  outputCtx.putImageData(target, 0, 0);
  return output.toDataURL();
}
