import { describe, it, expect } from 'vitest';
import type { GeoProjection } from '@mui/x-charts-vendor/d3-geo';
import {
  geoConicConformal,
  geoAlbersUsa,
  geoMercator,
  geoOrthographic,
  geoStereographic,
  geoAlbers,
} from '@mui/x-charts-vendor/d3-geo';
import { clampTranslationAxis, getProjectionFamily, getRotation } from './mapZoom.utils';

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
  projection.scale(projection.scale() * zoomFactor).rotate([-center[0], -center[1], center[2]]);
  return projection(geoPoint) as [number, number];
}

describe('mapZoomUtils', () => {
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

    it("keeps the roll fixed at zero for a diagonal drag ('both')", () => {
      const projection = geoOrthographic().fitExtent(EXTENT, sphere);
      const grabbed = projection.invert!([220, 140]) as [number, number];
      const rotation = getRotation(projection, grabbed, [380, 300], 1, 'both');
      expect(rotation).not.to.equal(null);
      // 'both' leaves both axes free but must not touch the roll...
      expect(rotation![2]).to.equal(0);
      // ...while still landing the grabbed point under the cursor.
      projection.rotate([-rotation![0], -rotation![1], rotation![2]]);
      const projected = projection(grabbed) as [number, number];
      expect(projected[0]).to.be.closeTo(380, 1e-4);
      expect(projected[1]).to.be.closeTo(300, 1e-4);
    });

    it("preserves an existing non-zero roll ('both')", () => {
      const projection = geoOrthographic().fitExtent(EXTENT, sphere);
      projection.rotate([-10, -5, 25]);
      const grabbed = projection.invert!([260, 170]) as [number, number];
      const rotation = getRotation(projection, grabbed, [340, 250], 1, 'both');
      expect(rotation).not.to.equal(null);
      expect(rotation![2]).to.equal(25); // roll unchanged
      projection.rotate([-rotation![0], -rotation![1], rotation![2]]);
      const projected = projection(grabbed) as [number, number];
      expect(projected[0]).to.be.closeTo(340, 1e-4);
      expect(projected[1]).to.be.closeTo(250, 1e-4);
    });

    it("lets the roll drift minimally, staying near zero for an equatorial drag ('both+roll')", () => {
      const projection = geoOrthographic().fitExtent(EXTENT, sphere);
      // Grab a point on the equator near the center and drag it horizontally along the equator.
      const grabbed = projection.invert!([300, 200]) as [number, number];
      const rotation = getRotation(projection, grabbed, [360, 200], 1, 'both+roll');
      expect(rotation).not.to.equal(null);
      // A rotation purely about the vertical (screen) axis introduces no roll.
      expect(rotation![2]).to.be.closeTo(0, 1e-6);
    });

    it("introduces the roll required by a diagonal drag ('both+roll')", () => {
      const projection = geoOrthographic().fitExtent(EXTENT, sphere);
      const grabbed = projection.invert!([220, 140]) as [number, number];
      const rotation = getRotation(projection, grabbed, [380, 300], 1, 'both+roll');
      expect(rotation).not.to.equal(null);
      // The shortest-arc rotation of a diagonal globe drag carries a non-zero roll...
      expect(Math.abs(rotation![2])).to.be.greaterThan(1e-3);
      // ...and still lands the grabbed point under the cursor.
      projection.rotate([-rotation![0], -rotation![1], rotation![2]]);
      const projected = projection(grabbed) as [number, number];
      expect(projected[0]).to.be.closeTo(380, 1e-4);
      expect(projected[1]).to.be.closeTo(300, 1e-4);
    });

    it('returns null when the projection is not invertible', () => {
      const projection = { invert: undefined } as unknown as GeoProjection;
      expect(getRotation(projection, [0, 0], [0, 0])).to.equal(null);
    });

    describe('rotationAllowed', () => {
      // A projection already rotated to center [10, 20], so the "locked" value is non-trivial.
      const rotatedProjection = () => {
        const projection = geoMercator().fitExtent(EXTENT, sphere);
        projection.rotate([-10, -20]);
        return projection;
      };
      const grabbed: [number, number] = [33, 25];
      const target: [number, number] = [120, 250];

      it("keeps the latitude fixed when rotation is restricted to 'longitude'", () => {
        const projection = rotatedProjection();
        const center = getRotation(projection, grabbed, target, 1, 'longitude');
        expect(center).not.to.equal(null);
        expect(center![1]).to.be.closeTo(20, 1e-9); // latitude unchanged
        expect(center![0]).not.to.be.closeTo(10, 1e-3); // longitude moved
      });

      it("keeps the latitude and roll fixed while panning east–west ('longitude')", () => {
        const projection = geoMercator().fitExtent(EXTENT, sphere);
        projection.rotate([-10, -20, 15]); // start from a rolled orientation
        const center = getRotation(projection, grabbed, target, 1, 'longitude');
        expect(center).not.to.equal(null);
        expect(center![1]).to.be.closeTo(20, 1e-9); // latitude unchanged
        expect(center![2]).to.be.closeTo(15, 1e-9); // roll unchanged
        expect(center![0]).not.to.be.closeTo(10, 1e-3); // longitude moved
      });

      it("returns null (no rotation) when rotation is 'none'", () => {
        const projection = rotatedProjection();
        expect(getRotation(projection, grabbed, target, 1, 'none')).to.equal(null);
      });
    });
  });

  describe('clampTranslationAxis', () => {
    // Drawing area spans [0, 600]; map bounding box [-100, 700] (wider than the area), no init offset.
    const area: [number, number] = [0, 600];
    const box: [number, number] = [-100, 700];

    it('leaves an in-range translation untouched', () => {
      expect(clampTranslationAxis(50, 0, box[0], box[1], area[0], area[1], 0)).to.equal(50);
    });

    it('clamps so no gap appears with gap = 0', () => {
      // The box may slide within [-100, 100] before an edge gap opens.
      expect(clampTranslationAxis(500, 0, box[0], box[1], area[0], area[1], 0)).to.equal(100);
      expect(clampTranslationAxis(-300, 0, box[0], box[1], area[0], area[1], 0)).to.equal(-100);
    });

    it('widens the allowed range as the gap grows', () => {
      // gap = 300 px (e.g. maxEmptySpace 0.5 of a 600px area) extends the bound from 100 to 400.
      expect(clampTranslationAxis(500, 0, box[0], box[1], area[0], area[1], 300)).to.equal(400);
    });

    it('centers a box too small to satisfy both gaps', () => {
      // Box [200, 400] (width 200) cannot cover a 600px area at gap 0, so it lands centered (300).
      expect(clampTranslationAxis(500, 0, 200, 400, area[0], area[1], 0)).to.equal(0);
    });

    it('does not constrain when the gap is infinite', () => {
      expect(clampTranslationAxis(99999, 0, box[0], box[1], area[0], area[1], Infinity)).to.equal(
        99999,
      );
    });
  });

  describe('getProjectionFamily', () => {
    it('conic detection', () => {
      expect(getProjectionFamily(geoConicConformal())).to.deep.equal('conic');
    });

    it('conic detection for Albers', () => {
      expect(getProjectionFamily(geoAlbers())).to.deep.equal('conic');
    });

    it('conic detection for Albers USA', () => {
      expect(getProjectionFamily(geoAlbersUsa())).to.deep.equal('conic');
    });

    it('cylindrical detection for Mercator', () => {
      expect(getProjectionFamily(geoMercator())).to.deep.equal('cylindrical');
    });

    it('azimuthal detection for Stereographic', () => {
      expect(getProjectionFamily(geoStereographic())).to.deep.equal('azimuthal');
    });
  });
});
