import { describe, expect, it } from 'vitest';
import { detectAnomalies } from './anomalies';

describe('detectAnomalies', () => {
  it('flags a single big jump in an otherwise flat series', () => {
    // deltas: [0, 0, 0, 0, 100] -> mean(|delta|) = 20, jump ratio = 5
    const result = detectAnomalies([10, 10, 10, 10, 10, 110]);
    expect(result).to.have.length(1);
    expect(result[0].index).to.equal(5);
    expect(result[0].value).to.equal(110);
    expect(result[0].delta).to.equal(100);
    expect(result[0].kind).to.equal('spike');
    expect(result[0].ratio).to.be.closeTo(5, 1e-12);
    expect(result[0].seriesId).to.equal('');
  });

  it('classifies a negative jump as a drop', () => {
    // deltas: [0, 0, 0, 0, -90] -> mean(|delta|) = 18, drop ratio = 5
    const result = detectAnomalies([100, 100, 100, 100, 100, 10]);
    expect(result).to.have.length(1);
    expect(result[0].index).to.equal(5);
    expect(result[0].value).to.equal(10);
    expect(result[0].delta).to.equal(-90);
    expect(result[0].kind).to.equal('drop');
    expect(result[0].ratio).to.be.closeTo(5, 1e-12);
  });

  it('yields no anomalies for a smoothly increasing series', () => {
    // constant step of 1 -> every ratio is exactly 1, below the threshold
    const result = detectAnomalies([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(result).to.have.length(0);
  });

  it('respects a custom threshold', () => {
    // ratio at the jump is 5: below a threshold of 6, at/above a threshold of 3
    const values = [10, 10, 10, 10, 10, 110];
    expect(detectAnomalies(values, { threshold: 6 })).to.have.length(0);
    expect(detectAnomalies(values, { threshold: 3 })).to.have.length(1);
  });

  it('flags both a spike and the matching drop when a series jumps and returns', () => {
    // deltas: [0, 0, 0, 90, -90, 0, 0] -> sum|delta| = 180, mean = 180/7
    const result = detectAnomalies([10, 10, 10, 10, 100, 10, 10, 10]);
    expect(result).to.have.length(2);
    expect(result[0].index).to.equal(4);
    expect(result[0].kind).to.equal('spike');
    expect(result[1].index).to.equal(5);
    expect(result[1].kind).to.equal('drop');
    // ratio = 90 / (180 / 7) = 3.5
    expect(result[0].ratio).to.be.closeTo(3.5, 1e-12);
    expect(result[1].ratio).to.be.closeTo(3.5, 1e-12);
  });

  it('returns nothing for a constant (flat) series', () => {
    expect(detectAnomalies([5, 5, 5, 5, 5])).to.have.length(0);
  });

  it('returns nothing for an all-null series', () => {
    expect(detectAnomalies([null, null, null])).to.have.length(0);
  });

  it('returns nothing for a single point', () => {
    expect(detectAnomalies([42])).to.have.length(0);
  });

  it('returns nothing for an empty series', () => {
    expect(detectAnomalies([])).to.have.length(0);
  });

  it('computes deltas against the most recent finite value across nulls', () => {
    // finite points at indices 0,2,4 -> deltas [0, 100] at indices 2 and 4
    // mean(|delta|) = 50, jump ratio = 2 (below default 3) so nothing yet
    expect(detectAnomalies([10, null, 10, null, 110])).to.have.length(0);
    // with a smaller threshold the jump at index 4 is flagged
    const result = detectAnomalies([10, null, 10, null, 110], { threshold: 2 });
    expect(result).to.have.length(1);
    expect(result[0].index).to.equal(4);
    expect(result[0].value).to.equal(110);
    expect(result[0].delta).to.equal(100);
    expect(result[0].kind).to.equal('spike');
  });

  it('ignores non-finite numbers', () => {
    const result = detectAnomalies([10, Number.NaN, 10, 10, 10, 110]);
    expect(result).to.have.length(1);
    expect(result[0].index).to.equal(5);
  });
});
