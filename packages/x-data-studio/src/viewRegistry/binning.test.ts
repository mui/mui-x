import { describe, expect, it } from 'vitest';
import { dateBucket, numericBucket, numericBucketLabel } from './binning';

describe('binning', () => {
  describe('dateBucket', () => {
    const date = new Date('2026-03-14T10:00:00Z');

    it('buckets to the year', () => {
      expect(dateBucket(date, 'year')).toBe('2026');
    });

    it('buckets to the quarter', () => {
      expect(dateBucket(date, 'quarter')).toBe('2026-Q1');
      expect(dateBucket(new Date('2026-11-02'), 'quarter')).toBe('2026-Q4');
    });

    it('buckets to the month (zero-padded)', () => {
      expect(dateBucket(date, 'month')).toBe('2026-03');
      expect(dateBucket(new Date('2026-12-31'), 'month')).toBe('2026-12');
    });

    it('buckets to the day (zero-padded)', () => {
      expect(dateBucket(new Date('2026-03-04'), 'day')).toBe('2026-03-04');
    });

    it('accepts ISO strings and epoch numbers', () => {
      expect(dateBucket('2026-03-14', 'month')).toBe('2026-03');
      expect(dateBucket(date.getTime(), 'year')).toBe('2026');
    });

    it('returns null for empty or unparseable values', () => {
      expect(dateBucket(null, 'month')).toBe(null);
      expect(dateBucket('', 'month')).toBe(null);
      expect(dateBucket('not a date', 'month')).toBe(null);
    });

    it('produces lexically-sortable month buckets', () => {
      const buckets = [
        dateBucket(new Date('2026-02-01'), 'month'),
        dateBucket(new Date('2025-12-01'), 'month'),
        dateBucket(new Date('2026-01-01'), 'month'),
      ];
      expect([...buckets].sort()).toEqual(['2025-12', '2026-01', '2026-02']);
    });
  });

  describe('numericBucket', () => {
    it('buckets into the lower bound of equal-width brackets', () => {
      // [0,100] into 10 bins → width 10.
      expect(numericBucket(0, 0, 100, 10)).toBe(0);
      expect(numericBucket(5, 0, 100, 10)).toBe(0);
      expect(numericBucket(10, 0, 100, 10)).toBe(10);
      expect(numericBucket(27, 0, 100, 10)).toBe(20);
    });

    it('clamps the max value into the last bracket (not its own bin)', () => {
      expect(numericBucket(100, 0, 100, 10)).toBe(90);
    });

    it('returns the min when the range is degenerate', () => {
      expect(numericBucket(5, 5, 5, 10)).toBe(5);
    });

    it('rounds sub-unit bounds to a readable precision', () => {
      // [0,1] into 4 bins → width 0.25.
      expect(numericBucket(0.3, 0, 1, 4)).toBe(0.25);
      expect(numericBucket(0.8, 0, 1, 4)).toBe(0.75);
    });

    it('returns null for non-finite values', () => {
      expect(numericBucket(Number.NaN, 0, 100, 10)).toBe(null);
      expect(numericBucket(Infinity, 0, 100, 10)).toBe(null);
    });

    it('produces numerically-sortable bucket bounds', () => {
      const bounds = [
        numericBucket(95, 0, 100, 10),
        numericBucket(5, 0, 100, 10),
        numericBucket(25, 0, 100, 10),
      ];
      expect([...bounds].sort((a, b) => (a as number) - (b as number))).toEqual([0, 20, 90]);
    });
  });

  describe('numericBucketLabel', () => {
    it('renders a lower–upper range for a bucket bound', () => {
      expect(numericBucketLabel(20, 0, 100, 10)).toBe('20 – 30');
      expect(numericBucketLabel(0, 0, 100, 10)).toBe('0 – 10');
    });

    it('renders a bare bound for a degenerate range', () => {
      expect(numericBucketLabel(5, 5, 5, 10)).toBe('5');
    });
  });
});
