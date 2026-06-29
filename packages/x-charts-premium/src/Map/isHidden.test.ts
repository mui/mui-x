import { geoEquirectangular, geoOrthographic } from '@mui/x-charts-vendor/d3-geo';
import { isCoordinateHidden } from './isHidden';

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
