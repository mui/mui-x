import { getRevealedBatchCount } from './useProgressiveRendering.selectors';

describe('getRevealedBatchCount', () => {
  it('returns the revealed rounds when not interacting', () => {
    expect(getRevealedBatchCount(5, 3, false)).to.equal(3);
  });

  it('never exceeds the total batch count', () => {
    expect(getRevealedBatchCount(2, 5, false)).to.equal(2);
  });

  it('clamps to the first batch while interacting', () => {
    expect(getRevealedBatchCount(5, 5, true)).to.equal(1);
    expect(getRevealedBatchCount(5, 0, true)).to.equal(1);
  });

  it('reveals nothing when the series has no batches', () => {
    expect(getRevealedBatchCount(0, 3, false)).to.equal(0);
    expect(getRevealedBatchCount(0, 3, true)).to.equal(0);
  });

  it('treats an undefined interaction flag as not interacting', () => {
    expect(getRevealedBatchCount(5, 3, undefined)).to.equal(3);
  });
});
