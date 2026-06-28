import { describe, expect, it } from 'vitest';
import { computeSummaryStats } from './summaryStats';

describe('computeSummaryStats', () => {
  it('computes each field for a hand-computed fixture [1, 2, 3, 4]', () => {
    const result = computeSummaryStats([1, 2, 3, 4]);
    expect(result.min).to.equal(1);
    expect(result.max).to.equal(4);
    expect(result.mean).to.equal(2.5);
    // even length: average of the two middle sorted values (2, 3)
    expect(result.median).to.equal(2.5);
    // population variance = 5 / 4 = 1.25, stdDev = sqrt(1.25)
    expect(result.stdDev).to.be.closeTo(Math.sqrt(1.25), 1e-12);
    expect(result.range).to.equal(3);
    expect(result.total).to.equal(10);
    expect(result.points).to.equal(4);
    // first -> last: (4 - 1) / 1 * 100
    expect(result.changePct).to.equal(300);
  });

  it('uses the sorted middle for an odd-length series', () => {
    // sorted: [1, 3, 5, 7, 9] -> median 5
    const result = computeSummaryStats([5, 1, 9, 3, 7]);
    expect(result.median).to.equal(5);
    expect(result.min).to.equal(1);
    expect(result.max).to.equal(9);
    expect(result.points).to.equal(5);
  });

  it('ignores interspersed nulls', () => {
    const result = computeSummaryStats([1, null, 2, null, 3, 4]);
    expect(result.points).to.equal(4);
    expect(result.mean).to.equal(2.5);
    expect(result.total).to.equal(10);
    expect(result.stdDev).to.be.closeTo(Math.sqrt(1.25), 1e-12);
    // first non-null is 1, last non-null is 4
    expect(result.changePct).to.equal(300);
  });

  it('returns NaN-safe zeros for an all-null series', () => {
    const result = computeSummaryStats([null, null, null]);
    expect(result).to.deep.equal({
      min: 0,
      max: 0,
      mean: 0,
      median: 0,
      stdDev: 0,
      range: 0,
      total: 0,
      points: 0,
      changePct: 0,
    });
  });

  it('returns NaN-safe zeros for an empty series', () => {
    const result = computeSummaryStats([]);
    expect(result.points).to.equal(0);
    expect(result.mean).to.equal(0);
    expect(result.stdDev).to.equal(0);
  });

  it('handles a single point', () => {
    const result = computeSummaryStats([42]);
    expect(result.min).to.equal(42);
    expect(result.max).to.equal(42);
    expect(result.mean).to.equal(42);
    expect(result.median).to.equal(42);
    expect(result.stdDev).to.equal(0);
    expect(result.range).to.equal(0);
    expect(result.total).to.equal(42);
    expect(result.points).to.equal(1);
    // first === last -> no change
    expect(result.changePct).to.equal(0);
  });

  it('handles a constant series', () => {
    const result = computeSummaryStats([7, 7, 7, 7]);
    expect(result.stdDev).to.equal(0);
    expect(result.range).to.equal(0);
    expect(result.changePct).to.equal(0);
    expect(result.mean).to.equal(7);
    expect(result.median).to.equal(7);
  });

  it('computes a negative changePct using the magnitude of the first value', () => {
    // first -> last: (5 - 10) / |10| * 100 = -50
    const result = computeSummaryStats([10, 8, 5]);
    expect(result.changePct).to.equal(-50);
  });

  it('avoids dividing by zero when the first value is 0', () => {
    const result = computeSummaryStats([0, 5, 10]);
    expect(result.changePct).to.equal(0);
  });

  it('ignores non-finite numbers', () => {
    const result = computeSummaryStats([1, Number.NaN, Infinity, 3]);
    expect(result.points).to.equal(2);
    expect(result.mean).to.equal(2);
    expect(result.total).to.equal(4);
  });
});
