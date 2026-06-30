import { geoEquirectangular, geoOrthographic } from '@mui/x-charts-vendor/d3-geo';
import { isCoordinateHidden, projectVisiblePoint } from './isHidden';

describe('isCoordinateHidden', () => {
  it('returns false for any coordinate with a full-globe projection', () => {
    const projection = geoEquirectangular();
    expect(isCoordinateHidden(projection, [0, 0])).to.equal(false);
    expect(isCoordinateHidden(projection, [120, 40])).to.equal(false);
    expect(isCoordinateHidden(projection, [-150, -60])).to.equal(false);
  });

  it('returns false for coordinates on the visible hemisphere of an orthographic projection', () => {
    const projection = geoOrthographic();
    expect(isCoordinateHidden(projection, [0, 0])).to.equal(false);
    expect(isCoordinateHidden(projection, [20, 20])).to.equal(false);
  });

  it('returns true for coordinates on the hidden hemisphere of an orthographic projection', () => {
    const projection = geoOrthographic();
    expect(isCoordinateHidden(projection, [180, 0])).to.equal(true);
    expect(isCoordinateHidden(projection, [-160, 0])).to.equal(true);
  });

  it('respects the projection rotation when culling', () => {
    const projection = geoOrthographic().rotate([-180, 0]);
    expect(isCoordinateHidden(projection, [180, 0])).to.equal(false);
    expect(isCoordinateHidden(projection, [0, 0])).to.equal(true);
  });
});

describe('projectVisiblePoint', () => {
  const drawingArea = { left: 0, top: 0, width: 100, height: 100 };

  it('returns the projected point when it falls inside the drawing area', () => {
    const projection = geoEquirectangular().scale(100).translate([50, 50]);
    expect(projectVisiblePoint(projection, [0, 0], drawingArea)).not.to.equal(null);
  });

  it('returns null when the projected point falls outside the drawing area', () => {
    const projection = geoEquirectangular().scale(100).translate([0, 0]);
    expect(
      projectVisiblePoint(projection, [0, 0], { left: 10, top: 10, width: 100, height: 100 }),
    ).to.equal(null);
  });

  it('returns null for a coordinate hidden by the projection', () => {
    const projection = geoOrthographic();
    expect(projectVisiblePoint(projection, [180, 0], drawingArea)).to.equal(null);
  });
});
