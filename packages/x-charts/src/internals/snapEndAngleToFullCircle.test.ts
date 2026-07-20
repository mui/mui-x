import { snapEndAngleToFullCircle } from './snapEndAngleToFullCircle';

const TAU = 2 * Math.PI;

describe('snapEndAngleToFullCircle', () => {
  it('should not modify arcs whose gap is clearly visible', () => {
    expect(snapEndAngleToFullCircle(0, Math.PI, 100)).to.equal(Math.PI);
    expect(snapEndAngleToFullCircle(0, TAU - 0.1, 100)).to.equal(TAU - 0.1);
    expect(snapEndAngleToFullCircle(Math.PI / 2, Math.PI, 100)).to.equal(Math.PI);
  });

  it('should not modify zero-size arcs', () => {
    expect(snapEndAngleToFullCircle(0, 0, 100)).to.equal(0);
    expect(snapEndAngleToFullCircle(Math.PI, Math.PI, 100)).to.equal(Math.PI);
  });

  it('should not modify arcs spanning the full circle or more', () => {
    expect(snapEndAngleToFullCircle(0, TAU, 100)).to.equal(TAU);
    expect(snapEndAngleToFullCircle(0, TAU + 1, 100)).to.equal(TAU + 1);
  });

  it('should snap the end angle when the gap is smaller than the path precision', () => {
    // Gap of 1e-6 radians at a radius of 100 leaves a gap of ~1e-4 pixels.
    expect(snapEndAngleToFullCircle(0, TAU - 1e-6, 100)).to.equal(TAU);
    expect(snapEndAngleToFullCircle(Math.PI, Math.PI + TAU - 1e-6, 100)).to.equal(Math.PI + TAU);
  });

  it('should snap the end angle of counterclockwise arcs', () => {
    expect(snapEndAngleToFullCircle(0, -(TAU - 1e-6), 100)).to.equal(-TAU);
  });

  it('should account for the radius when deciding to snap', () => {
    const endAngle = TAU - 1e-5;

    // Gap of ~1e-3 pixels: too small to be distinguishable from the start point.
    expect(snapEndAngleToFullCircle(0, endAngle, 100)).to.equal(TAU);
    // Gap of ~10 pixels: clearly visible.
    expect(snapEndAngleToFullCircle(0, endAngle, 1_000_000)).to.equal(endAngle);
  });

  it('should account for the pad angle when deciding to snap', () => {
    const endAngle = TAU - 1e-6;

    // The padding increases the gap left by the arc, making it visible.
    expect(snapEndAngleToFullCircle(0, endAngle, 100, 0.1)).to.equal(endAngle);
  });
});
