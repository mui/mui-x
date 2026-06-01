import { describe, expect, it } from 'vitest';
import { resolveZoomData } from './chartFocusState';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

describe('resolveZoomData', () => {
  it('maps a category window to start/end percentages', () => {
    // Jul = index 6, Sep = index 8, of 11 (max index) -> 54.5% .. 72.7%
    const result = resolveZoomData({ from: 'Jul', to: 'Sep' }, MONTHS, 'x');
    expect(result).to.have.length(1);
    expect(result![0].axisId).to.equal('x');
    expect(result![0].start).to.be.closeTo((6 / 11) * 100, 1e-9);
    expect(result![0].end).to.be.closeTo((8 / 11) * 100, 1e-9);
  });

  it('accepts numeric indices and orders them', () => {
    const result = resolveZoomData({ from: 8, to: 6 }, MONTHS, 'x');
    expect(result![0].start).to.be.closeTo((6 / 11) * 100, 1e-9);
    expect(result![0].end).to.be.closeTo((8 / 11) * 100, 1e-9);
  });

  it('returns undefined for unknown categories or too-few points', () => {
    expect(resolveZoomData({ from: 'Q3', to: 'Q4' }, MONTHS, 'x')).to.equal(undefined);
    expect(resolveZoomData({ from: 'Jan', to: 'Feb' }, ['Jan'], 'x')).to.equal(undefined);
    expect(resolveZoomData(undefined, MONTHS, 'x')).to.equal(undefined);
  });
});
