import { describe, expect, it } from 'vitest';
import { computeForecast } from './forecast';

describe('computeForecast', () => {
  it('fits a perfectly linear series exactly (slope 2, r2 = 1)', () => {
    // y = 2x: x = 0..4, values = [0, 2, 4, 6, 8]
    const result = computeForecast([0, 2, 4, 6, 8], 3);
    expect(result.slope).to.be.closeTo(2, 1e-12);
    expect(result.intercept).to.be.closeTo(0, 1e-12);
    expect(result.r2).to.be.closeTo(1, 1e-12);
    expect(result.fit).to.equal('strong');
    expect(result.startValue).to.be.closeTo(0, 1e-12);
    expect(result.endValue).to.be.closeTo(8, 1e-12);
    // project from index 5, 6, 7 -> 10, 12, 14
    expect(result.projected).to.have.length(3);
    expect(result.projected[0]).to.be.closeTo(10, 1e-12);
    expect(result.projected[1]).to.be.closeTo(12, 1e-12);
    expect(result.projected[2]).to.be.closeTo(14, 1e-12);
  });

  it('fits a linear series with a non-zero intercept', () => {
    // y = 3x + 5: x = 0..3, values = [5, 8, 11, 14]
    const result = computeForecast([5, 8, 11, 14], 2);
    expect(result.slope).to.be.closeTo(3, 1e-12);
    expect(result.intercept).to.be.closeTo(5, 1e-12);
    expect(result.r2).to.be.closeTo(1, 1e-12);
    // project from index 4, 5 -> 17, 20
    expect(result.projected).to.deep.equal([17, 20]);
  });

  it('returns r2 < 1 and a smaller slope for a noisy series', () => {
    // Underlying y = x but jittered; least-squares slope still positive, r2 < 1.
    const result = computeForecast([0, 2, 1, 4, 3], 1);
    expect(result.r2).to.be.lessThan(1);
    expect(result.r2).to.be.greaterThan(0);
    expect(result.slope).to.be.greaterThan(0);
  });

  it('buckets a moderate fit (0.5 <= r2 < 0.8)', () => {
    // x = 0..3, y = [0, 3, 1, 4]. mean x = 1.5, mean y = 2.
    // dx = [-1.5, -0.5, 0.5, 1.5], dy = [-2, 1, -1, 2]
    // sxy = 3 - 0.5 - 0.5 + 3 = 5; sxx = 2.25+0.25+0.25+2.25 = 5 -> slope 1
    // intercept = 2 - 1*1.5 = 0.5; preds = [0.5, 1.5, 2.5, 3.5]
    // residuals = [-0.5, 1.5, -1.5, 0.5]; ssRes = 0.25+2.25+2.25+0.25 = 5
    // ssTot = 4 + 1 + 1 + 4 = 10; r2 = 1 - 5/10 = 0.5
    const result = computeForecast([0, 3, 1, 4], 0);
    expect(result.slope).to.be.closeTo(1, 1e-12);
    expect(result.intercept).to.be.closeTo(0.5, 1e-12);
    expect(result.r2).to.be.closeTo(0.5, 1e-12);
    expect(result.fit).to.equal('moderate');
    expect(result.projected).to.deep.equal([]);
  });

  it('returns an empty projection when steps is 0', () => {
    const result = computeForecast([1, 2, 3, 4], 0);
    expect(result.projected).to.deep.equal([]);
    expect(result.slope).to.be.closeTo(1, 1e-12);
  });

  it('returns an empty projection for negative steps', () => {
    const result = computeForecast([1, 2, 3], -5);
    expect(result.projected).to.deep.equal([]);
  });

  it('ignores nulls and uses original indices as x', () => {
    // y = 2x with a hole at index 2: [0, 2, null, 6, 8]
    const result = computeForecast([0, 2, null, 6, 8], 2);
    expect(result.slope).to.be.closeTo(2, 1e-12);
    expect(result.intercept).to.be.closeTo(0, 1e-12);
    expect(result.r2).to.be.closeTo(1, 1e-12);
    // last fitted index is 4 -> project 5, 6 -> 10, 12
    expect(result.projected[0]).to.be.closeTo(10, 1e-12);
    expect(result.projected[1]).to.be.closeTo(12, 1e-12);
  });

  it('treats a constant series as a perfect flat fit (r2 = 1, slope 0)', () => {
    const result = computeForecast([7, 7, 7, 7], 2);
    expect(result.slope).to.equal(0);
    expect(result.intercept).to.be.closeTo(7, 1e-12);
    expect(result.r2).to.equal(1);
    expect(result.fit).to.equal('strong');
    expect(result.projected).to.deep.equal([7, 7]);
  });

  it('handles a single point (no line, empty projection)', () => {
    const result = computeForecast([42], 3);
    expect(result.slope).to.equal(0);
    expect(result.intercept).to.equal(42);
    expect(result.r2).to.equal(0);
    expect(result.fit).to.equal('weak');
    expect(result.projected).to.deep.equal([]);
    expect(result.startValue).to.equal(42);
    expect(result.endValue).to.equal(42);
  });

  it('handles an all-null series (NaN-safe zeros)', () => {
    const result = computeForecast([null, null, null], 2);
    expect(result.slope).to.equal(0);
    expect(result.intercept).to.equal(0);
    expect(result.r2).to.equal(0);
    expect(result.fit).to.equal('weak');
    expect(result.projected).to.deep.equal([]);
  });

  it('handles an empty series', () => {
    const result = computeForecast([], 5);
    expect(result.projected).to.deep.equal([]);
    expect(result.slope).to.equal(0);
  });
});
