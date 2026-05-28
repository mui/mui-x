import { getSizeScale } from './sizeScale';

describe('sizeScale', () => {
  describe('continuous', () => {
    it('maps values linearly between two sizes', () => {
      const scale = getSizeScale({ type: 'continuous', min: 0, max: 100, size: [2, 20] });
      expect(scale(0)).to.equal(2);
      expect(scale(50)).to.equal(11);
      expect(scale(100)).to.equal(20);
    });

    it('supports an interpolation function', () => {
      const scale = getSizeScale({ type: 'continuous', min: 0, max: 10, size: (t) => t * 100 });
      expect(scale(0)).to.equal(0);
      expect(scale(5)).to.equal(50);
      expect(scale(10)).to.equal(100);
    });
  });

  describe('piecewise', () => {
    it('maps values to discrete sizes based on thresholds', () => {
      const scale = getSizeScale({ type: 'piecewise', thresholds: [10, 20], sizes: [1, 5, 10] });
      expect(scale(5)).to.equal(1);
      expect(scale(15)).to.equal(5);
      expect(scale(25)).to.equal(10);
    });
  });

  describe('ordinal', () => {
    it('maps values to sizes by their position', () => {
      const scale = getSizeScale({ type: 'ordinal', values: ['a', 'b', 'c'], sizes: [1, 2, 3] });
      expect(scale('a')).to.equal(1);
      expect(scale('b')).to.equal(2);
      expect(scale('c')).to.equal(3);
    });

    it('returns null for unknown values by default', () => {
      const scale = getSizeScale({ type: 'ordinal', values: ['a'], sizes: [1] });
      expect(scale('unknown')).to.equal(null);
    });

    it('returns unknownSize for unknown values when provided', () => {
      const scale = getSizeScale({ type: 'ordinal', values: ['a'], sizes: [1], unknownSize: 99 });
      expect(scale('unknown')).to.equal(99);
    });

    it('uses integer indices as domain when no values are provided', () => {
      const scale = getSizeScale({ type: 'ordinal', sizes: [10, 20] });
      expect(scale(0)).to.equal(10);
      expect(scale(1)).to.equal(20);
    });
  });
});
