import { expect } from 'chai';
import { fastArrayCompare } from './fastArrayCompare';

describe('fastArrayCompare', () => {
  it('should return true if arrays are equal', () => {
    expect(fastArrayCompare([1, 2, 3], [1, 2, 3])).to.equal(true);
  });

  it('should return false if arrays are not equal', () => {
    expect(fastArrayCompare([1, 2, 3], [1, 2, 4])).to.equal(false);
  });

  it('should return false if arrays have different lengths', () => {
    expect(fastArrayCompare([1, 2, 3], [1, 2])).to.equal(false);
  });

  it('should return false if one of the arguments is not an array', () => {
    // @ts-expect-error
    expect(fastArrayCompare([1, 2, 3], 1)).to.equal(false);
  });

  it('should return false if both arguments are not an array', () => {
    expect(fastArrayCompare(1, 2)).to.equal(false);
  });

  it('should return true if both arguments are the same array', () => {
    const arr = [1, 2, 3];
    expect(fastArrayCompare(arr, arr)).to.equal(true);
  });

  it('should return true if both arguments are empty arrays', () => {
    expect(fastArrayCompare([], [])).to.equal(true);
  });
});
