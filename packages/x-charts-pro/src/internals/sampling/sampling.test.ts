import { lttb } from './lttb';
import { m4 } from './m4';
import { normalizeIndices } from './normalizeIndices';
import { pixelBucket } from './pixelBucket';
import { bucketAggregate } from './bucketAggregate';
import { computeTargetCount } from './computeTargetCount';

describe('sampling algorithms', () => {
  describe('computeTargetCount', () => {
    it('scales with the pixel span', () => {
      // Default keeps one point every few pixels.
      expect(computeTargetCount(600, 4)).to.equal(150);
      expect(computeTargetCount(600, 1)).to.equal(600);
    });

    it('returns at least 2 for empty or invalid spans', () => {
      expect(computeTargetCount(0)).to.equal(2);
      expect(computeTargetCount(-10)).to.equal(2);
      expect(computeTargetCount(NaN)).to.equal(2);
    });
  });

  describe('lttb', () => {
    it('keeps the first and last index and returns exactly target points', () => {
      const length = 100;
      const x = Array.from({ length }, (_, i) => i);
      const y = Array.from({ length }, (_, i) => Math.sin(i / 5));
      const result = lttb(x, y, 20);

      expect(result.length).to.equal(20);
      expect(result[0]).to.equal(0);
      expect(result[result.length - 1]).to.equal(length - 1);
    });

    it('returns sorted, in-range, unique indices', () => {
      const length = 50;
      const x = Array.from({ length }, (_, i) => i);
      const y = Array.from({ length }, (_, i) => (i % 7) - 3);
      const result = lttb(x, y, 15);

      for (let i = 1; i < result.length; i += 1) {
        expect(result[i]).to.be.greaterThan(result[i - 1]);
      }
      expect(result[0]).to.be.greaterThanOrEqual(0);
      expect(result[result.length - 1]).to.be.lessThan(length);
    });

    it('preserves a prominent peak', () => {
      const length = 60;
      const x = Array.from({ length }, (_, i) => i);
      const y = Array.from({ length }, () => 0);
      y[30] = 1000; // sharp spike
      const result = lttb(x, y, 10);
      expect(result).to.include(30);
    });

    it('returns every index when target >= length', () => {
      expect(lttb([0, 1, 2], [0, 1, 2], 5)).to.deep.equal([0, 1, 2]);
    });
  });

  describe('m4', () => {
    it('keeps the first, last, min, and max of each column', () => {
      // 2 columns of 5 points. Column 0: [0..4], column 1: [5..9].
      const values = [3, 9, 1, 4, 2, 5, 0, 8, 6, 7];
      const result = m4(values, 2);
      // Column 0: first 0, last 4, min index 2 (value 1), max index 1 (value 9).
      expect(result).to.include.members([0, 1, 2, 4]);
      // Column 1: first 5, last 9, min index 6 (value 0), max index 7 (value 8).
      expect(result).to.include.members([5, 6, 7, 9]);
    });

    it('returns sorted unique indices, at most 4 per column', () => {
      const values = Array.from({ length: 100 }, (_, i) => Math.sin(i));
      const result = m4(values, 10);
      const sorted = [...result].sort((a, b) => a - b);
      expect(result).to.deep.equal(sorted);
      expect(new Set(result).size).to.equal(result.length);
      expect(result.length).to.be.lessThanOrEqual(40);
    });

    it('returns every index when columns cannot reduce the count', () => {
      expect(m4([0, 1, 2, 3], 2)).to.deep.equal([0, 1, 2, 3]);
    });
  });

  describe('normalizeIndices', () => {
    it('sorts, de-duplicates, and drops out-of-range indices', () => {
      expect(normalizeIndices([5, 2, 2, 9, -1, 7], 8)).to.deep.equal([2, 5, 7]);
    });

    it('ignores non-integer indices', () => {
      expect(normalizeIndices([0, 1.5, 3], 5)).to.deep.equal([0, 3]);
    });
  });

  describe('pixelBucket', () => {
    it('collapses points sharing a cell to a single representative', () => {
      // 4 points, two pairs within the same 2px cell.
      const xPixels = [0, 1, 50, 51];
      const yPixels = [0, 1, 50, 51];
      const result = pixelBucket(xPixels, yPixels, 2);
      expect(result).to.deep.equal([0, 2]);
    });

    it('keeps points in distinct cells', () => {
      const xPixels = [0, 10, 20];
      const yPixels = [0, 10, 20];
      const result = pixelBucket(xPixels, yPixels, 2);
      expect(result).to.deep.equal([0, 1, 2]);
    });

    it('skips NaN positions', () => {
      const result = pixelBucket([0, NaN, 10], [0, 5, NaN], 2);
      expect(result).to.deep.equal([0]);
    });
  });

  describe('bucketAggregate', () => {
    it('keeps the largest-absolute-value index per bucket', () => {
      const values = [1, -9, 2, 3, -1, 8];
      // target 2 -> buckets [0..3) and [3..6)
      const result = bucketAggregate(values, 2);
      expect(result).to.deep.equal([1, 5]); // |-9| and 8
    });

    it('returns every index when target >= length', () => {
      expect(bucketAggregate([1, 2, 3], 5)).to.deep.equal([0, 1, 2]);
    });

    it('treats null as zero', () => {
      const result = bucketAggregate([null, 4, null, null], 1);
      expect(result).to.deep.equal([1]);
    });
  });
});
