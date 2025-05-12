import { expect } from 'chai';
import { scaleTickNumberByRange } from './ticks';

describe('scaleTickNumberByRange', () => {
  it('should return 1 when rangeGap is 0 (range start and end are the same)', () => {
    const result = scaleTickNumberByRange(10, [50, 50]);
    expect(result).to.equal(1);
  });

  it('should correctly scale tickNumber based on range', () => {
    const result = scaleTickNumberByRange(100, [0, 50]);
    expect(result).to.equal(200);
  });
});
