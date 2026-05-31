import { describe, expect, it } from 'vitest';
import { computeCumulative, computeTrend } from './derivedSeries';

describe('computeTrend', () => {
  it('fits a perfect line through linear data', () => {
    const result = computeTrend([0, 2, 4, 6]);
    expect(result).to.deep.equal([0, 2, 4, 6]);
  });

  it('evaluates the fitted line at null positions too', () => {
    // points (0,0) and (2,4) -> slope 2; index 1 (null) -> 2, index 3 -> 6
    const result = computeTrend([0, null, 4, null]);
    expect(result).to.deep.equal([0, 2, 4, 6]);
  });

  it('returns all-null when fewer than two numeric points', () => {
    expect(computeTrend([null, 5, null])).to.deep.equal([null, null, null]);
    expect(computeTrend([])).to.deep.equal([]);
  });
});

describe('computeCumulative', () => {
  it('accumulates a running total', () => {
    expect(computeCumulative([1, 2, 3, 4])).to.deep.equal([1, 3, 6, 10]);
  });

  it('carries the total across nulls and stays null before the first value', () => {
    expect(computeCumulative([null, 2, null, 3])).to.deep.equal([null, 2, 2, 5]);
  });

  it('handles an all-null series', () => {
    expect(computeCumulative([null, null])).to.deep.equal([null, null]);
  });
});
