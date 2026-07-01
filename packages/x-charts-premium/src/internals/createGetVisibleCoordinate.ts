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
export function createGetVisibleCoordinate(projection: GeoProjection) {
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
