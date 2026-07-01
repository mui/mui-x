import type { GeoProjection, GeoStream } from '@mui/x-charts-vendor/d3-geo';

// A `GeoStream` sink that only records whether a point passed through (and where),
// so a projection/clip pipeline can be probed one point at a time.
interface PointSink extends GeoStream {
  hit: boolean;
  x: number;
  y: number;
}

function createPointSink(): PointSink {
  const sink: PointSink = {
    hit: false,
    x: 0,
    y: 0,
    point(x, y) {
      sink.hit = true;
      sink.x = x;
      sink.y = y;
    },
    lineStart() {},
    lineEnd() {},
    polygonStart() {},
    polygonEnd() {},
  };
  return sink;
}

/**
 * Builds a test that maps a device pixel to its `[lon, lat]`, or `null` when the
 * pixel is not part of the visible map. It combines two clips that `projection.invert`
 * alone misses:
 *
 * - the **post-clip** (cartesian) stream rejects device pixels outside the clip
 *   rectangle — relevant once the map is panned/zoomed with a `clipExtent`;
 * - streaming the inverted coordinate **back** through the projection applies the
 *   pre-clip (spherical) boundary and checks the round trip: azimuthal projections
 *   clamp `invert` outside the visible disk to the limb, and those clamped points do
 *   not project back to the pixel they came from.
 */
function createVisibleCoordinate(projection: GeoProjection) {
  const invert = projection.invert!;

  const forwardSink = createPointSink();
  const forwardStream = projection.stream(forwardSink);

  const postClip = projection.postclip?.();
  const clipSink = createPointSink();
  const clipStream = postClip?.(clipSink);

  return ([deviceX, deviceY]: [number, number]): [number, number] | null => {
    if (clipStream) {
      clipSink.hit = false;
      clipStream.point(deviceX, deviceY);
      if (!clipSink.hit) {
        return null;
      }
    }

    const coordinates = invert([deviceX, deviceY]);
    if (!coordinates) {
      return null;
    }

    forwardSink.hit = false;
    forwardStream.point(coordinates[0], coordinates[1]);
    if (
      !forwardSink.hit ||
      Math.abs(forwardSink.x - deviceX) > 0.5 ||
      Math.abs(forwardSink.y - deviceY) > 0.5
    ) {
      return null;
    }

    return coordinates;
  };
}

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
   * in degrees. `west > east` is allowed and means the range wraps across the antimeridian.
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
 * 1. Convert it to SVG coordinates `(left + px, top + py)` and resolve it to a
 *    `[lon, lat]` coordinate with {@link createVisibleCoordinate}, which returns
 *    `null` for pixels outside the visible map (post-clip and the spherical
 *    round-trip), leaving them transparent.
 * 2. Discard coordinates outside `imageBounds` (no source data there).
 * 3. Map `[lon, lat]` to a source pixel with nearest-neighbor sampling (the image
 *    being equirectangular, both axes are linear) and copy its RGBA.
 *
 * ### Failure modes
 *
 * Returns `null` when a 2D canvas context is unavailable, or when reading the
 * source pixels throws because a cross-origin image without CORS headers has
 * tainted the canvas.
 *
 * Complexity is `O(width × height)`; callers should treat it as a per-resize
 * computation rather than a per-frame one.
 */
export function reprojectEquirectangularImage(
  params: ReprojectEquirectangularImageParams,
): string | null {
  const { image, projection, area, imageBounds } = params;
  if (typeof projection.invert !== 'function') {
    return null;
  }
  const visibleCoordinateAt = createVisibleCoordinate(projection);

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

  // `west > east` means the source wraps across the antimeridian (e.g. 170°E..-170°E).
  const lonWraps = east < west;
  const lonSpan = lonWraps ? east - west + 360 : east - west;

  for (let py = 0; py < outHeight; py += 1) {
    for (let px = 0; px < outWidth; px += 1) {
      // 1. Destination pixel -> geographic coordinate, or skip if not on the map.
      const coordinates = visibleCoordinateAt([left + px, top + py]);
      if (!coordinates) {
        continue;
      }
      const [lon, lat] = coordinates;

      // 2. Outside the source image extent: nothing to sample.
      const insideLon = lonWraps ? lon >= west || lon <= east : lon >= west && lon <= east;
      if (!insideLon || lat < south || lat > north) {
        continue;
      }

      // 3. Geographic coordinate -> source pixel (nearest neighbor). When the
      // bounds wrap, longitudes past the antimeridian are offset by a full turn.
      const lonOffset = lonWraps && lon <= east ? lon - west + 360 : lon - west;
      let sx = Math.floor((lonOffset / lonSpan) * sourceWidth);
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
