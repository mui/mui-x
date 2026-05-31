import { describe, expect, it } from 'vitest';
import { computeCorrelations } from './correlations';

describe('computeCorrelations', () => {
  it('reports a perfectly correlated pair as r = 1, strong positive', () => {
    const results = computeCorrelations({
      a: [1, 2, 3, 4],
      b: [2, 4, 6, 8],
    });
    expect(results).to.have.length(1);
    expect(results[0].a).to.equal('a');
    expect(results[0].b).to.equal('b');
    expect(results[0].r).to.be.closeTo(1, 1e-12);
    expect(results[0].strength).to.equal('strong');
    expect(results[0].direction).to.equal('positive');
  });

  it('reports a perfectly anti-correlated pair as r = -1, strong negative', () => {
    const results = computeCorrelations({
      a: [1, 2, 3, 4],
      b: [8, 6, 4, 2],
    });
    expect(results[0].r).to.be.closeTo(-1, 1e-12);
    expect(results[0].strength).to.equal('strong');
    expect(results[0].direction).to.equal('negative');
  });

  it('matches a hand-computed Pearson value', () => {
    // x = [1,2,3,4,5], y = [2,4,5,4,5]
    // meanX = 3, meanY = 4
    // cov = (-2)(-2)+(-1)(0)+(0)(1)+(1)(0)+(2)(1) = 4 + 2 = 6
    // varX = 4+1+0+1+4 = 10, varY = 4+0+1+0+1 = 6
    // r = 6 / sqrt(60) = 0.7745966692414834
    const results = computeCorrelations({
      x: [1, 2, 3, 4, 5],
      y: [2, 4, 5, 4, 5],
    });
    expect(results[0].r).to.be.closeTo(6 / Math.sqrt(60), 1e-12);
    expect(results[0].strength).to.equal('strong');
    expect(results[0].direction).to.equal('positive');
  });

  it('buckets a moderate correlation', () => {
    // x = [1,2,3,4], y = [1,3,2,5]
    // meanX = 2.5, meanY = 2.75
    // dx = [-1.5,-0.5,0.5,1.5], dy = [-1.75,0.25,-0.75,2.25]
    // cov = 2.625 - 0.125 - 0.375 + 3.375 = 5.5
    // varX = 2.25+0.25+0.25+2.25 = 5, varY = 3.0625+0.0625+0.5625+5.0625 = 8.75
    // r = 5.5 / sqrt(43.75) = 0.8315218406... -> actually strong
    // Use a different fixture for moderate:
    // x = [1,2,3,4,5], y = [3,1,4,2,5]
    // meanX = 3, meanY = 3
    // dx = [-2,-1,0,1,2], dy = [0,-2,1,-1,2]
    // cov = 0 + 2 + 0 - 1 + 4 = 5
    // varX = 10, varY = 0+4+1+1+4 = 10
    // r = 5 / sqrt(100) = 0.5
    const results = computeCorrelations({
      x: [1, 2, 3, 4, 5],
      y: [3, 1, 4, 2, 5],
    });
    expect(results[0].r).to.be.closeTo(0.5, 1e-12);
    expect(results[0].strength).to.equal('moderate');
    expect(results[0].direction).to.equal('positive');
  });

  it('returns strength none for a constant series (zero variance, no divide-by-zero)', () => {
    const results = computeCorrelations({
      a: [1, 2, 3, 4],
      b: [5, 5, 5, 5],
    });
    expect(results[0].r).to.equal(0);
    expect(results[0].strength).to.equal('none');
    // r = 0 is treated as non-negative -> positive direction.
    expect(results[0].direction).to.equal('positive');
  });

  it('drops indices where either series is null and aligns the rest', () => {
    // aligned non-null pairs: (1,2), (3,6), (4,8) -> perfectly correlated
    const results = computeCorrelations({
      a: [1, null, 3, 4],
      b: [2, 4, 6, 8],
    });
    expect(results[0].r).to.be.closeTo(1, 1e-12);
    expect(results[0].strength).to.equal('strong');
  });

  it('produces one result per distinct unordered pair', () => {
    const results = computeCorrelations({
      a: [1, 2, 3],
      b: [3, 2, 1],
      c: [1, 1, 2],
    });
    expect(results).to.have.length(3);
    expect(results.map((entry) => `${entry.a}-${entry.b}`)).to.deep.equal([
      'a-b',
      'a-c',
      'b-c',
    ]);
  });

  it('returns r = 0 when fewer than two aligned pairs remain', () => {
    const results = computeCorrelations({
      a: [1, null, null],
      b: [2, 4, 6],
    });
    expect(results[0].r).to.equal(0);
    expect(results[0].strength).to.equal('none');
  });

  it('ignores non-finite values', () => {
    const results = computeCorrelations({
      a: [1, Number.NaN, 3, 4],
      b: [2, 4, 6, 8],
    });
    // (1,2),(3,6),(4,8) -> perfectly correlated
    expect(results[0].r).to.be.closeTo(1, 1e-12);
  });

  it('returns an empty array for fewer than two series', () => {
    expect(computeCorrelations({})).to.deep.equal([]);
    expect(computeCorrelations({ only: [1, 2, 3] })).to.deep.equal([]);
  });
});
