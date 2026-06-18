import { describe, it, expect } from 'vitest';
import { geoMercator, geoOrthographic, type GeoProjection } from '@mui/x-charts-vendor/d3-geo';
import { getRotation } from './mapZoom.utils';

const EXTENT: [[number, number], [number, number]] = [
  [0, 0],
  [600, 400],
];

const sphere = { type: 'Sphere' } as const;

// Resolves the rotation returned by `getRotation`, applies it the same way the projection selector
// does, and returns where `geoPoint` ends up on screen — which should match the target pixel.
function projectAfterRotation(
  factory: () => GeoProjection,
  geoPoint: [number, number],
  to: [number, number],
  zoomFactor = 1,
): [number, number] | null {
  const projection = factory().fitExtent(EXTENT, sphere);
  const center = getRotation(projection, geoPoint, to, zoomFactor);
  if (!center) {
    return null;
  }
  projection.scale(projection.scale() * zoomFactor).rotate([-center[0], -center[1]]);
  return projection(geoPoint) as [number, number];
}

describe('getRotation', () => {
  it('keeps a point near the center under the cursor (mercator)', () => {
    const projected = projectAfterRotation(geoMercator, [10, 20], [320, 180]);
    expect(projected![0]).to.be.closeTo(320, 1e-4);
    expect(projected![1]).to.be.closeTo(180, 1e-4);
  });

  it('keeps an off-central-meridian, high-latitude point under the cursor (mercator)', () => {
    // The case where the previous additive implementation drifted.
    const projected = projectAfterRotation(geoMercator, [-73, 60], [120, 90]);
    expect(projected![0]).to.be.closeTo(120, 1e-4);
    expect(projected![1]).to.be.closeTo(90, 1e-4);
  });

  it('handles a non-trivial zoom factor', () => {
    const projected = projectAfterRotation(geoMercator, [40, -25], [450, 300], 2.5);
    expect(projected![0]).to.be.closeTo(450, 1e-4);
    expect(projected![1]).to.be.closeTo(300, 1e-4);
  });

  it('works for an orthographic projection', () => {
    const projected = projectAfterRotation(geoOrthographic, [15, 35], [250, 150]);
    expect(projected![0]).to.be.closeTo(250, 1e-4);
    expect(projected![1]).to.be.closeTo(150, 1e-4);
  });

  it('returns null when the projection is not invertible', () => {
    const projection = { invert: undefined } as unknown as GeoProjection;
    expect(getRotation(projection, [0, 0], [0, 0])).to.equal(null);
  });
});
