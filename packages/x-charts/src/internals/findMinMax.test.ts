import { findMinMax } from './findMinMax';

describe('findMinMax', () => {
  it('should find min and max in a simple array', () => {
    expect(findMinMax([1, 2, 3, 4, 5])).to.deep.equal([1, 5]);
  });

  it('should handle negative numbers', () => {
    expect(findMinMax([-5, -2, 0, 3, 8])).to.deep.equal([-5, 8]);
  });

  it('should handle array with same numbers', () => {
    expect(findMinMax([2, 2, 2, 2])).to.deep.equal([2, 2]);
  });

  it('should handle single element array', () => {
    expect(findMinMax([1])).to.deep.equal([1, 1]);
  });

  it('should handle empty array', () => {
    expect(findMinMax([])).to.deep.equal([Infinity, -Infinity]);
  });

  it('should handle decimal numbers', () => {
    expect(findMinMax([1.5, 2.7, -3.2, 0.1])).to.deep.equal([-3.2, 2.7]);
  });

  it('should handle one million elements', () => {
    const largeArray = Array.from({ length: 1_000_000 }, (_, i) => i - 5000); // [-500, -499, ..., 499]
    expect(findMinMax(largeArray)).to.deep.equal([-5000, 994999]);
  });
});
