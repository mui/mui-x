import { expect } from 'chai';

import isPlainObject from '../../src/utils/isPlainObject';

describe('utils/isPlainObject', () => {
  it('should return true for an object', () => {
    expect(isPlainObject(null)).to.be.equal(false);
    expect(isPlainObject('')).to.be.equal(false);
    expect(isPlainObject(1)).to.be.equal(false);
    expect(isPlainObject(false)).to.be.equal(false);
    expect(isPlainObject(() => {})).to.be.equal(false);
    expect(isPlainObject({})).to.be.equal(true);
  });
});
