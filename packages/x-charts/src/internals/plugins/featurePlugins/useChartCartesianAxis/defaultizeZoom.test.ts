import { getEffectiveZoomReverse } from './defaultizeZoom';

describe('getEffectiveZoomReverse', () => {
  describe('X axis', () => {
    it('returns the original reverse for linear scale', () => {
      expect(getEffectiveZoomReverse('x', 'linear', false)).to.equal(false);
      expect(getEffectiveZoomReverse('x', 'linear', true)).to.equal(true);
    });

    it('returns the original reverse for band scale', () => {
      // X axis ordinal scales are not auto-reversed in rendering, so the flag passes through.
      expect(getEffectiveZoomReverse('x', 'band', false)).to.equal(false);
      expect(getEffectiveZoomReverse('x', 'band', true)).to.equal(true);
    });

    it('returns the original reverse for point scale', () => {
      expect(getEffectiveZoomReverse('x', 'point', false)).to.equal(false);
      expect(getEffectiveZoomReverse('x', 'point', true)).to.equal(true);
    });
  });

  describe('Y axis', () => {
    it('returns the original reverse for linear scale', () => {
      expect(getEffectiveZoomReverse('y', 'linear', false)).to.equal(false);
      expect(getEffectiveZoomReverse('y', 'linear', true)).to.equal(true);
    });

    it('inverts the reverse for band scale (ordinal Y renders top-down)', () => {
      expect(getEffectiveZoomReverse('y', 'band', false)).to.equal(true);
      expect(getEffectiveZoomReverse('y', 'band', true)).to.equal(false);
    });

    it('inverts the reverse for point scale', () => {
      expect(getEffectiveZoomReverse('y', 'point', false)).to.equal(true);
      expect(getEffectiveZoomReverse('y', 'point', true)).to.equal(false);
    });

    it('treats undefined reverse as false before inverting', () => {
      expect(getEffectiveZoomReverse('y', 'band', undefined)).to.equal(true);
      expect(getEffectiveZoomReverse('y', 'linear', undefined)).to.equal(false);
    });

    it('does not invert continuous scales', () => {
      expect(getEffectiveZoomReverse('y', 'log', false)).to.equal(false);
      expect(getEffectiveZoomReverse('y', 'time', false)).to.equal(false);
      expect(getEffectiveZoomReverse('y', 'pow', true)).to.equal(true);
    });
  });
});
